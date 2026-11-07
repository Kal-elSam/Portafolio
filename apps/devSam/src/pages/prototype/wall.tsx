import { displayA, monoA } from '@/components/prototype/fonts-a';
import WallPage from '@/components/prototype/wall/WallPage';

import type { ReactElement } from 'react';

function PrototypeWall() {
  return <WallPage fontClassName={`${displayA.variable} ${monoA.variable}`} />;
}

// Bare layout: skips the site header and footer from the default layout.
PrototypeWall.getLayout = (page: ReactElement) => page;

export default PrototypeWall;
