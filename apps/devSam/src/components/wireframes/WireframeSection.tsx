import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import projectsData from '@/contents/projects/proyects';

function WireframeSection() {
  const [selectedProject, setSelectedProject] = useState(projectsData[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isMobileProject = selectedProject.iphoneScreenshots != null;
  const screenshots = isMobileProject
    ? selectedProject.iphoneScreenshots
    : selectedProject.macScreenshots || [];

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  const imageSize = isMobileProject
    ? { width: 220, height: 425 }
    : { width: 1300, height: 900 };

  // Configuración para Swiper
  const swiperSettings = {
    modules: [Autoplay],
    spaceBetween: 0, // Ajusta este valor según necesites
    slidesPerView: 5, // Usar 'auto' para ajustar la vista según el ancho del contenido
    navigation: false,
    pagination: { clickable: true },
    loop: true,
    centeredSlides: true,
    slideToClickedSlide: true,
    speed: 900,
  };

  return (
    <div className="container mx-auto my-10 px-4">
      <div className="my-4 flex justify-center">
        <Swiper
          spaceBetween={0} // 0 espacio entre slides
          slidesPerView={swiperSettings.slidesPerView}
          navigation={swiperSettings.navigation}
          loop={swiperSettings.loop}
          centeredSlides={swiperSettings.centeredSlides}
          pagination={swiperSettings.pagination}
          modules={[Autoplay]}
          autoplay={{ delay: 1000 }}
        >
          {projectsData.map((project) => (
            <SwiperSlide key={project.projectName}>
              <button
                type="button"
                onClick={() => {
                  setSelectedProject(project);
                  setCurrentImageIndex(0);
                }}
                className={clsx(
                  'min-w-[160px] flex-shrink-0 rounded-xl p-2 text-center text-sm transition-all duration-300 ease-in-out',
                  'flex flex-col items-center', // para alinear verticalmente
                  selectedProject.projectName === project.projectName
                    ? 'bg-blue-900 text-white' // botón activo
                    : 'bg-gray-200 text-gray-700', // botón inactivo
                  'hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                )}
              >
                {/* Aquí puedes añadir un icono si es necesario */}
                <span className="text-2xl font-black">
                  {/* Icono aquí si es necesario */}
                </span>
                <span>{project.company}</span>
                <span>{project.projectName}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <h2 className="my-4 text-center text-2xl font-bold text-gray-800">
        {selectedProject.company} - {selectedProject.projectName}
      </h2>

      <div className="relative flex w-full items-center justify-center overflow-hidden rounded-lg shadow-lg">
        {screenshots.length > 0 && (
          <Image
            src={screenshots[currentImageIndex]}
            alt={`${selectedProject.projectName} Screenshot ${
              currentImageIndex + 1
            }`}
            width={imageSize.width}
            height={imageSize.height}
            objectFit="contain" // Esto asegurará que la imagen se mantenga dentro de sus dimensiones sin recortar
            layout="intrinsic" // Esto permite que la imagen use las dimensiones definidas
          />
        )}

        {screenshots.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              className="bg-primary hover:bg-primary-dark absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-opacity-70 p-3 text-white shadow-lg transition duration-300 ease-in-out focus:outline-none"
              onClick={goToPrevious}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="bg-primary hover:bg-primary-dark absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-opacity-70 p-3 text-white shadow-lg transition duration-300 ease-in-out focus:outline-none"
              onClick={goToNext}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex justify-center space-x-1">
        {screenshots.map((path) => (
          <button
            type="button"
            key={path} // Aquí usamos la ruta de la imagen como clave, que es única
            aria-label={`Go to image ${path}`}
            className={`block h-2 w-2 rounded-full ${
              screenshots[currentImageIndex] === path
                ? 'bg-blue-600'
                : 'bg-gray-300'
            }`}
            onClick={() => setCurrentImageIndex(screenshots.indexOf(path))}
          />
        ))}
      </div>
    </div>
  );
}

export default WireframeSection;
