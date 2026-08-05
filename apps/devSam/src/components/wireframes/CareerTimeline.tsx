import clsx from 'clsx';

export interface CareerTimelineItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  isCurrent?: boolean;
}

interface CareerTimelineProps {
  items: CareerTimelineItem[];
}

function CareerTimeline({ items }: CareerTimelineProps) {
  return (
    <ol
      className={clsx('relative m-0 list-none space-y-0 p-0')}
      aria-label="Career timeline"
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          className={clsx('relative flex gap-4 pb-8', 'last:pb-0')}
        >
          <div className={clsx('flex w-3 shrink-0 flex-col items-center')}>
            <span
              className={clsx(
                'mt-2 h-2.5 w-2.5 rounded-full',
                item.isCurrent
                  ? 'bg-accent-500'
                  : 'bg-slate-300 dark:bg-slate-600'
              )}
              aria-hidden="true"
            />
            {index < items.length - 1 ? (
              <span
                className={clsx(
                  'mt-1 w-px flex-1 bg-slate-200',
                  'dark:bg-slate-800'
                )}
                aria-hidden="true"
              />
            ) : null}
          </div>
          <article className={clsx('min-w-0 flex-1 pt-0.5')}>
            <div
              className={clsx(
                'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'
              )}
            >
              <h3
                className={clsx(
                  'text-base font-black text-slate-950',
                  'dark:text-white'
                )}
              >
                {item.company}
              </h3>
              <p
                className={clsx(
                  'font-mono text-xs text-slate-500',
                  'dark:text-slate-500'
                )}
              >
                {item.period}
              </p>
            </div>
            <p
              className={clsx(
                'mt-0.5 text-sm font-semibold text-slate-700',
                'dark:text-slate-300'
              )}
            >
              {item.role}
              <span className={clsx('font-normal text-slate-500')}>
                {' '}
                · {item.location}
              </span>
            </p>
            <p
              className={clsx(
                'mt-2 text-sm leading-6 text-slate-600',
                'dark:text-slate-400'
              )}
            >
              {item.summary}
            </p>
          </article>
        </li>
      ))}
    </ol>
  );
}

export default CareerTimeline;
