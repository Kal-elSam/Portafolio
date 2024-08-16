import CompanyLogosBanner from '@/components/wireframes/CompanyLogosBanner';
import ProjectCounter from '@/components/wireframes/ProjectCounter';
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
      <ProjectCounter />
      <CompanyLogosBanner />
      {/* <WireframeSection /> */}

      <ProjectsContents />
    </Page>
  );
}

export default Projects;
