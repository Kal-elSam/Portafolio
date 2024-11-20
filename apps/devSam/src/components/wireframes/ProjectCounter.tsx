// ProjectCounter.tsx
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import FlipNumbers from 'react-flip-numbers';

import projectsData from '@/contents/projects/proyects';

// eslint-disable-next-line react/function-component-definition
const ProjectCounter: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) =>
        prevCount < projectsData.length ? prevCount + 1 : prevCount
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 flex items-center justify-center">
      <FlipNumbers
        play
        duration={0.3}
        numbers={count.toString().padStart(3, '0')}
        height={100} // Ajusta el tamaño según sea necesario
        width={80} // Ajusta el tamaño según sea necesario
        color="currentColor" // Usa `currentColor` para adaptarse al texto
        background="transparent" // Transfiere el fondo
        numberStyle={{
          fontFamily: 'Tu Fuente',
          fontWeight: 700,
          border: '1px solid', // Solo `solid` y se define dinámicamente con Tailwind
          borderRadius: '5px',
          margin: '0 2px',
          padding: '0 4px',
          color: 'inherit', // Usa el color heredado del texto
        }}
        nonNumberStyle={{
          fontFamily: 'Tu Fuente',
          fontWeight: 700,
          border: '1px solid',
          borderRadius: '5px',
          margin: '0 2px',
          padding: '0 4px',
          color: 'inherit', // También hereda
        }}
      />
      <div className="text-lg font-semibold ml-4 text-slate-800 dark:text-slate-100">
        Completed Projects
      </div>
    </div>
  );
};

export default ProjectCounter;
