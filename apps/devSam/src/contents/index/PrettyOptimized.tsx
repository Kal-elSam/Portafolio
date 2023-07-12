import clsx from 'clsx';

import SectionTitle from '@/components/sections/SectionTitle';

function PrettyOptimized() {
  return (
    <header className={clsx('mb-8')}>
     <SectionTitle
     title="Comprehensible and Optimized Code"
     caption="Neat & Efficient"
     description="For a frontend developer, writing clean, understandable code is a top priority, while ensuring it's as optimized as possible to maintain efficient User Experience."
   />
    </header>
  );
}

export default PrettyOptimized;
