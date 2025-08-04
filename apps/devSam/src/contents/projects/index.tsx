import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { GiBiohazard } from 'react-icons/gi';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

import { GitHubIcon } from '@/components/Icons';
import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
// import SectionTitle from '@/components/sections/SectionTitle';
// import AppWindow from '@/components/wireframes/AppWindow';
// import CompanyWindow from '@/components/wireframes/CompanyWindow';
// import GitHubWireframe from '@/components/wireframes/GitHub';
// import ProjectWireframe from '@/components/wireframes/ProjectWireframe';
import ProjectCard from '@/components/wireframes/ProjectCard';

import projectsData from './proyects';

// import NpmWireframe from '@/components/wireframes/Npm';

type ViewType = 'app' | 'browser';

function ProjectsContents() {
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);

  const [currentCompany, setCurrentCompany] = useState('Personal');
  const [selectedProject, setSelectedProject] = useState(
    projectsData.find((project) => project.company === 'Personal')
  );
  const [type, setType] = useState<ViewType>('browser');
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);

  // Filtra los proyectos según la compañía seleccionada
  const filteredProjects = projectsData.filter(
    (project) => project.company === currentCompany
  );

  const companies = Array.from(
    new Map(
      projectsData.map((project) => [project.company, project.iconPath])
    ).entries()
  ).map(([name, iconPath]) => ({ name, iconPath }));

  // Función para determinar si mostrar el carrusel basado en el número de compañías
  const shouldShowCarousel = useCallback(() => {
    // En pantallas pequeñas, mostrar carrusel con 4+ compañías
    // En pantallas medianas, mostrar carrusel con 5+ compañías
    // En pantallas grandes, mostrar carrusel con 6+ compañías
    
    if (windowWidth < 768) { // móvil
      return companies.length > 3;
    }
    if (windowWidth < 1024) { // tablet
      return companies.length > 4;
    }
    return companies.length > 5; // desktop
  }, [companies.length, windowWidth]);

  // Manejar el resize de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    return undefined;
  }, []);

  // Esta función maneja la selección de la compañía y selecciona el primer proyecto de esa compañía
  const handleCompanySelection = (companyName: string) => {
    setCurrentCompany(companyName);
    const selectedCompanyProject = projectsData.find(
      (project) => project.company === companyName
    );
    if (selectedCompanyProject) {
      setSelectedProject(selectedCompanyProject);
      setCurrentProjectIndex(0);
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
    const projectIndex = filteredProjects.findIndex(p => p.projectName === project.projectName);
    setCurrentProjectIndex(projectIndex);
    if (project.iphoneScreenshots && project.iphoneScreenshots.length > 0) {
      setType('browser');
    } else {
      setType('browser');
    }
  };

  // Funciones para el carrusel
  const handlePreviousProject = useCallback(() => {
    const newIndex = currentProjectIndex > 0 ? currentProjectIndex - 1 : filteredProjects.length - 1;
    setCurrentProjectIndex(newIndex);
    setSelectedProject(filteredProjects[newIndex]);
  }, [currentProjectIndex, filteredProjects]);

  const handleNextProject = useCallback(() => {
    const newIndex = currentProjectIndex < filteredProjects.length - 1 ? currentProjectIndex + 1 : 0;
    setCurrentProjectIndex(newIndex);
    setSelectedProject(filteredProjects[newIndex]);
  }, [currentProjectIndex, filteredProjects]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePreviousProject();
      } else if (event.key === 'ArrowRight') {
        handleNextProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePreviousProject, handleNextProject]);

  // Navegación del carrusel de compañías
  const scrollCompanies = useCallback((direction: 'left' | 'right') => {
    const container = document.querySelector('.companies-carousel');
    if (container) {
      const scrollAmount = 300; // Ajusta según el ancho de los botones
      container.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  }, []);

  // Navegación con teclado para compañías
  useEffect(() => {
    const handleCompanyKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollCompanies('left');
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollCompanies('right');
        }
      }
    };

    window.addEventListener('keydown', handleCompanyKeyDown);
    return () => window.removeEventListener('keydown', handleCompanyKeyDown);
  }, [scrollCompanies]);

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

  // const handleRepoSelection = (repo, index) => {
  //   setCurrentState(index.toString());
  //   setSelectedRepo(repo);
  // };

  return (
    <SectionContent>
      {/* Companies Tabs - Carousel */}
      <div className="mb-16 relative pt-8">
        {/* Carousel container with horizontal scroll */}
        <div className={clsx(
          'flex items-center gap-2 pb-2',
          shouldShowCarousel()
            ? 'companies-carousel overflow-x-auto scrollbar-hide pr-8' 
            : 'justify-center'
        )}>
          {companies.map((company) => (
            <div key={company.name} className={clsx(
              shouldShowCarousel() ? 'flex-shrink-0' : ''
            )}>
              <SectionButton
                title={company.name}
                icon={
                  <Image
                    src={company.iconPath}
                    alt={`${company.name} Icon`}
                    width={24}
                    height={24}
                  />
                }
                active={currentCompany === company.name}
                onClick={() => handleCompanySelection(company.name)}
                variant="compact"
              />
            </div>
          ))}
          {/* Additional space at the end only when there's carousel */}
          {shouldShowCarousel() && <div className="flex-shrink-0 w-4" />}
        </div>
        
        {/* Carousel navigation buttons - only shown if there are more than 5 companies */}
        {shouldShowCarousel() && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              type="button"
              onClick={() => scrollCompanies('left')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              aria-label="Slide left"
            >
              <IoChevronBack className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={() => scrollCompanies('right')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              aria-label="Slide right"
            >
              <IoChevronForward className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Navigation instructions - only shown if there are more than 5 companies */}
        {shouldShowCarousel() && (
          <div className="text-center mt-2 text-xs text-slate-500 dark:text-slate-400">
            Use buttons, slide horizontally, or Ctrl/Cmd + ← → to navigate
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={clsx('flex flex-col', 'lg:gap-20')}>
        {/* Project Card */}
        <div className={clsx('w-full', 'lg:w-auto')}>
          <div className={clsx('-mt-[21px]')}>
            <div
              className={clsx(
                'w-full',
                type === 'browser'
                  ? 'mx-auto max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl'
                  : 'mx-auto max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg'
              )}
            >
              <ProjectCard
                projectName={selectedProject.projectName}
                description={selectedProject.description || ''}
                link={selectedProject.link}
                technologies={selectedProject.technologies}
                iphoneScreenshots={selectedProject.iphoneScreenshots}
                macScreenshots={selectedProject.macScreenshots}
              />
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

              {/* <CompanyWindow
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
              </CompanyWindow> */}
              {/* Contenedor de la descripción, fuera de CompanyWindow */}
              {/* {selectedProject?.description && (
                <div className="mt-4 px-4 py-2 bg-gray-800 rounded-md text-white text-center shadow-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedProject.projectName}
                  </h3>
                  <p className="text-sm">{selectedProject.description}</p>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Projects Carousel */}
        {filteredProjects.length > 1 && (
          <div className="relative">
            {/* Carousel container */}
            <div className="flex items-center justify-center gap-4">
              {/* Previous Button */}
              <button
                type="button"
                onClick={handlePreviousProject}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                aria-label="Previous project"
              >
                <IoChevronBack className="h-5 w-5" />
              </button>

              {/* Project indicators */}
              <div className="flex items-center gap-2">
                {filteredProjects.map((project, index) => (
                  <button
                    key={project.projectName}
                    type="button"
                    onClick={() => handleProjectSelection(project)}
                    className={clsx(
                      'flex h-3 w-3 rounded-full transition-all duration-200',
                      currentProjectIndex === index
                        ? 'bg-accent-600 dark:bg-accent-400'
                        : 'bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500'
                    )}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextProject}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                aria-label="Next project"
              >
                <IoChevronForward className="h-5 w-5" />
              </button>
            </div>

            {/* Current project information */}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {selectedProject?.projectName}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {currentProjectIndex + 1} of {filteredProjects.length}
              </p>
            </div>

            {/* Keyboard navigation */}
            <div className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Use arrow keys ← → to navigate
            </div>
          </div>
        )}
      </div>
    </SectionContent>
  );
}

export default ProjectsContents;
