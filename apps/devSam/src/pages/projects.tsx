import CompanyLogosBanner from '@/components/wireframes/CompanyLogosBanner';
import ProjectCounter from '@/components/wireframes/ProjectCounter';

import ProjectsContents from '@/contents/projects';
import HeaderImage from '@/contents/projects/HeaderImage';
import Page from '@/contents-layouts/Page';

function Projects() {
  return (
    <Page
      frontMatter={{
        title: 'Projects',
        description:
          'Curated portfolio of SaaS products, frontend systems, enterprise dashboards, and AI workflow platforms.',
      }}
      headerImage={<HeaderImage />}
    >
      <ProjectCounter />
      <CompanyLogosBanner />
      <ProjectsContents />
    </Page>
  );
}

export default Projects;
