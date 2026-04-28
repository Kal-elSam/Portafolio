import clsx from 'clsx';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

import SectionTitle from '@/components/sections/SectionTitle';

function PrettyOptimized() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const fetchAnimationData = async () => {
      try {
        const response = await fetch('/lottie/build.json'); // Ruta relativa a la carpeta public
        const jsonData = await response.json();
        setAnimationData(jsonData);
      } catch {
        setAnimationData(null);
      }
    };

    fetchAnimationData();
  }, []);

  return (
    <header className={clsx('mb-8')}>
      <SectionTitle
        title="Optimization With Business Impact."
        caption="Performance & AI Workflows"
        description="From Core Web Vitals improvements to AI-powered automation, I focus on systems that reduce friction, accelerate delivery, and create measurable operational gains."
      />
      {animationData && (
        <div className={clsx('w-1/2', 'mx-auto', 'mt-4')}>
          <Lottie
            animationData={animationData}
            autoplay
            loop
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )}
    </header>
  );
}

export default PrettyOptimized;
