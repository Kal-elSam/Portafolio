
import Image from 'next/image';
import React, { useState } from 'react';

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


  return (
    <div className="container mx-auto my-10 px-4">
    <div className="flex justify-center my-4 ">
      <div className="flex space-x-4">
        {projectsData.map((project) => (
          <button
            type="button"
            key={project.projectName}
            onClick={() => {
              setSelectedProject(project);
              setCurrentImageIndex(0);
            }}
            className={`min-w-max rounded-lg bg-white px-4 py-2 shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
              selectedProject.projectName === project.projectName
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            {project.company} - {project.projectName}
          </button>
        ))}
      </div>
      </div>
  
      <h2 className="text-center text-2xl font-bold text-gray-800 my-4">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 bg-opacity-50 p-2 text-white focus:outline-none"
              onClick={goToPrevious}
            >
              &#10094;
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 bg-opacity-50 p-2 text-white focus:outline-none"
              onClick={goToNext}
            >
              &#10095;
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
