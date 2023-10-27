import React from 'react';

import ImageCarousel from './ImageCarousel';

interface ShowcaseProps {
  screenshots: string[];
}



function IphoneShowcase({ screenshots = [] }: ShowcaseProps) {
  return (
    <div 
      style={{
        background: `url('apps/devSam/public/assets/iPhone 15 Pro Max - Black Titanium - Portrait.png') no-repeat center/cover`,
        width: '401px',
        height: '323px'
      }}
      className="relative">
      <div className="mt-7 mb-7 mx-auto w-52 h-96 bg-white rounded-xl overflow-hidden">
        {/* Espacio para el carrusel de imágenes cuando esté listo */}
      </div>
    </div>
  );
}

function MacShowcase({ screenshots = [] }: ShowcaseProps) {
  return (
    <div 
      style={{
        background: `url('apps/devSam/public/assets/MacBook Air 13" - 4th Gen - Midnight.png') no-repeat center/cover`,
        width: '397px',
        height: '822px'
      }}
      className="relative">
      <div className="mt-6 m-4 bg-gray-900 p-2 rounded-lg">
        <div className="p-4 bg-white">
          {/* Espacio para el carrusel de imágenes cuando esté listo */}
        </div>
      </div>
    </div>
  );
}

export { IphoneShowcase, MacShowcase };
