import clsx from 'clsx';
import Link from 'next/link';

import {
  DocumentIcon,
  ExternalLink,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from '@/components/Icons';

import { CV_HREF, roleProfiles } from '@/contents/index/roleProfiles';

const contactFacts = [
  { label: 'Location', value: 'Mexico' },
  { label: 'Timezone', value: 'America/Mexico_City (CST/CDT)' },
  { label: 'Availability', value: 'Open to Remote & Relocation' },
  { label: 'Visa', value: 'US B1/B2 Visa' },
  {
    label: 'Languages',
    value: 'Spanish (Native) · English (Professional) · Japanese (Basic)',
  },
  {
    label: 'Email',
    value: 'samgomezs7@hotmail.com',
    href: 'mailto:samgomezs7@hotmail.com',
  },
  { label: 'Phone', value: '+52 442 747 1950', href: 'tel:+524427471950' },
];

const socialLinks = [
  {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/in/samuel-gomez-serrano/',
    icon: LinkedInIcon,
  },
  {
    title: 'GitHub',
    href: 'https://github.com/Kal-elSam',
    icon: GitHubIcon,
  },
  {
    title: 'Kairo Systems',
    href: 'https://www.kairosystems.dev/',
    icon: ExternalLink,
  },
  {
    title: 'Kairo Runtime',
    href: 'https://www.npmjs.com/package/@kal-elsam/kairo-runtime',
    icon: ExternalLink,
  },
];

function HireMePanel() {
  return (
    <div className={clsx('max-w-3xl')}>
      <div className={clsx('flex flex-wrap gap-2')}>
        <a
          href={CV_HREF}
          download="SamuelGomez-CV.pdf"
          className={clsx('button button--solid md:button--big')}
        >
          <DocumentIcon className={clsx('h-4 w-4')} />
          Download CV
        </a>
        <a
          href="mailto:samgomezs7@hotmail.com"
          className={clsx('button button--outline md:button--big')}
        >
          <MailIcon className={clsx('h-4 w-4')} />
          Email Me
        </a>
      </div>

      <p
        className={clsx(
          'mt-6 text-base leading-7 text-slate-600',
          'md:text-lg dark:text-slate-400'
        )}
      >
        Open to remote roles and employer-supported relocation. Strongest in
        product engineering, system architecture, and AI-assisted delivery —
        from discovery through production.
      </p>

      <dl
        className={clsx(
          'mt-10 divide-y divide-slate-200 border-y border-slate-200',
          'dark:divide-slate-800 dark:border-slate-800'
        )}
      >
        {contactFacts.map((fact) => (
          <div
            key={fact.label}
            className={clsx(
              'grid gap-1 py-4',
              'sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6'
            )}
          >
            <dt
              className={clsx(
                'text-xs font-bold uppercase tracking-[0.16em] text-slate-500',
                'dark:text-slate-500'
              )}
            >
              {fact.label}
            </dt>
            <dd
              className={clsx(
                'text-sm font-semibold leading-6 text-slate-800',
                'md:text-base dark:text-slate-200'
              )}
            >
              {fact.href ? (
                <a
                  href={fact.href}
                  className={clsx(
                    'text-accent-600 hover:text-accent-700 transition',
                    'dark:text-accent-400 dark:hover:text-accent-300'
                  )}
                >
                  {fact.value}
                </a>
              ) : (
                fact.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <section className={clsx('mt-12')}>
        <h2
          className={clsx(
            'text-xl font-black tracking-tight text-slate-950',
            'dark:text-white'
          )}
        >
          How I create impact
        </h2>
        <ul className={clsx('mt-5 space-y-5')}>
          {roleProfiles.map((role) => (
            <li key={role.id}>
              <h3
                className={clsx(
                  'text-base font-black text-slate-900',
                  'dark:text-slate-100'
                )}
              >
                {role.title}
              </h3>
              <p
                className={clsx(
                  'mt-1 text-sm leading-6 text-slate-600',
                  'dark:text-slate-400'
                )}
              >
                {role.summary}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className={clsx('mt-12')}>
        <h2
          className={clsx(
            'text-xl font-black tracking-tight text-slate-950',
            'dark:text-white'
          )}
        >
          Links
        </h2>
        <ul className={clsx('mt-4 flex flex-wrap gap-x-5 gap-y-3')}>
          {socialLinks.map(({ title, href, icon: Icon }) => (
            <li key={title}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer nofollow"
                className={clsx(
                  'inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition',
                  'hover:text-accent-600',
                  'dark:hover:text-accent-400 dark:text-slate-300'
                )}
              >
                <Icon className={clsx('h-4 w-4')} />
                {title}
              </a>
            </li>
          ))}
        </ul>
        <p
          className={clsx(
            'mt-6 text-sm leading-6 text-slate-500',
            'dark:text-slate-500'
          )}
        >
          Prefer email for first contact.{' '}
          <Link
            href="/work/contact"
            className={clsx(
              'text-accent-600 hover:text-accent-700 font-semibold transition',
              'dark:text-accent-400 dark:hover:text-accent-300'
            )}
          >
            Full contact page
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

export default HireMePanel;
