import Image from 'next/image';
import React, { useState } from 'react';

interface CarouselProps {
  images: string[];
}

// eslint-disable-next-line react/function-component-definition
const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);


  const goPrev = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-screen" data-carousel="slide">
      {/* Asegura que el carrusel cubra toda la altura de la pantalla */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div key={image} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
            {/* Usar Image de Next.js para optimizar la carga */}
            <Image src={image} alt={`Slide ${index}`} layout="fill" objectFit="contain" priority={index === currentIndex} />
          </div>
        ))}
      </div>

      {/* Botones para navegar entre los slides */}
      <button
        type="button"
        className="group absolute top-0 left-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
        onClick={goPrev}
        data-carousel-prev
      >
        {/* Icono de 'Anterior' */}
      </button>
      <button
        type="button"
        className="group absolute top-0 right-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
        onClick={goNext}
        data-carousel-next
      >
        {/* Icono de 'Siguiente' */}
      </button>
    </div>
  );
}
// Rutas relativas desde la carpeta public
const mobileImages: string[] = [
  '/assets/projects/lemu/1.png',
  '/assets/projects/lemu/2.png',
  '/assets/projects/lemu/3.png',
  '/assets/projects/lemu/4.png',
];

const webImages: string[] = [
  '/assets/projects/kc/crm/crm-cartera.png',
  '/assets/projects/kc/crm/crm-home.png',
  '/assets/projects/kc/crm/crm-login.png',
  '/assets/projects/kc/crm/crm-tickets.png',
];

function MobileShowcase() {
  return <Carousel images={mobileImages} />;
}

function WebShowcase() {
  return <Carousel images={webImages} />;
}

export { Carousel, MobileShowcase, WebShowcase };
