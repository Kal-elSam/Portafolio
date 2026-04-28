import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { ChevronRightIcon, ExternalLink } from '@/components/Icons';

const cases = [
  {
    title: 'AI Lead Qualification Platform',
    company: 'Kairo Systems',
    eyebrow: 'AI Product Engineering',
    image: '/assets/projects/kairo-systems-landing.png',
    result: '~50% faster response time',
    description:
      'AI workflows for lead qualification, scheduling, WhatsApp automation, and internal product operations.',
    tags: ['Next.js', 'LLM workflows', 'WhatsApp API'],
    href: 'https://www.kairosystems.dev/',
  },
  {
    title: 'NEXUS / Riesgos Amparados',
    company: 'Grupo KC',
    eyebrow: 'Enterprise Dashboard',
    image: '/assets/projects/kc/current/nexus-panel.png',
    result: 'Sales enablement platform',
    description:
      'Commercial tooling for agent activation, support workflows, opportunity visibility, and operational execution.',
    tags: ['React', 'TypeScript', 'Dashboard UX'],
    href: 'https://nexus.grupokc.com.mx/',
  },
  {
    title: 'Solcredito Autos',
    company: 'Grupo KC',
    eyebrow: 'Conversion UX',
    image: '/assets/projects/kc/current/solcredito-autos.png',
    result: 'Lead-focused quote flow',
    description:
      'Public insurance landing and quotation experience optimized for prospect capture and self-service.',
    tags: ['Next.js', 'Responsive UI', 'Lead Gen'],
    href: 'https://www.solcreditoautos.com/',
  },
];

function FeaturedCaseStudies() {
  return (
    <section className={clsx('content-wrapper')}>
      <div
        className={clsx(
          'mb-7 flex flex-col gap-3',
          'md:flex-row md:items-end md:justify-between'
        )}
      >
        <div>
          <p
            className={clsx(
              'text-accent-600 text-sm font-black uppercase tracking-[0.24em]',
              'dark:text-accent-400'
            )}
          >
            Selected case studies
          </p>
          <h2
            className={clsx(
              'mt-2 max-w-2xl text-3xl font-black tracking-normal text-slate-950',
              'md:text-4xl dark:text-white'
            )}
          >
            Product work with real screens, business context, and shipped
            impact.
          </h2>
        </div>
        <Link
          href="/projects"
          className={clsx(
            'text-accent-600 hover:text-accent-700 inline-flex items-center gap-2 text-sm font-black transition',
            'dark:text-accent-400 dark:hover:text-accent-300'
          )}
        >
          View all projects
          <ChevronRightIcon className={clsx('h-4 w-4')} />
        </Link>
      </div>

      <div className={clsx('grid gap-4', 'lg:grid-cols-3')}>
        {cases.map((item) => (
          <article
            key={item.title}
            className={clsx(
              'group flex min-h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-950/[0.04] transition duration-300',
              'hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/10',
              'dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20'
            )}
          >
            <div
              className={clsx(
                'relative aspect-[16/10] overflow-hidden bg-slate-100',
                'dark:bg-slate-900'
              )}
            >
              <Image
                src={item.image}
                alt={`${item.title} preview`}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className={clsx(
                  'object-cover object-top',
                  'transition duration-500 group-hover:scale-[1.03]'
                )}
              />
            </div>
            <div className={clsx('flex flex-1 flex-col p-5')}>
              <div
                className={clsx(
                  'mb-4 grid min-h-[5.75rem] grid-cols-[1fr_auto] items-start gap-4'
                )}
              >
                <div>
                  <p
                    className={clsx(
                      'text-xs font-black uppercase tracking-[0.2em] text-slate-500',
                      'dark:text-slate-500'
                    )}
                  >
                    {item.eyebrow}
                  </p>
                  <h3
                    className={clsx(
                      'mt-2 text-xl font-black leading-tight text-slate-950',
                      'dark:text-white'
                    )}
                  >
                    {item.title}
                  </h3>
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${item.title}`}
                  className={clsx(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition',
                    'hover:bg-accent-600 hover:text-white',
                    'dark:hover:bg-accent-500 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white'
                  )}
                >
                  <ExternalLink className={clsx('h-4 w-4')} />
                </a>
              </div>
              <p
                className={clsx(
                  'bg-accent-600/[0.08] text-accent-700 mb-3 inline-flex rounded-full px-3 py-1 text-xs font-black',
                  'dark:bg-accent-400/10 dark:text-accent-300'
                )}
              >
                {item.result}
              </p>
              <p
                className={clsx(
                  'min-h-[5rem] text-sm leading-6 text-slate-600',
                  'dark:text-slate-400'
                )}
              >
                {item.description}
              </p>
              <div className={clsx('mt-auto flex flex-wrap gap-2 pt-5')}>
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={clsx(
                      'rounded-full border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600',
                      'dark:border-slate-800 dark:text-slate-400'
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCaseStudies;
