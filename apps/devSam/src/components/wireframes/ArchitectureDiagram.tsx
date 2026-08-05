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

/**
 * Reusable vertical architecture diagram rendered in plain JSX/SVG (no
 * external diagramming dependency — see docs/ai/specs/portfolio-product-engineer-v2.spec.md).
 */
function ArchitectureDiagram({ layers }: ArchitectureDiagramProps) {
  return (
    <div
      role="img"
      aria-label={`Architecture diagram: ${layers
        .map((layer) => layer.label)
        .join(' -> ')}`}
      className={clsx('flex flex-col items-stretch gap-0')}
    >
      {layers.map((layer, index) => (
        <div key={layer.id} className={clsx('flex flex-col items-center')}>
          <div
            className={clsx(
              'w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/[0.04]',
              'dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20'
            )}
          >
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
                'mt-1 text-xs leading-5 text-slate-600',
                'dark:text-slate-400'
              )}
            >
              {layer.detail}
            </p>
            {layer.items && layer.items.length > 0 ? (
              <div className={clsx('mt-3 flex flex-wrap gap-1.5')}>
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className={clsx(
                      'rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.7rem] font-bold text-slate-600',
                      'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {index < layers.length - 1 ? (
            <ChevronRightIcon
              aria-hidden="true"
              className={clsx(
                'text-accent-500 my-1 h-5 w-5 rotate-90',
                'dark:text-accent-400'
              )}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default ArchitectureDiagram;
