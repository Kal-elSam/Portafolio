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
          <div className={clsx('flex w-4 shrink-0 flex-col items-center')}>
            <span
              className={clsx(
                'mt-1.5 h-3 w-3 rounded-full border-2',
                item.isCurrent
                  ? 'border-accent-500 bg-accent-500'
                  : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950'
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
          <article
            className={clsx(
              'min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/[0.03]',
              'dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20'
            )}
          >
            <div
              className={clsx(
                'flex flex-wrap items-baseline justify-between gap-2'
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
                  'text-xs font-bold uppercase tracking-[0.14em] text-slate-500',
                  'dark:text-slate-500'
                )}
              >
                {item.period}
              </p>
            </div>
            <p
              className={clsx(
                'mt-1 text-sm font-semibold text-slate-700',
                'dark:text-slate-300'
              )}
            >
              {item.role}
            </p>
            <p
              className={clsx(
                'mt-0.5 text-xs text-slate-500',
                'dark:text-slate-500'
              )}
            >
              {item.location}
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
