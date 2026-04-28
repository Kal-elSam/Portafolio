/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import { m, useAnimationControls } from 'framer-motion';

import HeaderImageAnimation from './HeaderImageAnimation';

function HeaderImage() {
  const controlsHeaderImage = useAnimationControls();
  const controlsHeaderOutline = useAnimationControls();

  return (
    <div className={clsx('relative h-[590px] w-[703px]')}>
      <div
        className={clsx(
          'from-accent-400/20 via-accent-400/0 absolute right-0 top-0 h-[590px] w-[375px] rounded-full bg-gradient-to-t',
          'dark:from-accent-600/10 dark:via-accent-600/0',
          'flex items-center justify-center'
        )}
      >
        <div className={clsx('right-90 bottom-100')}>
          <m.div
            className={clsx('absolute z-[10]')}
            initial={{ opacity: 1 }}
            animate={controlsHeaderOutline}
          >
            <HeaderImageAnimation
              onAnimationComplete={() => {
                controlsHeaderOutline.start({
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                    delay: 0.15,
                  },
                });

                controlsHeaderImage.start({
                  opacity: 1,
                  transition: {
                    duration: 0.15,
                  },
                });
              }}
            />
          </m.div>
          <m.div
            className={clsx('')}
            initial={{ opacity: 0 }}
            animate={controlsHeaderImage}
          >
            <img
              alt="Sam Gomez"
              src="/assets/images/sam.png"
              width={1057}
              height={783}
              className={clsx(
                'hidden h-auto max-w-none',
                'lg:block',
                'dark:brightness-[.82]'
              )}
            />
          </m.div>
        </div>
      </div>
    </div>
  );
}

export default HeaderImage;
