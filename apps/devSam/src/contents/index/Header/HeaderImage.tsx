/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';

type HeaderImageSize = 'compact' | 'hero';

interface HeaderImageProps {
  size?: HeaderImageSize;
}

/** Centro visual del busto en sam.png (cara izq. + moño der. desbalancean el bbox). */
const PORTRAIT_ANCHOR = {
  left: '54%',
  top: '42%',
  outerSize: '58%',
  innerSize: '32%',
} as const;

function HeaderImage({ size = 'hero' }: HeaderImageProps) {
  const isHero = size === 'hero';

  return (
    <div className={clsx('relative w-fit', isHero ? 'mx-0' : 'mx-auto')}>
      <div
        className={clsx(
          'from-accent-400/40 via-accent-400/10 absolute z-0 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-t to-transparent',
          'dark:from-accent-600/30 dark:via-accent-600/5'
        )}
        style={{
          left: PORTRAIT_ANCHOR.left,
          top: PORTRAIT_ANCHOR.top,
          width: PORTRAIT_ANCHOR.outerSize,
        }}
        aria-hidden="true"
      />
      <div
        className={clsx(
          'bg-accent-500/20 absolute z-0 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl',
          'dark:bg-accent-500/25'
        )}
        style={{
          left: PORTRAIT_ANCHOR.left,
          top: PORTRAIT_ANCHOR.top,
          width: PORTRAIT_ANCHOR.innerSize,
        }}
        aria-hidden="true"
      />

      <img
        alt="Sam Gomez"
        src="/assets/images/sam.png"
        width={1057}
        height={783}
        className={clsx(
          'relative z-10 block h-auto w-full',
          isHero
            ? 'max-w-[min(92vw,420px)] drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)] dark:brightness-[0.92] sm:max-w-[460px] lg:max-w-[500px] xl:max-w-[540px] 2xl:max-w-[580px]'
            : 'max-w-[260px] drop-shadow-[0_16px_32px_rgba(0,0,0,0.4)] sm:max-w-[300px] md:max-w-[340px] dark:brightness-[0.88]'
        )}
      />
    </div>
  );
}

export default HeaderImage;
