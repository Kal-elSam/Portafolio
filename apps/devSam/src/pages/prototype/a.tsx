import { displayA, monoA } from '@/components/prototype/fonts-a';
import PrototypePage from '@/components/prototype/PrototypePage';

import type { ReactElement } from 'react';

function PrototypeA() {
  return (
    <PrototypePage fontClassName={`${displayA.variable} ${monoA.variable}`} />
  );
}

// Bare layout: skips the site header and footer from the default layout.
PrototypeA.getLayout = (page: ReactElement) => page;

export default PrototypeA;
