import { useEffect, useState } from 'react';

import styles from './sectionNav.module.css';

// Plain anchors: without scripts they still jump to every section. The ids
// are the ones the sections render ("home" wraps the hero, "building" wraps the
// Kairo stage), in page order.
const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'building', label: 'Kairo' },
  { id: 'projects', label: 'Work' },
  { id: 'ai', label: 'AI' },
  { id: 'career', label: 'Career' },
  { id: 'contact', label: 'Contact' },
] as const;

// A section is current once its top passes this share of the viewport height.
const READ_LINE = 0.4;

export default function SectionNav() {
  const [current, setCurrent] = useState<string>(SECTIONS[0].id);

  // Current section: the last one whose top is above the read line. Measured
  // from the live layout on every scroll and resize, so pinned heights and
  // lazy sections never leave it stale.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * READ_LINE;
      const root = document.documentElement;
      const atEnd =
        window.scrollY + window.innerHeight >= root.scrollHeight - 2;
      let next: string = SECTIONS[0].id;
      SECTIONS.forEach(({ id }) => {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= line) next = id;
      });
      if (atEnd) next = SECTIONS[SECTIONS.length - 1].id;
      setCurrent((prev) => (prev === next ? prev : next));
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Opened with a hash: the browser jumped before the sticky heights and the
  // lazy sections settled. Align once more, unless the visitor already moved.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!SECTIONS.some((section) => section.id === id)) return undefined;
    let moved = false;
    const stop = () => {
      moved = true;
    };
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    events.forEach((name) =>
      window.addEventListener(name, stop, { passive: true, once: true })
    );
    const align = () => {
      if (moved) return;
      document
        .getElementById(id)
        ?.scrollIntoView({ block: 'start', behavior: 'auto' });
    };
    const timers = [400, 1500].map((ms) => window.setTimeout(align, ms));
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      events.forEach((name) => window.removeEventListener(name, stop));
    };
  }, []);

  return (
    <nav className={styles.nav} aria-label="Sections">
      <ul className={styles.list}>
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={styles.link}
              aria-current={current === id ? 'location' : undefined}
            >
              <span className={styles.label}>{label}</span>
              <span className={styles.mark} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
