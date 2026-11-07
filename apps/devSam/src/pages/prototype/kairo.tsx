import { displayA, monoA } from '@/components/prototype/fonts-a';
import KairoPage from '@/components/prototype/kairo/KairoPage';

import type { ReactElement } from 'react';

function PrototypeKairo() {
  return <KairoPage fontClassName={`${displayA.variable} ${monoA.variable}`} />;
}

// Bare layout: skips the site header and footer from the default layout.
PrototypeKairo.getLayout = (page: ReactElement) => page;

export default PrototypeKairo;
