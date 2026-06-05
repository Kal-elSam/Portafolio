import {
  faGitAlt,
  faGithub,
  faJsSquare,
  faPython,
  faReact,
} from '@fortawesome/free-brands-svg-icons';
import {
  faBrain,
  faCloud,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { m } from 'framer-motion';

import {
  FlutterIcon,
  NextJsIcon,
  SQLIcon,
  TailwindCssIcon,
  TypeScriptIcon,
} from '@/components/Icons';

const animation = {
  hide: { y: 10, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
  },
};

const stackGroups = [
  {
    title: 'Frontend',
    items: [
      { label: 'React', icon: <FontAwesomeIcon icon={faReact} /> },
      { label: 'Next.js', icon: <NextJsIcon /> },
      { label: 'TypeScript', icon: <TypeScriptIcon /> },
      { label: 'Tailwind', icon: <TailwindCssIcon /> },
    ],
  },
  {
    title: 'AI & Backend',
    items: [
      { label: 'LLM Flows', icon: <FontAwesomeIcon icon={faBrain} /> },
      { label: 'Node/API', icon: <FontAwesomeIcon icon={faJsSquare} /> },
      { label: 'Python', icon: <FontAwesomeIcon icon={faPython} /> },
      { label: 'SQL', icon: <SQLIcon /> },
    ],
  },
  {
    title: 'Product Delivery',
    items: [
      { label: 'Flutter', icon: <FlutterIcon /> },
      { label: 'Cloud', icon: <FontAwesomeIcon icon={faCloud} /> },
      { label: 'Data', icon: <FontAwesomeIcon icon={faDatabase} /> },
      { label: 'GitHub', icon: <FontAwesomeIcon icon={faGithub} /> },
      { label: 'Git', icon: <FontAwesomeIcon icon={faGitAlt} /> },
    ],
  },
];

function HeaderTechStack() {
  return (
    <section
      className={clsx(
        'w-full rounded-3xl border border-slate-200/80 bg-white/70 p-4 shadow-xl shadow-slate-950/[0.03] backdrop-blur',
        'dark:border-slate-800 dark:bg-slate-950/35 dark:shadow-black/20',
        'md:p-5'
      )}
    >
      <m.div
        className={clsx(
          'mb-4 flex flex-col gap-1',
          'sm:flex-row sm:items-end sm:justify-between'
        )}
        initial={{ x: -8, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div>
          <p
            className={clsx(
              'text-accent-600 text-xs font-black uppercase tracking-[0.22em]',
              'dark:text-accent-400'
            )}
          >
            Current stack
          </p>
          <h2
            className={clsx(
              'text-lg font-black text-slate-900',
              'dark:text-white'
            )}
          >
            Built for modern product teams
          </h2>
        </div>
        <p
          className={clsx(
            'text-sm font-medium text-slate-500',
            'dark:text-slate-400'
          )}
        >
          Full-stack product systems — UI, APIs, AI workflows, and production
          delivery.
        </p>
      </m.div>

      <m.div
        className={clsx('grid gap-3', 'md:grid-cols-3')}
        initial="hide"
        animate="show"
        transition={{ delayChildren: 0.72, staggerChildren: 0.05 }}
      >
        {stackGroups.map((group) => (
          <m.div
            key={group.title}
            variants={animation}
            className={clsx(
              'rounded-2xl border border-slate-200 bg-slate-50/80 p-3',
              'dark:border-slate-800 dark:bg-slate-900/70'
            )}
          >
            <h3
              className={clsx(
                'mb-3 text-sm font-bold text-slate-800',
                'dark:text-slate-200'
              )}
            >
              {group.title}
            </h3>
            <div className={clsx('flex flex-wrap gap-2')}>
              {group.items.map((item) => (
                <span
                  key={item.label}
                  className={clsx(
                    'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 transition',
                    'hover:border-accent-300 hover:text-accent-600 hover:-translate-y-0.5 hover:shadow-sm',
                    'dark:hover:border-accent-500 dark:hover:text-accent-400 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300'
                  )}
                >
                  <span className={clsx('h-3.5 w-3.5')}>{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </m.div>
        ))}
      </m.div>
    </section>
  );
}

export default HeaderTechStack;
