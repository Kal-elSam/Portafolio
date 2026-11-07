import { displayA, monoA } from '@/components/prototype/fonts-a';
import LayersPage from '@/components/prototype/layers/LayersPage';

import type { ReactElement } from 'react';

function PrototypeLayers() {
  return (
    <LayersPage fontClassName={`${displayA.variable} ${monoA.variable}`} />
  );
}

// Bare layout: skips the site header and footer from the default layout.
PrototypeLayers.getLayout = (page: ReactElement) => page;

export default PrototypeLayers;
