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
        description="Awareness of code efficiency, frontend consistency, and their impact on User Experience. A good frontend developer is meticulous about every line of code contributing to the overall effectiveness of the UI."
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
