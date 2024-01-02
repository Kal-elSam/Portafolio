import clsx from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import SectionContent from '@/components/sections/SectionContent';

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
    <SectionContent>
    <div className=" mx-auto px-4 pt-8">
      <div className="my-4 flex justify-center">
        <Swiper
          spaceBetween={0} // 0 espacio entre slides
          slidesPerView={swiperSettings.slidesPerView}
          navigation={swiperSettings.navigation}
          loop={swiperSettings.loop}
          centeredSlides={swiperSettings.centeredSlides}
          pagination={swiperSettings.pagination}
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
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
                  'flex h-[50px] w-[214px] items-center justify-start rounded-[4px] p-[10px]',
                  'gap-[12px] text-sm transition-all duration-300 ease-in-out',
                  selectedProject.projectName === project.projectName
                    ? 'text-white' // botón activo
                    : 'text-gray-700', // botón inactivo
                  'hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                )}
                style={{
                  background:
                    'linear-gradient(0deg, #111A2C, #111A2C), linear-gradient(0deg, #35415D, #35415D)',
                  border: '0.5px solid #35415D',
                }}
              >
                {/* Icono */}
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    src={project.iconPath}
                    alt={`Icono de ${project.projectName}`}
                    width={30}
                    height={30}
                    objectFit="cover"
                  />
                </div>

                {/* Texto */}
                <div
                  className="flex flex-col justify-center"
                  style={{
                    width: '140px',
                    height: '15px',
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '15px',
                    textAlign: 'left',
                  }}
                >
                  <span>{project.projectName}</span>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <h2 className="my-4 pt-8 text-center text-2xl font-bold text-white">
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
            objectFit="contain"
            layout="intrinsic"
          />
        )}

        {screenshots.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full p-2 text-white shadow-lg transition duration-200 ease-out focus:outline-none"
              onClick={goToPrevious}
              style={{
                width: '40px', // Tamaño aumentado
                height: '40px', // Tamaño aumentado
                backgroundColor: '#6A7AB3',
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full p-2 text-white shadow-lg transition duration-200 ease-out focus:outline-none"
              onClick={goToNext}
              style={{
                width: '40px', // Tamaño aumentado
                height: '40px', // Tamaño aumentado
                backgroundColor: '#6A7AB3',
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
    </SectionContent>
  );
}

export default WireframeSection;
