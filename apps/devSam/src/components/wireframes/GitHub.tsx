import clsx from 'clsx';

import { SkeletonSm } from '@/components/wireframes/Skeletons';
import { format, parseISO } from 'date-fns';

interface GithubWireframeProps {
  name?: string;
  language?: string;
  repository: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  topics: string[];
}

function GitHubWireframe({
  name = '',
  language = '',
  repository,
  description,
  createdAt,
  updatedAt,
  topics
}: GithubWireframeProps) {
  const createdDate = createdAt ? parseISO(createdAt) : null;
  const updatedDate = updatedAt ? parseISO(updatedAt) : null;

  const formattedCreatedDate = createdDate
    ? format(createdDate, 'dd/MM/yyyy')
    : '';
  const formattedUpdatedDate = updatedDate
    ? format(updatedDate, 'dd/MM/yyyy')
    : '';

  return (
    <div
      className={clsx(
        'h-full w-full bg-white p-4 text-sm text-slate-600',
        'dark:bg-slate-900 dark:text-slate-400'
      )}
    >
      <div className={clsx('flex items-center gap-1')}>
        <div className={clsx('mr-1')}>
          <SkeletonSm />
        </div>
        {name ? (
          <div className={clsx('-mt-0.5 text-blue-700', 'dark:text-blue-500')}>
            {name}
          </div>
        ) : (
          <SkeletonSm w={64} />
        )}
        <div className={clsx('-mt-0.5')}>/</div>
        <div
          className={clsx(
            '-mt-0.5 font-bold text-blue-700',
            'dark:font-semibold dark:text-blue-500'
          )}
        >
          {repository}
        </div>
        <div
          className={clsx(
            'border-divider-light ml-1 rounded-full border px-2 py-0.5 text-xs',
            'dark:border-divider-dark'
          )}
        >
          public
        </div>
      </div>
      <div className={clsx('mt-2')}>
        <p>{description}</p>
      </div>
      {/* Contenido del proyecto */}
      {/* Seccion de detalles principales */}
      <div className={clsx('mt-6 flex flex-col gap-3')}>
        <div className={clsx('flex items-center gap-2')}>
          <SkeletonSm />
          {language ? (
            <div className={clsx('')}>
              <p>Language: {language} </p>
            </div>
          ) : (
            <SkeletonSm w={64} />
          )}
        </div>
        <div className={clsx('flex items-center gap-3')}>
          <div className={clsx('flex items-center gap-1')}>
            <SkeletonSm />
            {createdDate ? (
            <div className={clsx('')}>
              <p>Created at: {formattedCreatedDate}</p>
            </div>
          ) : (
            <SkeletonSm w={64} />
          )}
          </div>
          <div className={clsx('flex items-center gap-1')}>
          {updatedDate ? (
            <div className={clsx('')}>
              <p>Updated at: {formattedUpdatedDate}</p>
            </div>
          ) : (
            <SkeletonSm w={64} />
          )}
          </div>
        </div>
      </div>
      {/* Seccion 2 */}
      
      <div className={clsx('mt-6 flex gap-2')}>
        <div
          className={clsx(
            'border-divider-light flex h-10 flex-1 items-center justify-center rounded-lg border',
            'dark:border-divider-dark'
          )}
        >
          <div className={clsx('flex items-center gap-1')}>  
            <SkeletonSm/>
            {topics ? (
            <div className={clsx('')}>
              <p>{topics[0]}</p>
            </div>
          ) : (
            <SkeletonSm w={48} />
            )}
          </div>
        </div>
        <div
          className={clsx(
            'border-divider-light flex h-10 flex-1 items-center justify-center rounded-lg border',
            'dark:border-divider-dark'
          )}
        >
          <div className={clsx('flex items-center gap-1')}>
          <SkeletonSm/>
          {topics ? (
            <div className={clsx('')}>
              <p>{topics[1]}</p>
            </div>
          ) : (
            <SkeletonSm w={64} />
            )}
          </div>
        </div>
        <div
          className={clsx(
            'border-divider-light flex h-10 flex-1 items-center justify-center rounded-lg border',
            'dark:border-divider-dark'
          )}
        >
          <div className={clsx('flex items-center gap-1')}>
          <SkeletonSm/>
          {topics ? (
            <div className={clsx('')}>
              <p>{topics[2]}</p>
            </div>
          ) : (
            <SkeletonSm w={64} />
            )}
          </div>
        </div>
      </div>
      <div className={clsx('mt-6 flex gap-2')}>
        <div
          className={clsx(
            'border-divider-light flex h-10 flex-1 items-center justify-center rounded-lg border',
            'dark:border-divider-dark'
          )}
        >
          <div className={clsx('flex items-center gap-1')}>
          <SkeletonSm/>
            {topics ? (
            <div className={clsx('')}>
              <p>{topics[3]}</p>
            </div>
          ) : (
            <SkeletonSm w={48} />
            )}
          </div>
        </div>
        <div
          className={clsx(
            'border-divider-light flex h-10 flex-1 items-center justify-center rounded-lg border',
            'dark:border-divider-dark'
          )}
        >
          <div className={clsx('flex items-center gap-1')}>
          <SkeletonSm/>
          {topics ? (
            <div className={clsx('')}>
              <p>{topics[4]}</p>
            </div>
          ) : (
            <SkeletonSm w={64} />
            )}
          </div>
        </div>
        <div
          className={clsx(
            'border-divider-light flex h-10 flex-1 items-center justify-center rounded-lg border',
            'dark:border-divider-dark'
          )}
        >
          <div className={clsx('flex items-center gap-1')}>
          <SkeletonSm/>
          {topics ? (
            <div className={clsx('')}>
              <p>{topics[5]}</p>
            </div>
          ) : (
            <SkeletonSm w={64} />
            )}
          </div>
        </div>
      </div>
      
      {/* Seccion 3 */}
      {/* <div
        className={clsx(
          'border-divider-light mt-4 flex border-b',
          'dark:border-divider-dark'
        )}
      >
        <div className={clsx('-mb-[2px] flex h-12')}>
          <div
            className={clsx(
              'flex items-center gap-1 border-b-[3px] border-amber-400 px-6 dark:border-amber-900'
            )}
          >
            <SkeletonSm />
            {language ? (
            <div className={clsx('')}>
              <p>{language} </p>
            </div>
          ) : (
            <SkeletonSm w={32} />
            )}
          </div>
        </div>
        <div className={clsx('-mb-[2px] flex h-12')}>
          <div
            className={clsx(
              'flex items-center gap-1 border-b-[3px] border-transparent px-6'
            )}
          >
            <SkeletonSm />
            {language ? (
            <div className={clsx('')}>
              <p>{language} </p>
            </div>
          ) : (
            <SkeletonSm w={40} />
            )}
          </div>
        </div>
        <div className={clsx('-mb-[2px] flex h-12')}>
          <div
            className={clsx(
              'flex items-center gap-1 border-b-[3px] border-transparent px-6'
            )}
          >
            <SkeletonSm />
            {language ? (
            <div className={clsx('')}>
              <p>{language} </p>
            </div>
          ) : (
            <SkeletonSm w={80} />
            )}
          </div>
        </div>
        <div className={clsx('-mb-[2px] flex h-12')}>
          <div
            className={clsx(
              'flex items-center gap-1 border-b-[3px] border-transparent px-6'
            )}
          >
            <SkeletonSm />
            {language ? (
            <div className={clsx('')}>
              <p>{language} </p>
            </div>
          ) : (
            <SkeletonSm w={48} />
            )}
          </div>
        </div>
        <div className={clsx('-mb-[2px] flex h-12')}>
          <div
            className={clsx(
              'flex items-center gap-1 border-b-[3px] border-transparent px-6'
            )}
          >
            <SkeletonSm />
            {language ? (
            <div className={clsx('')}>
              <p>{language} </p>
            </div>
          ) : (
            <SkeletonSm w={40} />
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default GitHubWireframe;
