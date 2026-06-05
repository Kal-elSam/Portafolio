import clsx from 'clsx';
import { m } from 'framer-motion';
import Link from 'next/link';

import CvDownloadMenu from '@/components/CvDownloadMenu';
import { ChevronRightIcon } from '@/components/Icons';

const animation = {
  hide: {
    x: -16,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
  },
};

interface HeaderCtaProps {
  isFree?: boolean;
}

function ButtonContactMe() {
  return (
    <Link
      href="/work/contact"
      className={clsx('button button--outline min-w-[112px]', 'md:button--big')}
    >
      Contact
    </Link>
  );
}

function ButtonWork() {
  return (
    <Link
      href="/projects"
      className={clsx('button button--solid min-w-[148px]', 'md:button--big')}
    >
      View Work
      <ChevronRightIcon className={clsx('h-4 w-4')} />
    </Link>
  );
}

function AvailableForHire() {
  return (
    <div
      className={clsx(
        'button button--soft pointer-events-none gap-2.5 px-3',
        'md:button--big md:px-2.5',
        'shadow-accent-600/10 shadow-sm'
      )}
    >
      <span className={clsx('relative flex h-2 w-2')}>
        <span
          className={clsx(
            'bg-accent-600 absolute -left-1 -top-1 inline-flex h-4 w-4 animate-ping rounded-full opacity-75',
            'dark:bg-accent-300'
          )}
        />
        <span
          className={clsx(
            'bg-accent-500 relative inline-flex h-2 w-2 rounded-full',
            'dark:bg-accent-400'
          )}
        />
      </span>
      AVAILABLE FOR HIRE
    </div>
  );
}

function HeaderCta({ isFree = true }: HeaderCtaProps) {
  return (
    <m.div
      className={clsx('flex flex-wrap items-center gap-2', 'md:gap-3')}
      initial="hide"
      animate="show"
    >
      <m.div
        className={clsx('relative z-20')}
        variants={animation}
        transition={{ delay: 0.4 }}
      >
        <ButtonWork />
      </m.div>
      <m.div variants={animation} transition={{ delay: 0.45 }}>
        <ButtonContactMe />
      </m.div>
      {isFree && (
        <m.div variants={animation} transition={{ delay: 0.5 }}>
          <AvailableForHire />
        </m.div>
      )}
      <m.div variants={animation} transition={{ delay: 0.55 }}>
        <CvDownloadMenu variant="soft" />
      </m.div>
    </m.div>
  );
}

export default HeaderCta;
