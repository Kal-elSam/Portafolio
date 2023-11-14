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
        delay={0}
        numbers={count.toString().padStart(3, '0')}
        height={100} // Ajusta el tamaño según sea necesario
        width={80} // Ajusta el tamaño según sea necesario
        color="#FFF" // Este debería ser el color de los números
        background="transparent" // Cambia el fondo a transparente si quieres que se vea el fondo de tu sitio
        numberStyle={{
          fontFamily: 'Tu Fuente', // Reemplaza con la fuente que estás usando en tu sitio
          fontWeight: 700, // Ajusta el peso de la fuente según sea necesario
          border: '1px solid #333', // Ajusta el color del borde si es necesario
          borderRadius: '5px',
          margin: '0 2px',
          padding: '0 4px', // Ajusta el espaciado interno según sea necesario
        }}
        nonNumberStyle={{
          fontFamily: 'Tu Fuente', // Asegúrate de que las no-cifras (como dos puntos) coincidan con las cifras
          fontWeight: 700,
          border: '1px solid #333',
          borderRadius: '5px',
          margin: '0 2px',
          padding: '0 4px',
        }}
      />
      <div className="text-lg font-semibold ml-4">Completed Projects</div>
    </div>
  );
};

export default ProjectCounter;
