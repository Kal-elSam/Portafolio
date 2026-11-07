import Link from 'next/link';
import { useEffect, useRef } from 'react';

import styles from './case.module.css';

export type CaseSection = { id: string; label: string };

export type NextCaseDef = {
  href: string;
  kicker: string;
  title: string;
  line: string;
};

const HIDE_AFTER = 120;
const DELTA = 6;

/** Compact band: the name goes home, "All work" goes to the project list. The
 * band leaves while reading down and returns on the first move up. */
export function CaseNav({
  sections,
  current,
}: {
  sections: CaseSection[];
  current: string;
}) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      nav.style.setProperty(
        '--read',
        max > 0 ? String(Math.min(1, y / max)) : '0'
      );
      if (y < HIDE_AFTER) nav.dataset.hidden = '0';
      else if (y > last + DELTA) nav.dataset.hidden = '1';
      else if (y < last - DELTA) nav.dataset.hidden = '0';
      if (Math.abs(y - last) > DELTA) last = y;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    const onFocus = () => {
      nav.dataset.hidden = '0';
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    nav.addEventListener('focusin', onFocus);
    return () => {
      window.removeEventListener('scroll', onScroll);
      nav.removeEventListener('focusin', onFocus);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const index = Math.max(
    0,
    sections.findIndex((s) => s.id === current)
  );
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <nav
      ref={navRef}
      className={styles.nav}
      aria-label="Primary"
      data-hidden="0"
    >
      <Link href="/" className={styles.navName}>
        Samuel Gomez
      </Link>
      <p className={`${styles.where} ${styles.mono}`} aria-hidden="true">
        <b>{pad(index + 1)}</b> / {pad(sections.length)} ·{' '}
        {sections[index]?.label}
      </p>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/#projects">All work</Link>
        </li>
      </ul>
      <span className={styles.bar} aria-hidden="true" />
    </nav>
  );
}

/** Ticks on the right edge, like the home's navigator. Plain anchors. */
export function CaseRail({
  sections,
  current,
}: {
  sections: CaseSection[];
  current: string;
}) {
  return (
    <nav className={styles.rail} aria-label="On this page">
      <ul className={styles.railList}>
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={styles.railLink}
              aria-current={current === id ? 'location' : undefined}
            >
              <span className={styles.railLabel}>{label}</span>
              <span className={styles.mark} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Closing band: the other case, then back to the project list. */
export function NextCase({ next }: { next: NextCaseDef }) {
  return (
    <footer className={styles.nextCase} aria-labelledby="next-case-title">
      <div className={styles.wrap}>
        <Link
          href={next.href}
          className={`${styles.nextLink} ${styles.cut}`}
          data-reveal=""
        >
          <span className={styles.nextKicker}>{next.kicker}</span>
          <span id="next-case-title" className={styles.nextTitle}>
            {next.title}
            <span className={styles.nextArrow} aria-hidden="true">
              →
            </span>
          </span>
          <span className={styles.nextLine}>{next.line}</span>
        </Link>
        <p className={styles.back}>
          <Link href="/#projects">← Back to all work</Link>
          <Link href="/">Samuel Gomez</Link>
        </p>
      </div>
    </footer>
  );
}
