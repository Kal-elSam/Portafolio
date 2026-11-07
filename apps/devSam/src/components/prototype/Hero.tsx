import clsx from 'clsx';

import { COPY, HUD, PARTS } from './parts';
import Slab from './Slab';

import styles from './prototype.module.css';

const STEP = 62;
const SLAB_W = 300;
const SLAB_H = Math.round((SLAB_W * 110) / 270);

function HeroArt() {
  const height = STEP * (PARTS.length - 1) + SLAB_H;

  return (
    <div
      data-hero-art=""
      className={clsx(
        styles.heroArt,
        'relative mx-auto w-full max-w-[480px] px-2 py-10 sm:px-8'
      )}
    >
      <span
        className={clsx(styles.bracket, 'left-0 top-0 border-l border-t')}
      />
      <span
        className={clsx(styles.bracket, 'right-0 top-0 border-r border-t')}
      />
      <span
        className={clsx(styles.bracket, 'bottom-0 left-0 border-b border-l')}
      />
      <span
        className={clsx(styles.bracket, 'bottom-0 right-0 border-b border-r')}
      />

      <div
        className="relative mx-auto"
        style={{ height, width: SLAB_W }}
        role="img"
        aria-label="Kairo Runtime drawn as six plates separated along one axis: kairo-router plugin, project router, capability scoring, quota pacing, fallback and provider adapters."
      >
        <div
          aria-hidden="true"
          className={clsx(styles.axis, 'absolute -bottom-6 -top-6 w-px')}
          style={{ left: SLAB_W / 2 }}
        />
        {PARTS.map((part, i) => (
          <div
            key={part.id}
            className="absolute left-0"
            style={{ top: i * STEP, width: SLAB_W, zIndex: PARTS.length - i }}
          >
            <Slab
              kind={part.id}
              tone={i % 2 === 0 ? 'primary' : 'secondary'}
              className="block w-full"
            />
            <div
              aria-hidden="true"
              className="absolute hidden items-center gap-2 sm:flex"
              style={{ left: SLAB_W + 4, top: SLAB_H / 2 - 9 }}
            >
              <span
                className={clsx(styles.leader, styles.leaderRight, 'w-6')}
              />
              <span className="whitespace-nowrap text-[0.8125rem] text-[color:var(--ink)]">
                {part.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <header
      className={clsx(
        styles.content,
        'mx-auto flex min-h-screen max-w-[1360px] flex-col px-5 pb-10 pt-6 sm:px-8'
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div className={clsx(styles.titleBlock, 'max-w-[34rem] px-4 py-3')}>
          <p className={clsx(styles.display, 'text-lg leading-tight')}>
            {COPY.name}
          </p>
          <h1 className="mt-1.5 text-[0.9375rem] font-medium leading-snug text-[color:var(--accent)] sm:text-base">
            {COPY.title}
          </h1>
        </div>
        <dl className="hidden gap-x-6 gap-y-1 text-right xl:grid xl:grid-cols-[auto_auto]">
          {HUD.map((item) => (
            <div key={item.label} className="contents">
              <dt className="text-xs leading-5 text-[color:var(--muted)]">
                {item.label}
              </dt>
              <dd className={clsx(styles.data, 'text-xs leading-5')}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-6 lg:py-6">
        <div>
          <h2
            className={clsx(
              styles.display,
              styles.headline,
              'max-w-[15ch] sm:max-w-[18ch]'
            )}
          >
            {COPY.headline}
          </h2>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
            {COPY.subheadline}
          </p>
          <p className="mt-8 text-base">
            <a href="#kairo-scene" className={styles.link}>
              Watch the assembly come apart
            </a>
          </p>
          <dl className="mt-10 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-1 xl:hidden">
            {HUD.map((item) => (
              <div key={item.label} className="contents">
                <dt className="text-xs leading-5 text-[color:var(--muted)]">
                  {item.label}
                </dt>
                <dd
                  className={clsx(
                    styles.data,
                    'text-xs leading-5 [overflow-wrap:anywhere]'
                  )}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroArt />
      </div>
    </header>
  );
}
