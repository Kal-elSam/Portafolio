import clsx from 'clsx';

import HireMePanel from '@/components/wireframes/HireMePanel';

import Page from '@/contents-layouts/Page';

function HireMe() {
  return (
    <Page
      frontMatter={{
        title: 'Hire Me',
        description:
          'Software Engineer · Product Engineer · AI Systems — available for remote roles and relocation.',
        caption: 'Available',
      }}
    >
      <div className={clsx('content-wrapper pb-16', 'md:pb-24')}>
        <HireMePanel />
      </div>
    </Page>
  );
}

export default HireMe;
