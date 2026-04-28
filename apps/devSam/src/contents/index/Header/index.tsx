import clsx from 'clsx';

import HeaderCta from '@/contents/index/Header/HeaderCta';
import HeaderImage from '@/contents/index/Header/HeaderImage';
import HeaderTechStack from '@/contents/index/Header/HeaderTechStack';
import HeaderTitle from '@/contents/index/Header/HeaderTitle';

function CurrentBuildBadge() {
  return (
    <div
      className={clsx(
        'absolute bottom-8 right-2 hidden w-72 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-2xl shadow-slate-950/10 backdrop-blur',
        'dark:border-slate-700/80 dark:bg-slate-900/85 dark:shadow-black/30',
        'xl:block'
      )}
    >
      <div className={clsx('flex items-center gap-3')}>
        <div
          className={clsx(
            'bg-accent-600 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white'
          )}
        >
          AI
        </div>
        <div>
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
              'text-xs font-medium text-slate-600',
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
        'background-grid background-grid--fade-out pb-20 pt-36',
        'lg:pb-28 lg:pt-52'
      )}
    >
      <div className={clsx('content-wrapper')}>
        <div className={clsx('relative')}>
          <div className={clsx('relative z-10')}>
            <HeaderTitle />
          </div>
          <div className={clsx('mt-6 md:mt-8')}>
            <HeaderCta />
          </div>
          <div className={clsx('mt-20 lg:mt-36')}>
            <HeaderTechStack />
          </div>
          <div
            className={clsx(
              'pointer-events-none absolute -top-36 right-0 z-0 hidden select-none',
              'lg:block'
            )}
          >
            <HeaderImage />
            <CurrentBuildBadge />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
