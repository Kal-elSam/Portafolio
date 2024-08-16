import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

import SectionTitle from '@/components/sections/SectionTitle';

function PrettyOptimized() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const fetchAnimationData = async () => {
      try {
        const response = await fetch('/lottie/build.json'); // Ruta relativa a la carpeta public
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
title="Clear and Optimized Code"
caption="Neat & Efficient"
description="Clean code isn't just my goal—it's my standard. I optimize every line to boost efficiency while upholding the highest levels of readability and functionality. My approach ensures that elegance and performance work in harmony."

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

export default PrettyOptimized;
