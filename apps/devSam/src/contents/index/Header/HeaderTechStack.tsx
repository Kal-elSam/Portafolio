import {
  faCss3Alt,
  faGitAlt,
  faGithub,
  faHtml5,
  faJira,
  faJsSquare,
  faReact,
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
      <m.p
        className={clsx('mb-2.5 text-sm text-slate-600', 'dark:text-slate-400')}
        initial={animation.hide}
        animate={animation.show}
        transition={{ delay: 0.6 }}
      >
        current favorite tech stack/tools:
      </m.p>
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
          <div className={clsx('transition duration-200 hover:text-[#E34F26]')}>
            <FontAwesomeIcon icon={faHtml5} className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#1572B6]')}>
            <FontAwesomeIcon icon={faCss3Alt} className={clsx('h-6 w-6')} />
          </div>
        </m.li>
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
          <div className={clsx('transition duration-200 hover:text-[#61DAFB]')}>
            <FontAwesomeIcon icon={faReact} className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#02569B]')}>
            <FlutterIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#06B6D4]')}>
            <TailwindCssIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        {/* <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#003B57]')}>
            <FontAwesomeIcon icon={faDatabase} className={clsx('h-6 w-6')} />
          </div>
        </m.li> */}
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
          <div className={clsx('h-3 w-[1px] bg-slate-300 dark:bg-slate-700')} />
        </m.li>
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
