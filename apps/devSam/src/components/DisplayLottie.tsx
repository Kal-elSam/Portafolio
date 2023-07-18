import React, { KeyboardEvent } from 'react';
import Lottie, { Options } from 'react-lottie';

type Props = {
  animationPath: string;
};

function GreetingLottie({ animationPath }: Props) {
  const defaultOptions: Options = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
  };

  const handleClick = () => {
    // Handler para el evento de clic
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      // Handler para el evento de tecla Enter
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
    >
      <Lottie options={defaultOptions} />
    </div>
  );
}

export default GreetingLottie;
