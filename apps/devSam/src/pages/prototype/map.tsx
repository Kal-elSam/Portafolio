import { displayA, monoA } from '@/components/prototype/fonts-a';
import MapPage from '@/components/prototype/map/MapPage';

import type { ReactElement } from 'react';

function PrototypeMap() {
  return <MapPage fontClassName={`${displayA.variable} ${monoA.variable}`} />;
}

// Bare layout: skips the site header and footer from the default layout.
PrototypeMap.getLayout = (page: ReactElement) => page;

export default PrototypeMap;
