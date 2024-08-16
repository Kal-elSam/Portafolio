import clsx from 'clsx';

import { SkeletonMd } from '@/components/wireframes/Skeletons';

import type { PropsWithChildren, ReactNode } from 'react';

interface CompanyTabProps {
  icon: ReactNode;
  title: string;
  isActive: boolean;
  onSelect: () => void; 
}

function CompanyTab({ icon, title, isActive, onSelect }: CompanyTabProps) {
  return (
    <button
      onClick={onSelect}
      className={clsx(
        'flex h-6 items-center truncate rounded-lg cursor-pointer',
        isActive
          ? [
              'bg-slate-200 text-slate-600',
              'dark:bg-slate-100/20 dark:text-slate-300',
            ]
          : ['bg-slate-200/50 text-slate-500', 'dark:bg-slate-100/5']
      )}
      style={{ width: 200 }}
      type="button" // Asegura que el botón no se comporte como un submit si está en un form
    >
      <div className={clsx('flex w-full gap-2 px-2 text-xs')}>
        {icon}
        <div className={clsx('flex-1 truncate')}>{title}</div>
      </div>
    </button>
  );
}



interface CompanyWindowProps {
  type?: 'browser' | 'app';
  browserTabs?: Array<CompanyTabProps>;
}

function CompanyWindow({
  children = null,
  type = 'app',
  browserTabs = [],
}: PropsWithChildren<CompanyWindowProps>) {
  const isWithBrowserTabs = type === 'browser' && browserTabs;

  return (
    <div
      role="presentation"
      className={clsx(
        'border-divider-light flex h-full w-full select-none flex-col overflow-hidden rounded-xl border bg-white',
        'dark:border-divider-dark dark:bg-[#0c1222]',
        type === 'app' && 'max-w-[320px] max-h-[644px]' // Añadir límites de tamaño solo si es una app
      )}
    >
      <div
        className={clsx(
          'border-divider-light relative box-border border-b',
          'dark:border-divider-dark',
          [isWithBrowserTabs ? 'h-20' : 'h-10']
        )}
      >
        <div
          className={clsx(
            'absolute left-4 top-0 flex h-10 items-center gap-1.5'
          )}
        >
          <div
            className={clsx(
              'h-3 w-3 rounded-full bg-red-300',
              'dark:bg-slate-500'
            )}
          />
          <div
            className={clsx(
              'h-3 w-3 rounded-full bg-amber-300',
              'dark:bg-slate-500'
            )}
          />
          <div
            className={clsx(
              'h-3 w-3 rounded-full bg-green-300',
              'dark:bg-slate-500'
            )}
          />
        </div>
        {type === 'browser' && (
          <>
            <div className={clsx('flex h-10 items-center justify-center')}>
              <SkeletonMd w={160} />
            </div>
            {isWithBrowserTabs && (
              <div className={clsx('mt-2 flex gap-2 px-3')}>
                {browserTabs.map(({ icon, title, isActive,onSelect }) => (
                  <CompanyTab
                    key={title}
                    icon={icon}
                    title={title}
                    isActive={isActive}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className={clsx('flex-1 overflow-hidden')}>{children}</div>
    </div>
  );
}

export default CompanyWindow;
