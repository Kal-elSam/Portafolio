import Head from '@/components/meta/Head';

import { getBaseUrl } from '@/helpers/url';

import IndexContents from '@/contents/index';

function Index() {
  return (
    <>
      <Head
        title="Sam Gomez · Front-End Developer"
        description="An online portfolio featuring a showcase of my projects and some thoughts as a Front-End Developer."
        ogImage={`${getBaseUrl()}apps/devSam/public/super.ico`}
        overrideTitle
      />
      <IndexContents />
    </>
  );
}

export default Index;
