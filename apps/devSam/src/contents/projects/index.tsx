import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';

import { GitHubIcon } from '@/components/Icons';
import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
// import SectionTitle from '@/components/sections/SectionTitle';
import AppWindow from '@/components/wireframes/AppWindow';
import GitHubWireframe from '@/components/wireframes/GitHub';
// import NpmWireframe from '@/components/wireframes/Npm';


function ProjectsContents() {
  const [currentState, setCurrentState] = useState<'npm' | 'github'>('github');

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
                title="proyecto1"
                icon={<GitHubIcon className={clsx('my-2 h-16 w-16')} />}
                description="Access powerful and flexible package on GitHub"
                active={currentState === 'github'}
                onClick={() => setCurrentState('github')}
              />
              <SectionButton
                title="proyecto2"
                icon={<GitHubIcon className={clsx('my-2 h-16 w-16')} />}
                description="Install and use the package with ease thanks to its typed options."
                active={currentState === 'npm'}
                onClick={() => setCurrentState('npm')}
              />
            </div>
          </div>
          <div className={clsx('w-full', 'lg:w-auto')}>
            <div className={clsx('-mt-[41px]')}>
              <div className={clsx('w-full', 'lg:h-[400px] lg:w-[600px]')}>
                <AppWindow
                  type="browser"
                  browserTabs={[
                    // Pestanas de proyectos
                    {
                      icon: <GitHubIcon className="h-4 w-4" />,
                      title: 'devsam/tailwindcss-accent - GitHub',
                      isActive: currentState === 'github',
                    },
                    {
                      icon: <GitHubIcon className="h-4 w-4" />,
                      title: 'tailwindcss-accent - npm',
                      isActive: currentState === 'npm',
                    },
                    // {
                    //   icon: <NpmIcon className="h-4 w-4" />,
                    //   title: 'tailwindcss-accent - npm',
                    //   isActive: currentState === 'npm',
                    // },
                  ]}
                >
                  {/* informacion principal de los proyectos */}
                  {currentState === 'github' && (
                    <GitHubWireframe
                      author="Kal-elSam"
                      // license="MIT"
                      repository="tailwindcss-accent"
                      description="Adds accent colors for more dynamic and flexible color utilization."
                    />
                  )}
                   {currentState === 'npm' && (
                    <GitHubWireframe
                      author="Kal-elSam"
                      // license="MIT"
                      repository="tailwindcss-accent"
                      description="Adds accent colors for more dynamic and flexible color utilization."
                    />
                  )}
                  {/* {currentState === 'npm' && (
                    <NpmWireframe
                      packageName="tailwindcss-accent"
                      description="Adds accent colors for more dynamic and flexible color utilization."
                      isWithTypeScript
                    />
                  )} */}

                  {/* Coming Soon Label */}
                  {/* <div className={clsx('absolute inset-0 flex items-center justify-center')}>
                    <h1
                      className={clsx(
                        'text-9xl font-bold text-white transform -rotate-45 origin-center'
                      )}
                    >
                      Coming Soon!
                    </h1>
                  </div> */}
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
