import Head from '@/components/meta/Head';

import { getBaseUrl } from '@/helpers/url';

import IndexContents from '@/contents/index';

function Index() {
  return (
    <>
      <Head
        title="Sam Gomez · Software Engineer"
        description="Portfolio of Samuel Gomez Serrano, a Software Engineer focused on frontend architecture, AI systems, and scalable SaaS product engineering."
        ogImage={`${getBaseUrl()}apps/devSam/public/super.ico`}
        overrideTitle
      />
      <IndexContents />
    </>
  );
}

export default Index;
