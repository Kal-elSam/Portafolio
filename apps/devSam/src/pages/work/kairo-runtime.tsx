import KairoCase from '@/components/case/KairoCase';

import type { ReactElement } from 'react';

function Page() {
  return <KairoCase />;
}

// Own band, rail and closing link: the shared header, footer and shortcuts
// belong to the other pages and are not mounted here.
Page.getLayout = (page: ReactElement) => page;

export default Page;
