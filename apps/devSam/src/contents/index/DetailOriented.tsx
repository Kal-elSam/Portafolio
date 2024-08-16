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
title="Meticulous Attention to Detail."
caption="Detail-Oriented"
description="I have a sharp eye for coding efficiency and frontend consistency, recognizing their essential role in enhancing user experience. My meticulous approach ensures that every element is precisely positioned and functions flawlessly."

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
