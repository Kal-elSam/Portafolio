import Image from 'next/image';
import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

type ProjectWireframeProps = {
  projectName: string;
  iphoneScreenshots?: string[];
  macScreenshots?: string[];
};

function ProjectWireframe({
  projectName,
  iphoneScreenshots = [],
  macScreenshots = [],
}: ProjectWireframeProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isMobileProject = iphoneScreenshots.length > 0;
  const screenshots = isMobileProject ? iphoneScreenshots : macScreenshots;

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTouchEnd = (e: TouchEvent, touchStartX: number) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      goToNextImage();
    } else if (touchStartX - touchEndX < -50) {
      goToPreviousImage();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStartX = e.touches[0].clientX;
    e.target.addEventListener('touchend', (ev: any) => handleTouchEnd(ev, touchStartX), { once: true });
  };

  return (
    <div
      className="flex justify-center items-center h-[300px] sm:h-[400px] md:h-[500px] lg:h-full w-full relative"
      onTouchStart={handleTouchStart}
    >
      <button
        type="button"
        className="absolute left-0 z-10 p-2 bg-black bg-opacity-50 rounded-full focus:outline-none sm:p-3"
        onClick={goToPreviousImage}
        aria-label="Previous Image"
      >
        <FaArrowLeft className="text-white" />
      </button>
      <div className=" h-full w-full">
        <Image
          src={screenshots[currentImageIndex]}
          alt={`${projectName} screenshot ${currentImageIndex + 1}`}
          fill
          style={{ objectFit: 'contain' }}
          className="rounded-lg shadow-md"
        />
      </div>
      <button
        type="button"
        className="absolute right-0 z-10 p-2 bg-black bg-opacity-50 rounded-full focus:outline-none sm:p-3"
        onClick={goToNextImage}
        aria-label="Next Image"
      >
        <FaArrowRight className="text-white" />
      </button>
    </div>
  );
}

export default ProjectWireframe;
