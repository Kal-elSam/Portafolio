import clsx from 'clsx';

import SectionTitle from '@/components/sections/SectionTitle';

function DetailOriented() {
  return (
    <header className={clsx('mb-8')}>
      <SectionTitle
     title="Attention to Small Details in Code."
     caption="Detail Oriented"
     description="Awareness of code efficiency, frontend consistency, and their impact on User Experience. A good frontend developer is meticulous about every line of code contributing to the overall effectiveness of the UI."
   />
    </header>
  );
}

export default DetailOriented;
