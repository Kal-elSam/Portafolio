import clsx from 'clsx';
import { m, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { ChevronRightIcon, DocumentIcon } from '@/components/Icons';

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
  isFreeAnimationDuration?: number;
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

function ButtonResume() {
  return (
    <a
      href="/assets/docs/SamuelGomezDevResume.pdf"
      download="SamuelGomezDevResume.pdf"
      aria-label="Download Samuel Gomez resume"
      className={clsx('button button--ghost px-2', 'md:button--big md:px-2')}
    >
      <DocumentIcon className={clsx('h-5 w-5')} />
      RESUME
    </a>
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

function HeaderCta({
  isFree = true,
  isFreeAnimationDuration = 4,
}: HeaderCtaProps) {
  const shouldReduceMotion = useReducedMotion();

  let isFreeVariants = {
    hide: {
      x: 0,
      opacity: 1,
    },
    show: {
      x: -48,
      opacity: 0,
    },
  };

  if (shouldReduceMotion) {
    isFreeVariants = {
      hide: {
        x: 0,
        opacity: 1,
      },
      show: {
        x: 0,
        opacity: 0,
      },
    };
  }

  return (
    <m.div
      className={clsx('flex flex-wrap gap-2')}
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
      {isFree ? (
        <m.div
          variants={animation}
          transition={{ delay: 2.8 }}
          className={clsx('relative z-10')}
        >
          <m.div
            variants={isFreeVariants}
            transition={{ delay: isFreeAnimationDuration + 1.5, duration: 0.4 }}
          >
            <AvailableForHire />
          </m.div>
          <m.div
            className={clsx('absolute left-0 top-0')}
            initial={{ x: -48, opacity: 0, pointerEvents: 'none' }}
            animate={{ x: 0, opacity: 1, pointerEvents: 'auto' }}
            transition={{ delay: isFreeAnimationDuration + 1.6, duration: 0.4 }}
          >
            <ButtonResume />
          </m.div>
        </m.div>
      ) : (
        <m.div variants={animation} transition={{ delay: 0.5 }}>
          <ButtonResume />
        </m.div>
      )}
    </m.div>
  );
}

export default HeaderCta;
