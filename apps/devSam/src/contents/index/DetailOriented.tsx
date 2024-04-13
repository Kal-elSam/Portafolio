import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

import SectionTitle from '@/components/sections/SectionTitle';

function DetailOriented() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const fetchAnimationData = async () => {
      try {
        const response = await fetch('/lottie/coding.json'); // Ruta relativa a la carpeta public
        const jsonData = await response.json();
        setAnimationData(jsonData);
      } catch (error) {
        console.error('Failed to fetch animation data:', error);
      }
    };

    fetchAnimationData();
  }, []);

  return (
    <header className={clsx('mb-8')}>
      <SectionTitle
        title="Attention to Small Details in Code."
        caption="Detail Oriented"
        description="I possess a keen awareness of coding efficiency and frontend consistency, understanding their critical impact on the user experience. My approach involves meticulous attention to detail to ensure every element on the screen is perfectly placed and performs optimally."
      />
      {animationData && (
        <div className={clsx('w-1/2', 'mx-auto', 'mt-4')}>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData,
            }}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )}
    </header>
  );
}

export default DetailOriented;
