import clsx from 'clsx';
import Link from 'next/link';

import CvDownloadMenu from '@/components/CvDownloadMenu';
import {
  ExternalLink,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  // TwitterIcon,
} from '@/components/Icons';

import dayjs from '@/utils/dayjs';

function LastUpdate() {
  return (
    <a
      href="https://github.com/Kal-elSam"
      target="_blank"
      rel="noreferrer nofollow"
      className={clsx('hover:underline')}
    >
      <span>See the latest updates on GitHub</span>
    </a>
  );
}

interface FooterLinkProps {
  title: string;
  href: string;
  label?: 'new' | 'soon';
  isInternal?: boolean;
}

function FooterLink({
  title,
  href,
  label = undefined,
  isInternal = true,
}: FooterLinkProps) {
  if (label === 'soon') {
    return (
      <span className={clsx('footer-link footer-link--soon')}>
        {title}
        <span className={clsx('footer-link__label')}>{label}</span>
      </span>
    );
  }

  if (isInternal) {
    return (
      <Link href={href} className={clsx('footer-link')}>
        {title}
        {label && <span className={clsx('footer-link__label')}>{label}</span>}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer nofollow"
      className={clsx('footer-link')}
    >
      {title}
      <ExternalLink className={clsx('h-3.5 w-3.5')} />
      {label && <span className={clsx('footer-link__label')}>{label}</span>}
    </a>
  );
}

interface FooterGroupProps {
  title: string;
  links: Array<FooterLinkProps>;
}

function FooterGroup({ title, links }: FooterGroupProps) {
  return (
    <div className={clsx('min-w-[9rem] flex-1')}>
      <div
        className={clsx(
          'mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500',
          'dark:text-slate-500'
        )}
      >
        {title}
      </div>
      <ul className={clsx('flex flex-col gap-2')}>
        {links.map(({ title: linkTitle, href, label, isInternal }) => (
          <li key={`${linkTitle}-${href}`}>
            <FooterLink
              title={linkTitle}
              href={href}
              label={label}
              isInternal={isInternal}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterDescription() {
  return (
    <div className={clsx('max-w-xl')}>
      <p
        className={clsx(
          'text-accent-600 mb-3 text-xs font-black uppercase tracking-[0.22em]',
          'dark:text-accent-400'
        )}
      >
        Available for product-minded teams
      </p>
      <h2
        className={clsx(
          'max-w-lg text-3xl font-black leading-tight text-slate-950',
          'md:text-4xl dark:text-white'
        )}
      >
        Let&apos;s build sharp frontend systems with measurable impact.
      </h2>
      <p
        className={clsx(
          'mt-4 max-w-lg text-sm leading-6 text-slate-600',
          'dark:text-slate-400'
        )}
      >
        I&apos;m Sam Gomez, a Software Engineer focused on product
        engineering, frontend architecture, and AI systems — shipping scalable
        platforms with measurable business impact.
      </p>
      <div className={clsx('mt-6 flex flex-wrap gap-2')}>
        <a
          href="mailto:samgomezs7@hotmail.com"
          className={clsx('button button--solid')}
        >
          <MailIcon className={clsx('h-4 w-4')} />
          Email Me
        </a>
        <CvDownloadMenu variant="outline" />
      </div>
      <ul className={clsx('mt-6 flex gap-2')}>
        <li>
          <a
            href="https://www.linkedin.com/in/samuel-gomez-serrano/"
            target="_blank"
            rel="noreferrer nofollow"
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition',
              'hover:border-accent-300 hover:text-accent-600',
              'dark:hover:border-accent-500 dark:hover:text-accent-400 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300'
            )}
            aria-label="My Linkedin profile"
            title="My LinkedIn profile"
          >
            <LinkedInIcon className={clsx('h-5 w-5')} />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Kal-elSam"
            target="_blank"
            rel="noreferrer nofollow"
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition',
              'hover:border-accent-300 hover:text-accent-600',
              'dark:hover:border-accent-500 dark:hover:text-accent-400 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300'
            )}
            aria-label="My GitHub profile"
            title="My GitHub profile"
          >
            <GitHubIcon className={clsx('h-5 w-5')} />
          </a>
        </li>
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer
      className={clsx(
        'background-grid background-grid--fade-in border-divider-light mt-24 pt-10 text-sm text-slate-900',
        'dark:border-divider-dark dark:text-slate-200'
      )}
    >
      <div className={clsx('content-wrapper')}>
        <div className={clsx('py-12 font-semibold', 'lg:py-16')}>
          <div
            className={clsx(
              'grid gap-10 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-2xl shadow-slate-950/[0.04] backdrop-blur',
              'dark:border-slate-800 dark:bg-slate-950/55 dark:shadow-black/20',
              'lg:grid-cols-[1.35fr_1fr] lg:p-8'
            )}
          >
            <div>
              <FooterDescription />
            </div>
            <div
              className={clsx(
                'grid gap-8 border-t border-slate-200 pt-8',
                'dark:border-slate-800',
                'sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0'
              )}
            >
              <FooterGroup
                title="Explore"
                links={[
                  { title: 'Projects', href: '/projects' },
                  { title: 'Experience', href: '/work/experience' },
                  {
                    title: 'Skills and Tools',
                    href: '/work/skills-and-tools',
                  },
                  { title: 'Contact', href: '/work/contact' },
                ]}
              />
              <FooterGroup
                title="Connect"
                links={[
                  {
                    title: 'LinkedIn',
                    href: 'https://www.linkedin.com/in/samuel-gomez-serrano/',
                    isInternal: false,
                  },
                  {
                    title: 'GitHub',
                    href: 'https://github.com/Kal-elSam',
                    isInternal: false,
                  },
                  {
                    title: 'Source Code',
                    href: 'https://github.com/Kal-elSam',
                    isInternal: false,
                  },
                  {
                    title: 'Credits',
                    href: '/credits',
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div
          className={clsx(
            'border-divider-light flex flex-col gap-3 border-t py-6 text-xs',
            'sm:flex-row sm:items-center sm:justify-between',
            'dark:border-divider-dark'
          )}
        >
          <div className={clsx('font-semibold')}>
            &copy; {dayjs().format('YYYY')}, Sam Gomez
          </div>
          <div className={clsx('text-slate-500', 'dark:text-slate-400')}>
            <LastUpdate />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
