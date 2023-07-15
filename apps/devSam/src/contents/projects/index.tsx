import clsx from 'clsx';
import { useState, useEffect } from 'react';

import { GitHubIcon } from '@/components/Icons';
import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
// import SectionTitle from '@/components/sections/SectionTitle';
import AppWindow from '@/components/wireframes/AppWindow';
import GitHubWireframe from '@/components/wireframes/GitHub';
// import NpmWireframe from '@/components/wireframes/Npm';

function ProjectsContents() {
  const [currentState, setCurrentState] = useState<'0' | '1' | '2'>();
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);

  async function fetchRepos() {
    try {
      const response = await fetch(
        'https://api.github.com/users/Kal-elSam/repos'
      );
      const data = await response.json();
      setRepos(data);
      setSelectedRepo(data[0]); // Establecer el primer repositorio como seleccionado inicialmente
    } catch (error) {
      console.error('Error fetching repos:', error);
    }
  }

  useEffect(() => {
    fetchRepos();
  }, []);
  

  return (
    <>
      {/* <SectionTitle
        title="The dynamic accent colors."
        caption="tailwindcss-accent"
        description="Add accent colors for dynamic, flexible color use in your Tailwind CSS project."
        button={{
          title: 'learn more',
          href: '/docs/tailwindcss-accent',
        }}
      /> */}
      <SectionContent>
        <div className={clsx('flex', 'lg:gap-12')}>
          <div className={clsx('hidden flex-1 flex-col gap-3 pt-8', 'lg:flex')}>
            <div className={clsx('flex flex-col gap-3')}>
              {/* Listado de proyectos vertical */}
              <SectionButton
                title={repos[0]?.name}
                icon={<GitHubIcon className={clsx('my-2 h-16 w-16')} />}
                // description={selectedRepo.full_name}
                active={currentState === '0'}
                onClick={() => {
                  setCurrentState('0');
                  setSelectedRepo(repos[0]); // Aquí seleccionas el primer repositorio de la lista (puedes ajustarlo según tus necesidades)
                }}
                innerButtonUrl={repos[0]?.svn_url}
              />

              <SectionButton
                title={repos[1]?.name}
                icon={<GitHubIcon className={clsx('my-2 h-16 w-16')} />}
                // description="Install and use the package with ease thanks to its typed options."
                active={currentState === '1'}
                onClick={() => {
                  setCurrentState('1');
                  setSelectedRepo(repos[1]); // Aquí seleccionas el primer repositorio de la lista (puedes ajustarlo según tus necesidades)
                }}
                innerButtonUrl={repos[1]?.svn_url}
              />
              <SectionButton
                title={repos[2]?.name}
                icon={<GitHubIcon className={clsx('my-2 h-16 w-16')} />}
                // description="Install and use the package with ease thanks to its typed options."
                active={currentState === '2'}
                onClick={() => {
                  setCurrentState('2');
                  setSelectedRepo(repos[2]);
                }}
                innerButtonUrl={repos[2]?.svn_url}
              />
            </div>
          </div>
          <div className={clsx('w-full', 'lg:w-auto')}>
            <div className={clsx('-mt-[41px]')}>
              <div className={clsx('w-full', 'lg:h-[400px] lg:w-[600px]')}>
                <AppWindow
                  type="browser"
                  browserTabs={repos.length > 0 && [
                    // Pestanas de proyectos
                    {
                      icon: <GitHubIcon className="h-4 w-4" />,
                      title: `${selectedRepo?.owner.login}/${repos[0]?.name}`,
                      isActive: currentState === '0',
                    },
                    {
                      icon: <GitHubIcon className="h-4 w-4" />,
                      title: `${selectedRepo?.owner.login}/${repos[1]?.name}`,
                      isActive: currentState === '1',
                    },
                    {
                      icon: <GitHubIcon className="h-4 w-4" />,
                      title: `${selectedRepo?.owner.login}/${repos[2]?.name}`,
                      isActive: currentState === '2',
                    },
                  ]}
                >
                  {/* informacion principal por cada repositorio */}
                  {currentState === '0' && selectedRepo && (
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
                  {currentState === '1' && selectedRepo && (
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
                  {currentState === '2' && selectedRepo && (
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

                  {/* Coming Soon Label */}
                  <div className={clsx('absolute inset-0 flex items-center justify-center')}>
                    <h1
                      className={clsx(
                        'text-9xl font-bold text-white transform -rotate-45 origin-center'
                      )}
                    >
                      Coming Soon!
                    </h1>
                  </div>
                </AppWindow>
              </div>
            </div>
          </div>
        </div>
      </SectionContent>
    </>
  );
}

export default ProjectsContents;
