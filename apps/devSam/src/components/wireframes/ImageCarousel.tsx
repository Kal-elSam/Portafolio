import Image from 'next/image';
import { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  // width: number;
  // height: number;
  altText: string;
  className?: string; 
}

function ImageCarousel({ images, altText, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className={className}>
      {images.length ? (
        <Image src={images[currentIndex]} alt={altText} layout="fill" objectFit="cover" />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          {/* Aquí puede colocar un esqueleto o un placeholder mientras la imagen se carga */}
        </div>
      )}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevImage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black text-white"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goToNextImage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black text-white"
          >
            →
          </button>
        </>
      )}
    </div>
  );
};


export default ImageCarousel;
