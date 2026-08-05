import HireMePanel from '@/components/wireframes/HireMePanel';

import Page from '@/contents-layouts/Page';

function HireMe() {
  return (
    <Page
      frontMatter={{
        title: 'Hire Me',
        description:
          'CV, availability, location, visa, languages, and links for product engineering roles.',
        caption: 'Work',
      }}
    >
      <HireMePanel />
    </Page>
  );
}

export default HireMe;
