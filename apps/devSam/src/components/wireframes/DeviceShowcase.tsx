import Image from 'next/image';
import React from 'react';

interface ShowcaseProps {
  screenshot?: string | null;
}

function IphoneShowcase({ screenshot = null }: ShowcaseProps) {
  return (
    <div className="border-black rounded-xl w-56 h-112 relative bg-gray-900 shadow-lg">
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 w-8 h-1 rounded-full" />
      <div className="mt-7 mb-7 mx-auto w-52 h-96 bg-white rounded-xl overflow-hidden">
        {screenshot && <Image src={screenshot} alt="App Screenshot" className="rounded-xl" />}
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 w-14 h-1.5 rounded-full" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 w-10 h-1 rounded-full" />
    </div>
  );
}

function MacShowcase({ screenshot = null }: ShowcaseProps) {
  return (
    <div className="border-2 border-black rounded-lg w-128 h-72 relative bg-gray-900 shadow-xl">
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 w-24 h-1.5 rounded-full" />
      <div className="mt-6 m-4 bg-gray-900 p-2 rounded-lg">
        {screenshot ? (
          <Image src={screenshot} alt="Web Screenshot" className="rounded-b-lg" />
        ) : (
          <div className="h-full rounded-b-lg flex items-center justify-center">
            {/* Aquí puede colocar un esqueleto o un placeholder mientras la imagen se carga */}
          </div>
        )}
      </div>
    </div>
  );
}

export { IphoneShowcase, MacShowcase };
