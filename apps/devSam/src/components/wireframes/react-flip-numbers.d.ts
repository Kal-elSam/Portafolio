// react-flip-numbers.d.ts
declare module 'react-flip-numbers' {
  import { FunctionComponent } from 'react';

  interface FlipNumbersProps {
    play?: boolean;
    perspective?: number;
    numbers?: string;
    nonNumberStyle?: object;
    numberStyle?: object;
    width?: number;
    height?: number;
    color?: string;
    background?: string;
    numberWrapperStyle?: object;
    duration?: number;
  }

  const FlipNumbers: FunctionComponent<FlipNumbersProps>;

  export default FlipNumbers;
}
