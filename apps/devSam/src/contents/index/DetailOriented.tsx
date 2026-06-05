import clsx from 'clsx';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

import SectionTitle from '@/components/sections/SectionTitle';

function DetailOriented() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const fetchAnimationData = async () => {
      try {
        const response = await fetch('/lottie/coding.json'); // Ruta relativa a la carpeta public
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
        title="Execution With Product Context."
        caption="End-to-End Delivery"
        description="I align product requirements, system design, API contracts, and cross-team delivery to ship features that hold up in production — not just in prototypes."
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

export default DetailOriented;
