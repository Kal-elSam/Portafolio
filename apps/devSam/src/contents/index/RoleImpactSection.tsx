import clsx from 'clsx';

import { roleProfiles } from '@/contents/index/roleProfiles';

function RoleImpactSection() {
  return (
    <section className={clsx('content-wrapper')}>
      <div className={clsx('mb-7 max-w-3xl')}>
        <p
          className={clsx(
            'text-accent-600 text-sm font-black uppercase tracking-[0.24em]',
            'dark:text-accent-400'
          )}
        >
          Professional impact
        </p>
        <h2
          className={clsx(
            'mt-2 text-3xl font-black tracking-normal text-slate-950',
            'md:text-4xl dark:text-white'
          )}
        >
          Three ways I create impact
        </h2>
        <p
          className={clsx(
            'mt-3 max-w-2xl text-sm leading-6 text-slate-600',
            'md:text-base dark:text-slate-400'
          )}
        >
          One portfolio, one engineering identity — with three lenses on how I
          deliver value for product teams, engineering organizations, and
          business stakeholders.
        </p>
      </div>

      <div className={clsx('grid gap-4', 'lg:grid-cols-3')}>
        {roleProfiles.map((role) => (
          <article
            key={role.id}
            className={clsx(
              'flex min-h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/[0.04]',
              'dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20'
            )}
          >
            <h3
              className={clsx(
                'text-xl font-black text-slate-950',
                'dark:text-white'
              )}
            >
              {role.title}
            </h3>
            <p
              className={clsx(
                'mt-2 text-sm font-semibold leading-6 text-slate-700',
                'dark:text-slate-300'
              )}
            >
              {role.summary}
            </p>
            <ul
              className={clsx(
                'mt-4 flex flex-1 flex-col gap-2.5 text-sm leading-6 text-slate-600',
                'dark:text-slate-400'
              )}
            >
              {role.proofPoints.map((point) => (
                <li key={point} className={clsx('flex gap-2')}>
                  <span
                    className={clsx(
                      'text-accent-600 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current',
                      'dark:text-accent-400'
                    )}
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <a
              href={role.cvHref}
              download={role.cvHref.split('/').pop()}
              className={clsx(
                'text-accent-600 hover:text-accent-700 mt-5 inline-flex items-center gap-2 text-sm font-black transition',
                'dark:text-accent-400 dark:hover:text-accent-300'
              )}
            >
              Download {role.title} CV
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RoleImpactSection;
