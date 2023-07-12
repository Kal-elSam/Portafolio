import clsx from 'clsx';
import { m, useAnimationControls } from 'framer-motion';
import Image from 'next/image';

import HeaderImageAnimation from './HeaderImageAnimation';

function HeaderImage() {
  const controlsHeaderImage = useAnimationControls();
  const controlsHeaderOutline = useAnimationControls();

  return (
    <div
      className={clsx('relative h-[590px] w-[703px]')}
      // style={{
      //   maskImage: `url("data:image/svg+xml,%3Csvg width='903' height='590' fill='none' viewBox='0 0 603 590' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0 0v393h228v9.5c0 103.55 83.947 187.5 187.5 187.5s187.5-83.947 187.5-187.5v-402.5h-603z' fill='%23000'/%3E%3C/svg%3E%0A")`,
      //   WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='603' height='590' fill='none' viewBox='0 0 603 590' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0 0v393h228v9.5c0 103.55 83.947 187.5 187.5 187.5s187.5-83.947 187.5-187.5v-402.5h-603z' fill='%23000'/%3E%3C/svg%3E%0A")`,
      // }}
    >
      <div
        className={clsx(
          'from-accent-400/20 via-accent-400/0 absolute top-0 right-0 h-[590px] w-[375px] rounded-full bg-gradient-to-t',
          'dark:from-accent-600/10 dark:via-accent-600/0','flex justify-center items-center' 
        )}
      >
        <div className={clsx('absolute right-90 bottom-100 overflow-hidden')}>
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
            <Image
              alt="Sam Gomez"
              src="/assets/images/sam.png"
              width={1057}
              height={783}
              className={clsx(
                'hidden max-w-none',
                'lg:block',
                'dark:brightness-[.82]'
              )}
              quality={100}
              priority
            />
          </m.div>
        </div>
      </div>
    </div>
  );
}

export default HeaderImage;
