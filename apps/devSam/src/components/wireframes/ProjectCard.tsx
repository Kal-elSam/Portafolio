import clsx from 'clsx';
import Image from 'next/image';

import { ExternalLink } from '../Icons';

interface ProjectCardProps {
  company: string;
  projectName: string;
  description: string;
  link?: string;
  technologies?: string[];
  impact?: string;
  role?: string;
  iconPath?: string;
  iphoneScreenshots?: string[];
  macScreenshots?: string[];
}

function ProjectCard({
  company,
  projectName,
  description,
  link = '',
  technologies = [],
  impact = '',
  role = '',
  iconPath = '',
  iphoneScreenshots = [],
  macScreenshots = [],
}: ProjectCardProps) {
  let screenshots: string[] = [];
  let screenshotType = '';

  if (iphoneScreenshots.length > 0) {
    screenshots = iphoneScreenshots;
    screenshotType = 'iphone';
  } else if (macScreenshots.length > 0) {
    screenshots = macScreenshots;
    screenshotType = 'mac';
  }

  const hasPreview = screenshots.length > 0;

  return (
    <article
      className={clsx(
        'overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60',
        'dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20'
      )}
    >
      <div className={clsx('grid gap-0', 'lg:grid-cols-[1.05fr_0.95fr]')}>
        <div
          className={clsx(
            'flex flex-col gap-6 p-6',
            'md:p-8',
            'lg:border-r lg:border-slate-200 lg:p-10',
            'dark:lg:border-slate-800'
          )}
        >
          <div className={clsx('flex items-start justify-between gap-4')}>
            <div className={clsx('space-y-3')}>
              <span
                className={clsx(
                  'inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700',
                  'dark:bg-cyan-950/50 dark:text-cyan-300'
                )}
              >
                {company}
              </span>
              <div>
                <h2
                  className={clsx(
                    'text-2xl font-black tracking-tight text-slate-900',
                    'md:text-3xl',
                    'dark:text-white'
                  )}
                >
                  {projectName}
                </h2>
                {role ? (
                  <p
                    className={clsx(
                      'mt-2 text-sm font-medium text-slate-500',
                      'dark:text-slate-400'
                    )}
                  >
                    {role}
                  </p>
                ) : null}
              </div>
            </div>

            {iconPath ? (
              <div
                className={clsx(
                  'relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2',
                  'dark:border-slate-700 dark:bg-slate-950'
                )}
              >
                <Image
                  src={iconPath}
                  alt={`${company} logo`}
                  fill
                  className="object-contain p-2"
                  sizes="64px"
                />
              </div>
            ) : null}
          </div>

          {impact ? (
            <div
              className={clsx(
                'rounded-2xl border border-emerald-200 bg-emerald-50 p-4',
                'dark:border-emerald-900 dark:bg-emerald-950/40'
              )}
            >
              <p
                className={clsx(
                  'text-sm font-medium leading-relaxed text-emerald-800',
                  'dark:text-emerald-200'
                )}
              >
                {impact}
              </p>
            </div>
          ) : null}

          <p
            className={clsx(
              'text-sm leading-7 text-slate-600',
              'md:text-[0.95rem]',
              'dark:text-slate-300'
            )}
          >
            {description}
          </p>

          <div className={clsx('flex flex-wrap gap-2')}>
            {technologies.map((tech) => (
              <span
                key={tech}
                className={clsx(
                  'rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600',
                  'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                )}
              >
                {tech}
              </span>
            ))}
          </div>

          {link ? (
            <div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700',
                  'dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'
                )}
              >
                View Project
                <ExternalLink
                  className="h-4 w-4"
                  aria-label={`External link to ${projectName}`}
                />
              </a>
            </div>
          ) : null}
        </div>

        <div
          className={clsx(
            'flex min-h-[320px] items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6',
            'md:min-h-[420px] md:p-8'
          )}
        >
          {hasPreview ? (
            <div
              className={clsx(
                'relative w-full',
                screenshotType === 'iphone'
                  ? 'mx-auto max-w-[250px]'
                  : 'mx-auto max-w-3xl'
              )}
            >
              <Image
                src={screenshots[0]}
                alt={`${projectName} preview`}
                width={screenshotType === 'iphone' ? 250 : 1200}
                height={screenshotType === 'iphone' ? 500 : 720}
                className={clsx(
                  'h-auto w-full object-contain',
                  screenshotType === 'iphone'
                    ? 'rounded-[2rem]'
                    : 'rounded-2xl shadow-2xl shadow-cyan-950/30'
                )}
              />
            </div>
          ) : (
            <div
              className={clsx(
                'flex flex-col items-center justify-center text-center'
              )}
            >
              {iconPath ? (
                <div className="relative mb-6 h-28 w-28">
                  <Image
                    src={iconPath}
                    alt={`${company} logo`}
                    fill
                    className="object-contain"
                    sizes="112px"
                  />
                </div>
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Featured Company
              </p>
              <h3 className="mt-3 text-3xl font-black tracking-tight text-white">
                {company}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                Product systems, automation, and frontend architecture built to
                support real operational workflows.
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
