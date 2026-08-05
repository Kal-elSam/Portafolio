import clsx from 'clsx';

import { ChevronRightIcon } from '@/components/Icons';

export interface ArchitectureLayer {
  id: string;
  label: string;
  detail: string;
  items?: string[];
}

interface ArchitectureDiagramProps {
  layers: ArchitectureLayer[];
}

function ArchitectureDiagram({ layers }: ArchitectureDiagramProps) {
  return (
    <div
      role="img"
      aria-label={`Architecture diagram: ${layers
        .map((layer) => layer.label)
        .join(' -> ')}`}
      className={clsx(
        'my-6 border-y border-slate-200 py-2',
        'dark:border-slate-800'
      )}
    >
      {layers.map((layer, index) => (
        <div key={layer.id}>
          <div className={clsx('py-4')}>
            <p
              className={clsx(
                'text-sm font-black text-slate-950',
                'dark:text-white'
              )}
            >
              {layer.label}
            </p>
            <p
              className={clsx(
                'mt-1 text-sm leading-6 text-slate-600',
                'dark:text-slate-400'
              )}
            >
              {layer.detail}
            </p>
            {layer.items && layer.items.length > 0 ? (
              <p
                className={clsx(
                  'mt-2 font-mono text-xs leading-5 text-slate-500',
                  'dark:text-slate-500'
                )}
              >
                {layer.items.join(' · ')}
              </p>
            ) : null}
          </div>
          {index < layers.length - 1 ? (
            <div
              className={clsx(
                'flex items-center gap-2 text-slate-400',
                'dark:text-slate-600'
              )}
            >
              <span
                className={clsx(
                  'h-px flex-1 bg-slate-200',
                  'dark:bg-slate-800'
                )}
                aria-hidden="true"
              />
              <ChevronRightIcon
                aria-hidden="true"
                className={clsx('text-accent-500 h-3.5 w-3.5 rotate-90')}
              />
              <span
                className={clsx(
                  'h-px flex-1 bg-slate-200',
                  'dark:bg-slate-800'
                )}
                aria-hidden="true"
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default ArchitectureDiagram;
