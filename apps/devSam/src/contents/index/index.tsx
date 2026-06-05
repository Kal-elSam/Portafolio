import clsx from 'clsx';

import { CodeIcon, HeartIcon, SparklesIcon } from '@/components/Icons';

import CleanIntuitive from '@/contents/index/CleanIntuitive';
import DetailOriented from '@/contents/index/DetailOriented';
import FeaturedCard from '@/contents/index/FeaturedCard';
import FeaturedCaseStudies from '@/contents/index/FeaturedCaseStudies';
import Header from '@/contents/index/Header';
import ImpactMetrics from '@/contents/index/ImpactMetrics';
import PrettyOptimized from '@/contents/index/PrettyOptimized';
import Quote from '@/contents/index/Quote';
import RoleImpactSection from '@/contents/index/RoleImpactSection';

function FeaturedCardSection() {
  return (
    <div className={clsx('content-wrapper')}>
      <div className={clsx('flex flex-col gap-4', 'lg:flex-row lg:gap-8')}>
        <FeaturedCard
          icon={
            <div
              className={clsx(
                'rounded-full bg-amber-300 p-3.5',
                'dark:bg-amber-900'
              )}
            >
              <SparklesIcon className={clsx('h-5 w-5 text-white')} />
            </div>
          }
          title="Product Engineering"
          desc="I ship SaaS platforms, dashboards, and AI products end-to-end — from requirements to production with measurable outcomes."
        />
        <FeaturedCard
          icon={
            <div
              className={clsx(
                'rounded-full bg-pink-300 p-3.5',
                'dark:bg-pink-900'
              )}
            >
              <HeartIcon className={clsx('h-5 w-5 text-white')} />
            </div>
          }
          title="Architecture & Delivery"
          desc="I design modular systems, API contracts, and engineering standards that keep teams fast as products scale."
        />
        <FeaturedCard
          icon={
            <div
              className={clsx(
                'rounded-full bg-sky-300 p-3.5',
                'dark:bg-sky-900'
              )}
            >
              <CodeIcon className={clsx('h-5 w-5 text-white')} />
            </div>
          }
          title="AI & Integrations"
          desc="I connect LLM workflows, messaging APIs, CRM handoffs, and data pipelines into systems teams can run in production."
        />
      </div>
    </div>
  );
}

function QuoteSection() {
  return (
    <div className={clsx('content-wrapper')}>
      <div className={clsx('flex items-center justify-center py-8')}>
        <Quote />
      </div>
    </div>
  );
}

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
      <section className={clsx('mb-16', 'md:mb-20', 'lg:mb-24')}>
        <FeaturedCardSection />
      </section>
      <div className={clsx('-mt-12 mb-12', 'md:mb-24 md:mt-0')}>
        <QuoteSection />
      </div>
      <section className={clsx('mb-12', 'lg:mb-24')}>
        <CleanIntuitive />
      </section>
      <section className={clsx('mb-12', 'lg:mb-24')}>
        <DetailOriented />
      </section>
      <section className={clsx('mb-12', 'lg:mb-24')}>
        <PrettyOptimized />
      </section>
    </>
  );
}

export default IndexContents;
