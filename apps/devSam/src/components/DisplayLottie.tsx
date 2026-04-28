import Lottie from 'lottie-react';

import type { KeyboardEvent } from 'react';

type Props = {
  animationPath: unknown;
};

function GreetingLottie({ animationPath }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyPress={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
          event.currentTarget.click();
        }
      }}
      aria-label="Play animation"
    >
      <Lottie animationData={animationPath} autoplay loop />
    </div>
  );
}

export default GreetingLottie;
