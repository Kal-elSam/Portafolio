import HomePage from '@/components/home/HomePage';
import Head from '@/components/meta/Head';
import { displayA, monoA } from '@/components/prototype/fonts-a';

import { getBaseUrl } from '@/helpers/url';

import type { ReactElement } from 'react';

function Index() {
  return (
    <>
      <Head
        title="Senior Software Engineer | System Architecture & AI Engineering"
        description="Samuel Gomez Serrano. Senior Software Engineer focused on system architecture and AI engineering: enterprise insurance platforms, AI workflows, and Kairo Runtime."
        ogImage={`${getBaseUrl()}/assets/images/og-image.png`}
        overrideTitle
      />
      <HomePage fontClassName={`${displayA.variable} ${monoA.variable}`} />
    </>
  );
}

// Own navigation and scoped styles: the shared header and footer stay for the
// other pages until the site-wide redesign tasks land.
Index.getLayout = (page: ReactElement) => page;

export default Index;
