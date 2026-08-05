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
    title: 'Kairo Runtime (npm)',
    href: 'https://www.npmjs.com/package/@kal-elsam/kairo-runtime',
    icon: ExternalLink,
  },
];

function HireMePanel() {
  return (
    <div className={clsx('space-y-8')}>
      <section
        className={clsx(
          'rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/[0.04]',
          'dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20',
          'md:p-8'
        )}
      >
        <p
          className={clsx(
            'text-accent-600 text-sm font-black uppercase tracking-[0.24em]',
            'dark:text-accent-400'
          )}
        >
          Available for hire
        </p>
        <h2
          className={clsx(
            'mt-2 text-2xl font-black text-slate-950',
            'md:text-3xl dark:text-white'
          )}
        >
          Software Engineer · Product Engineer · AI Systems
        </h2>
        <p
          className={clsx(
            'mt-3 max-w-2xl text-sm leading-6 text-slate-600',
            'md:text-base dark:text-slate-400'
          )}
        >
          Open to remote roles and employer-supported relocation. Strongest in
          product engineering, system architecture, and AI-assisted delivery —
          from discovery through production.
        </p>
        <div className={clsx('mt-6 flex flex-wrap gap-2')}>
          <a
            href={CV_HREF}
            download="SamuelGomez-CV.pdf"
            className={clsx('button button--solid')}
          >
            <DocumentIcon className={clsx('h-4 w-4')} />
            Download CV
          </a>
          <a
            href="mailto:samgomezs7@hotmail.com"
            className={clsx('button button--outline')}
          >
            <MailIcon className={clsx('h-4 w-4')} />
            Email Me
          </a>
          <Link href="/work/contact" className={clsx('button button--ghost')}>
            Full contact page
          </Link>
        </div>
      </section>

      <section>
        <h2
          className={clsx(
            'text-lg font-black text-slate-950',
            'dark:text-white'
          )}
        >
          Snapshot
        </h2>
        <dl className={clsx('mt-4 grid gap-3', 'sm:grid-cols-2')}>
          {contactFacts.map((fact) => (
            <div
              key={fact.label}
              className={clsx(
                'rounded-2xl border border-slate-200 bg-white p-4',
                'dark:border-slate-800 dark:bg-slate-950/70'
              )}
            >
              <dt
                className={clsx(
                  'text-[0.65rem] font-black uppercase tracking-[0.16em] text-slate-500',
                  'dark:text-slate-500'
                )}
              >
                {fact.label}
              </dt>
              <dd
                className={clsx(
                  'mt-1 text-sm font-semibold leading-6 text-slate-700',
                  'dark:text-slate-300'
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
      </section>

      <section>
        <h2
          className={clsx(
            'text-lg font-black text-slate-950',
            'dark:text-white'
          )}
        >
          How I create impact
        </h2>
        <div className={clsx('mt-4 grid gap-3', 'lg:grid-cols-3')}>
          {roleProfiles.map((role) => (
            <article
              key={role.id}
              className={clsx(
                'rounded-2xl border border-slate-200 bg-white p-4',
                'dark:border-slate-800 dark:bg-slate-950/70'
              )}
            >
              <h3
                className={clsx(
                  'text-base font-black text-slate-950',
                  'dark:text-white'
                )}
              >
                {role.title}
              </h3>
              <p
                className={clsx(
                  'mt-2 text-sm leading-6 text-slate-600',
                  'dark:text-slate-400'
                )}
              >
                {role.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2
          className={clsx(
            'text-lg font-black text-slate-950',
            'dark:text-white'
          )}
        >
          Links
        </h2>
        <ul className={clsx('mt-4 grid gap-2', 'sm:grid-cols-2')}>
          {socialLinks.map(({ title, href, icon: Icon }) => (
            <li key={title}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer nofollow"
                className={clsx(
                  'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition',
                  'hover:border-accent-300 hover:text-accent-600',
                  'dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300',
                  'dark:hover:border-accent-500 dark:hover:text-accent-400'
                )}
              >
                <Icon className={clsx('h-4 w-4 shrink-0')} />
                {title}
                <ExternalLink
                  className={clsx('ml-auto h-3.5 w-3.5 opacity-50')}
                />
              </a>
            </li>
          ))}
        </ul>
        <p
          className={clsx(
            'mt-4 text-xs leading-5 text-slate-500',
            'dark:text-slate-500'
          )}
        >
          Prefer email for first contact. No public Calendly link is published
          yet — send a note and we can schedule from there.
        </p>
      </section>
    </div>
  );
}

export default HireMePanel;
