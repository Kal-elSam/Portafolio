import clsx from 'clsx';
import { useEffect,useState } from 'react';

import { GitHubIcon } from '@/components/Icons';
import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
// import SectionTitle from '@/components/sections/SectionTitle';
import AppWindow from '@/components/wireframes/AppWindow';
import GitHubWireframe from '@/components/wireframes/GitHub';

// import NpmWireframe from '@/components/wireframes/Npm';

function ProjectsContents() {
  const [currentState, setCurrentState] = useState(null);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Kal-elSam/repos');
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
          {repos.map((repo, index) => (
            <SectionButton
              key={repo.id}
              title={repo.name}
              icon={<GitHubIcon className={clsx('my-2 h-16 w-16')} />}
              active={currentState === index.toString()}
              onClick={() => handleRepoSelection(repo, index)}
              innerButtonUrl={repo.svn_url}
            />
          ))}
        </div>
        <div className={clsx('w-full', 'lg:w-auto')}>
          <div className={clsx('-mt-[41px]')}>
            <div className={clsx('w-full', 'lg:h-[400px] lg:w-[600px]')}>
              <AppWindow
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
              </AppWindow>
            </div>
          </div>
        </div>
      </div>
    </SectionContent>
  );
}

export default ProjectsContents;
