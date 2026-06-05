import clsx from 'clsx';

import AiWorkflowSimulator from '@/contents/index/AiWorkflowSimulator';
import CleanIntuitive from '@/contents/index/CleanIntuitive';
import FeaturedCaseStudies from '@/contents/index/FeaturedCaseStudies';
import Header from '@/contents/index/Header';
import ImpactMetrics from '@/contents/index/ImpactMetrics';
import RoleImpactSection from '@/contents/index/RoleImpactSection';

function IndexContents() {
  return (
    <>
      <Header />
      <div className={clsx('mb-12', 'md:mb-16', 'lg:mb-24')}>
        <ImpactMetrics />
      </div>
      <section className={clsx('mb-16', 'lg:mb-28')}>
        <RoleImpactSection />
      </section>
      <section className={clsx('mb-16', 'lg:mb-28')}>
        <FeaturedCaseStudies />
      </section>
      <section className={clsx('mb-16', 'lg:mb-28')}>
        <AiWorkflowSimulator />
      </section>
      <section className={clsx('mb-12', 'lg:mb-24')}>
        <CleanIntuitive />
      </section>
    </>
  );
}

export default IndexContents;
