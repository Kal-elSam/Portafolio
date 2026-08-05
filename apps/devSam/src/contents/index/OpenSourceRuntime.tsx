/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import Link from 'next/link';

import { ChevronRightIcon, GitHubIcon, NpmIcon } from '@/components/Icons';

const principles = [
  'Detects the AI coding agents you already use — Cursor, Codex, Claude, Gemini, Copilot',
  'Writes managed, reversible config sections instead of dumping templates',
  'Ships spec-driven and test-driven governance (SDD/TDD) as a first-class workflow',
  'Terminal-first control center — status, sync, doctor, rollback, monitoring',
];

function OpenSourceRuntime() {
  return (
    <section className={clsx('content-wrapper')}>
      <div className={clsx('mb-7 max-w-3xl')}>
        <p
          className={clsx(
            'text-accent-600 text-sm font-black uppercase tracking-[0.24em]',
            'dark:text-accent-400'
          )}
        >
          Open Source
        </p>
        <h2
          className={clsx(
            'mt-2 text-3xl font-black tracking-normal text-slate-950',
            'md:text-4xl dark:text-white'
          )}
        >
          Kairo Runtime
        </h2>
        <p
          className={clsx(
            'mt-3 max-w-2xl text-sm leading-6 text-slate-600',
            'md:text-base dark:text-slate-400'
          )}
        >
          A published local agent operating system that governs how I run
          spec-driven, test-driven engineering workflows across Cursor, Codex,
          and Claude — including this portfolio repository.
        </p>
      </div>

      <div
        className={clsx(
          'grid gap-10 border-t border-slate-200 pt-8',
          'dark:border-slate-800',
          'lg:grid-cols-[1.2fr_0.8fr] lg:gap-14'
        )}
      >
        <div>
          <div className={clsx('mb-5 flex flex-wrap items-center gap-3')}>
            <img
              src="https://img.shields.io/npm/v/%40kal-elsam%2Fkairo-runtime.svg?style=flat-square&color=e11d48"
              alt="npm version for @kal-elsam/kairo-runtime"
              height={20}
            />
            <img
              src="https://img.shields.io/npm/dm/%40kal-elsam%2Fkairo-runtime.svg?style=flat-square&color=e11d48"
              alt="npm monthly downloads for @kal-elsam/kairo-runtime"
              height={20}
            />
          </div>

          <ul
            className={clsx(
              'flex flex-col gap-2.5 text-sm leading-6 text-slate-600',
              'dark:text-slate-400'
            )}
          >
            {principles.map((principle) => (
              <li key={principle} className={clsx('flex gap-2')}>
                <span
                  className={clsx(
                    'text-accent-600 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current',
                    'dark:text-accent-400'
                  )}
                  aria-hidden="true"
                />
                <span>{principle}</span>
              </li>
            ))}
          </ul>

          <div className={clsx('mt-6 flex flex-wrap gap-2')}>
            <Link
              href="/work/kairo-runtime"
              className={clsx('button button--solid')}
            >
              How it works
              <ChevronRightIcon className={clsx('h-4 w-4')} />
            </Link>
            <a
              href="https://www.npmjs.com/package/@kal-elsam/kairo-runtime"
              target="_blank"
              rel="noreferrer nofollow"
              className={clsx('button button--outline')}
            >
              <NpmIcon className={clsx('h-4 w-4')} />
              npm
            </a>
            <a
              href="https://github.com/Kal-elSam/harness"
              target="_blank"
              rel="noreferrer nofollow"
              className={clsx('button button--outline')}
            >
              <GitHubIcon className={clsx('h-4 w-4')} />
              GitHub
            </a>
          </div>
        </div>

        <div>
          <p
            className={clsx(
              'text-xs font-bold uppercase tracking-[0.16em] text-slate-500',
              'dark:text-slate-500'
            )}
          >
            Install
          </p>
          <pre
            className={clsx(
              'mt-3 overflow-x-auto rounded-lg bg-slate-950 px-4 py-3 font-mono text-xs leading-6 text-slate-200'
            )}
          >
            <code>npx @kal-elsam/kairo-runtime</code>
          </pre>
          <p
            className={clsx(
              'mt-3 text-sm leading-6 text-slate-500',
              'dark:text-slate-500'
            )}
          >
            This portfolio and Kairo Systems (ARI, MAYA) ship with the same
            SDD/TDD discipline Kairo Runtime governs.
          </p>
        </div>
      </div>
    </section>
  );
}

export default OpenSourceRuntime;
