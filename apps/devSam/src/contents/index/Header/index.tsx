import clsx from 'clsx';

import HeaderCta from '@/contents/index/Header/HeaderCta';
import HeaderImage from '@/contents/index/Header/HeaderImage';
import HeaderTechStack from '@/contents/index/Header/HeaderTechStack';
import HeaderTitle from '@/contents/index/Header/HeaderTitle';

function CurrentBuildBadge() {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-950/[0.04] backdrop-blur',
        'dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20'
      )}
    >
      <div className={clsx('flex items-center gap-3')}>
        <div
          className={clsx(
            'bg-accent-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white'
          )}
        >
          AI
        </div>
        <div className={clsx('min-w-0')}>
          <p
            className={clsx(
              'text-sm font-bold text-slate-900',
              'dark:text-white'
            )}
          >
            Currently building
          </p>
          <p
            className={clsx(
              'text-xs font-medium leading-5 text-slate-600',
              'dark:text-slate-400'
            )}
          >
            AI systems, SaaS dashboards, and automated product workflows.
          </p>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header
      id="page-header"
      className={clsx(
        'background-grid background-grid--fade-out pb-12 pt-28',
        'sm:pb-16 sm:pt-32',
        'lg:pb-20 lg:pt-44'
      )}
    >
      <div className={clsx('content-wrapper')}>
        <div
          className={clsx(
            'grid items-start gap-8',
            'md:gap-10',
            'lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-10 lg:gap-y-0',
            'xl:gap-x-14'
          )}
        >
          <div className={clsx('min-w-0')}>
            <HeaderTitle />
            <div className={clsx('mt-6', 'md:mt-8')}>
              <HeaderCta />
            </div>
          </div>

          <div
            className={clsx(
              'flex justify-center',
              'lg:-mt-6 lg:justify-end',
              'xl:-mt-10'
            )}
          >
            <HeaderImage size="hero" />
          </div>
        </div>

        <div className={clsx('mt-10', 'md:mt-12', 'lg:mt-14')}>
          <HeaderTechStack />
        </div>

        <div className={clsx('mt-6', 'md:max-w-md')}>
          <CurrentBuildBadge />
        </div>
      </div>
    </header>
  );
}

export default Header;
