import CompanyLogosBanner from '@/components/wireframes/CompanyLogosBanner';
import WireframeSection from '@/components/wireframes/WireframeSection';

import ProjectsContents from '@/contents/projects';
import HeaderImage from '@/contents/projects/HeaderImage';
import Page from '@/contents-layouts/Page';

function Projects() {
  return (
    <Page
      frontMatter={{
        title: 'Projects',
        description: 'Showcase of my front-end related work.',
      }}
      headerImage={<HeaderImage />}
    >
      <CompanyLogosBanner />
      <WireframeSection />

      <ProjectsContents />
    </Page>
  );
}

export default Projects;
