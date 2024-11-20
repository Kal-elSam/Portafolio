import {
  faGitAlt,
  faGithub,
  faJira,
  faJsSquare,
  faPython,
  faReact
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { m } from 'framer-motion';

import {
  FlutterIcon,
  NextJsIcon,
  TailwindCssIcon,
  TypeScriptIcon,
  VSCodeIcon,
  SQLIcon
} from '@/components/Icons';

const animation = {
  hide: { x: -8, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
  },
};

function HeaderTechStack() {
  return (
    <div>
      {/* Título Principal */}
      <m.p
        className={clsx(
          'text-xl font-bold text-slate-800 mb-4',
          'dark:text-slate-200'
        )}
        initial={{ x: -8, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Current Favorite Tech Stack/Tools
      </m.p>

      {/* Languages */}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-6">
        Languages:
      </h3>
      <m.ul
        className={clsx(
          'flex items-center gap-3.5 text-slate-500',
          'dark:text-slate-500'
        )}
        initial="hide"
        animate="show"
        transition={{ delayChildren: 0.6, staggerChildren: 0.025 }}
      >
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#F0DB4F]')}>
            <FontAwesomeIcon icon={faJsSquare} className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#3178C6]')}>
            <TypeScriptIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#3776AB]')}>
            <FontAwesomeIcon icon={faPython} className={clsx('h-6 w-6')} />
          </div>
        </m.li>
      </m.ul>

      {/* Frameworks */}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-6">
        Frameworks:
      </h3>
      <m.ul
        className={clsx(
          'flex items-center gap-3.5 text-slate-500',
          'dark:text-slate-500'
        )}
        initial="hide"
        animate="show"
        transition={{ delayChildren: 0.6, staggerChildren: 0.025 }}
      >
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#61DAFB]')}>
            <FontAwesomeIcon icon={faReact} className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div
            className={clsx(
              'transition duration-200 hover:text-[#000000] dark:hover:text-[#FFFFFF]'
            )}
          >
            <NextJsIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#000000]')}>
            <FlutterIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
      </m.ul>

      {/* Technologies */}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-6">
        Technologies:
      </h3>
      <m.ul
        className={clsx(
          'flex items-center gap-3.5 text-slate-500',
          'dark:text-slate-500'
        )}
        initial="hide"
        animate="show"
        transition={{ delayChildren: 0.6, staggerChildren: 0.025 }}
      >
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#336791]')}>
            <SQLIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#06B6D4]')}>
            <TailwindCssIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
      </m.ul>

      {/* Tools */}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-6">
        Tools:
      </h3>
      <m.ul
        className={clsx(
          'flex items-center gap-3.5 text-slate-500',
          'dark:text-slate-500'
        )}
        initial="hide"
        animate="show"
        transition={{ delayChildren: 0.6, staggerChildren: 0.025 }}
      >
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#007ACC]')}>
            <VSCodeIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#F34F29]')}>
            <FontAwesomeIcon icon={faGitAlt} className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#333]')}>
            <FontAwesomeIcon icon={faGithub} className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#0052CC]')}>
            <FontAwesomeIcon icon={faJira} className={clsx('h-6 w-6')} />
          </div>
        </m.li>
      </m.ul>
    </div>
  );
}

export default HeaderTechStack;
