import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
import SectionTitle from '@/components/sections/SectionTitle';
import ProjectCard from '@/components/wireframes/ProjectCard';

import projectsData from './proyects';

function ProjectsContents() {
  const [currentCompany, setCurrentCompany] = useState('Kairo Systems');
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);

  const companies = useMemo(
    () =>
      Array.from(
        new Map(
          projectsData.map((project) => [project.company, project.iconPath])
        ).entries()
      ).map(([name, iconPath]) => ({ name, iconPath })),
    []
  );

  const filteredProjects = useMemo(
    () => projectsData.filter((project) => project.company === currentCompany),
    [currentCompany]
  );

  const selectedProject =
    filteredProjects[currentProjectIndex] ?? filteredProjects[0];

  const shouldShowCarousel = useCallback(() => {
    if (windowWidth < 768) return companies.length > 3;
    if (windowWidth < 1024) return companies.length > 4;
    return companies.length > 5;
  }, [companies.length, windowWidth]);

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

  useEffect(() => {
    setCurrentProjectIndex(0);
  }, [currentCompany]);

  const handlePreviousProject = useCallback(() => {
    if (!filteredProjects.length) return;

    setCurrentProjectIndex((previous) =>
      previous > 0 ? previous - 1 : filteredProjects.length - 1
    );
  }, [filteredProjects.length]);

  const handleNextProject = useCallback(() => {
    if (!filteredProjects.length) return;

    setCurrentProjectIndex((previous) =>
      previous < filteredProjects.length - 1 ? previous + 1 : 0
    );
  }, [filteredProjects.length]);

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
  }, [handleNextProject, handlePreviousProject]);

  const scrollCompanies = useCallback((direction: 'left' | 'right') => {
    const container = document.querySelector('.companies-carousel');
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  }, []);

  if (!selectedProject) return null;

  return (
    <SectionContent>
      <header className={clsx('mb-10')}>
        <SectionTitle
          title="Selected Product Work."
          caption="Projects"
          description="A curated view of platforms, SaaS products, dashboards, and AI workflows I have built across startups, enterprise teams, and my own company."
        />
      </header>

      <div
        className={clsx(
          'mb-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-5',
          'dark:border-slate-800 dark:bg-slate-900/60',
          'md:p-6'
        )}
      >
        <div className={clsx('mb-4 flex items-center justify-between gap-4')}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Browse by Company
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Kairo now leads this section because it best represents your
              current positioning in AI systems and product engineering.
            </p>
          </div>

          {shouldShowCarousel() ? (
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollCompanies('left')}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label="Scroll companies left"
              >
                <IoChevronBack className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCompanies('right')}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label="Scroll companies right"
              >
                <IoChevronForward className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        <div
          className={clsx(
            'flex items-center gap-2 pb-1',
            shouldShowCarousel()
              ? 'companies-carousel scrollbar-hide overflow-x-auto pr-4'
              : 'flex-wrap'
          )}
        >
          {companies.map((company) => (
            <div
              key={company.name}
              className={clsx(shouldShowCarousel() ? 'flex-shrink-0' : '')}
            >
              <SectionButton
                title={company.name}
                icon={
                  company.iconPath ? (
                    <Image
                      src={company.iconPath}
                      alt={`${company.name} logo`}
                      width={24}
                      height={24}
                    />
                  ) : undefined
                }
                active={currentCompany === company.name}
                onClick={() => setCurrentCompany(company.name)}
                variant="compact"
              />
            </div>
          ))}
        </div>
      </div>

      <div className={clsx('flex flex-col gap-8')}>
        <ProjectCard
          company={selectedProject.company}
          projectName={selectedProject.projectName}
          description={selectedProject.description || ''}
          link={selectedProject.link}
          technologies={selectedProject.technologies}
          impact={selectedProject.impact}
          role={selectedProject.role}
          iconPath={selectedProject.iconPath}
          iphoneScreenshots={selectedProject.iphoneScreenshots || undefined}
          macScreenshots={selectedProject.macScreenshots || undefined}
        />

        {filteredProjects.length > 1 ? (
          <div
            className={clsx(
              'rounded-[1.75rem] border border-slate-200 bg-white p-5',
              'dark:border-slate-800 dark:bg-slate-900'
            )}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  More work from {currentCompany}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {currentProjectIndex + 1} of {filteredProjects.length}{' '}
                  selected
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviousProject}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="Previous project"
                >
                  <IoChevronBack className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextProject}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="Next project"
                >
                  <IoChevronForward className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {filteredProjects.map((project, index) => (
                <button
                  key={project.projectName}
                  type="button"
                  onClick={() => setCurrentProjectIndex(index)}
                  className={clsx(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    currentProjectIndex === index
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  )}
                >
                  {project.projectName}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </SectionContent>
  );
}

export default ProjectsContents;
