import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { GitHubIcon } from '@/components/Icons';
import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
// import SectionTitle from '@/components/sections/SectionTitle';
import AppWindow from '@/components/wireframes/AppWindow';
import CompanyWindow from '@/components/wireframes/CompanyWindow';
import GitHubWireframe from '@/components/wireframes/GitHub';
import ProjectWireframe from '@/components/wireframes/ProjectWireframe';

import projectsData from './proyects';

// import NpmWireframe from '@/components/wireframes/Npm';

type ViewType = 'app' | 'browser';

function ProjectsContents() {
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);

  const [currentCompany, setCurrentCompany] = useState('KC');
  const [selectedProject, setSelectedProject] = useState(
    projectsData.find((project) => project.company === 'KC')
  );
  const [type, setType] = useState<ViewType>('browser');

  // Filtra los proyectos según la compañía seleccionada
  const filteredProjects = projectsData.filter(
    (project) => project.company === currentCompany
  );

  const companies = [
    { name: 'Personal', icon: <GitHubIcon className="h-4 w-4" /> },
    { name: 'Ensamble', icon: <GitHubIcon className="h-4 w-4" /> },
    { name: 'KC', icon: <GitHubIcon className="h-4 w-4" /> },
    { name: 'LEMU', icon: <GitHubIcon className="h-4 w-4" /> },
  ];

  // Esta función maneja la selección de la compañía y selecciona el primer proyecto de esa compañía
  const handleCompanySelection = (companyName: string) => {
    setCurrentCompany(companyName);
    const selectedCompanyProject = projectsData.find(
      (project) => project.company === companyName
    );
    if (selectedCompanyProject) {
      setSelectedProject(selectedCompanyProject);
      if (
        selectedCompanyProject.iphoneScreenshots &&
        selectedCompanyProject.iphoneScreenshots.length > 0
      ) {
        setType('browser');
      } else {
        setType('browser');
      }
    }
  };

  // Esta función maneja la selección de un proyecto dentro de la compañía actual
  const handleProjectSelection = (project) => {
    setSelectedProject(project);
    if (project.iphoneScreenshots && project.iphoneScreenshots.length > 0) {
      setType('browser');
    } else {
      setType('browser');
    }
  };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/users/Kal-elSam/repos'
        );
        const data = await response.json();
        setRepos(data);
        setSelectedRepo(data[0]); // Set the first repo as initially selected
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching repos:', error);
      }
    };

    fetchRepos();
  }, []);

  const handleRepoSelection = (repo, index) => {
    setCurrentState(index.toString());
    setSelectedRepo(repo);
  };

  return (
    <SectionContent>
      <div className={clsx('flex', 'lg:gap-12')}>
        <div className={clsx('hidden flex-1 flex-col gap-3 pt-8', 'lg:flex')}>
          {filteredProjects.map((project) => (
            <SectionButton
              key={project.projectName}
              title={project.projectName}
              icon={<GitHubIcon className={clsx('my-2 h-16 w-16')} />}
              active={selectedProject?.projectName === project.projectName}
              onClick={() => handleProjectSelection(project)}
            />
          ))}
        </div>
        <div className={clsx('w-full', 'lg:w-auto')}>
          <div className={clsx('-mt-[41px]')}>
            <div
              className={clsx(
                'w-full',
                type === 'browser'
                  ? 'lg:h-[500px] lg:w-[800px]'
                  : 'lg:h-[644px] lg:w-[390px]'
              )}
            >
              {/* <AppWindow
                type="browser"
                browserTabs={
                  repos.length > 0 &&
                  repos.map((repo, index) => ({
                    icon: <GitHubIcon className="h-4 w-4" />,
                    title: `${selectedRepo?.owner.login}/${repo.name}`,
                    isActive: currentState === index.toString(),
                  }))
                }
              >
                {selectedRepo && (
                  <GitHubWireframe
                    name={selectedRepo.owner.login}
                    language={selectedRepo.language}
                    repository={selectedRepo.name}
                    description={selectedRepo.description}
                    createdAt={selectedRepo.created_at}
                    updatedAt={selectedRepo.updated_at}
                    topics={selectedRepo.topics}
                  />
                )}
              </AppWindow> */}

              <CompanyWindow
                type={type}
                browserTabs={companies.map((company) => ({
                  icon: company.icon,
                  title: company.name,
                  isActive: currentCompany === company.name,
                  onSelect: () => handleCompanySelection(company.name),
                }))}
              >
                {selectedProject && (
                  <ProjectWireframe
                    projectName={selectedProject.projectName}
                    iphoneScreenshots={selectedProject.iphoneScreenshots}
                    macScreenshots={selectedProject.macScreenshots}
                  />
                )}
              </CompanyWindow>
              {/* Contenedor de la descripción, fuera de CompanyWindow */}
              {selectedProject?.description && (
                <div className="mt-4 px-4 py-2 bg-gray-800 rounded-md text-white text-center shadow-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedProject.projectName}
                  </h3>
                  <p className="text-sm">{selectedProject.description}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </SectionContent>
  );
}

export default ProjectsContents;
