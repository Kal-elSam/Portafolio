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
        title="Comprehensible and Optimized Code"
        caption="Neat & Efficient"
        description="For a frontend developer, writing clean, understandable code is a top priority, while ensuring it's as optimized as possible to maintain efficient User Experience."
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
