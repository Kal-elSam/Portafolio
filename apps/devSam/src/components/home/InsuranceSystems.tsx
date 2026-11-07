import { useEffect, useRef, useState } from 'react';

import { ScrollTrigger, useGSAP } from '@/components/prototype/gsap';
import { PROJECTS } from '@/components/prototype/map/data';

import home from './home.module.css';
import styles from './insurance.module.css';

// Insurance systems: an ecosystem, not one product. Real screens of several
// systems, each shown whole and crisp, advance one after another as the page
// scrolls. Plain DOM and CSS 3D: no canvas, no script weight beyond the scroll
// link. Without motion (reduced motion, narrow screens, no JS) the same
// screens sit in a designed static composition.

const DIR = '/assets/images/prototype-wall';

type Shot = {
  /** Project id in the map data: the caption is the project's own name. */
  project: string;
  file: string;
  w: number;
  h: number;
  alt: string;
};

// Strongest real screens first. No portrait-led screen opens the section and
// the Maximus screen is not captioned until the owner decides its name
// (open decision 9), so it is not part of the sequence. Three screens: the
// pinned part of the section is half a viewport of scroll, which is as many
// hand-offs as read well in that length.
const SHOTS: Shot[] = [
  {
    project: 'crm-comercial',
    file: 'crm-comercial',
    w: 1441,
    h: 900,
    alt: 'CRM dashboard: lead totals, conversions, income, sales pipeline and the tasks for today.',
  },
  {
    project: 'titan',
    file: 'titan',
    w: 1452,
    h: 812,
    alt: 'Titan agent indicators: agent details and a table of premium, persistence and pending-payment figures.',
  },
  {
    project: 'nexus-riesgos-amparados',
    file: 'nexus-data',
    w: 1453,
    h: 749,
    alt: 'NEXUS service tickets: open, in-process and resolved counts and a table of recent tickets.',
  },
];

const nameOf = (id: string) => {
  const found = PROJECTS.find((p) => p.id === id);
  if (!found) throw new Error(`Insurance: no project "${id}"`);
  return found.name.split(' — ')[0].split(' / ')[0];
};

const CARDS = SHOTS.map((s) => ({
  ...s,
  name: nameOf(s.project),
  src: `${DIR}/${s.file}.webp`,
}));

const LAST = CARDS.length - 1;

// Share of the viewport height at which the section's trigger starts, and the
// part of its travel (0..1) in which the screens advance: only once the stage
// is pinned, so a screen never leaves through the edge of a moving stage.
const ENTER = 0.5;
const MOVE_FROM = 0.5;
const MOVE_TO = 0.94;

const VARS = ['--x', '--y', '--z', '--rx', '--ry', '--shade', '--cap'];

const QUERY ='(min-width: 900px) and (prefers-reduced-motion: no-preference)';

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Each screen rests flat and crisp, then moves to the next: the position eases
// inside a step and holds at both ends.
const stepped = (t: number) => {
  const base = Math.min(Math.floor(t), LAST);
  return base + smooth(0.1, 0.9, t - base);
};

// One continuous camera move. d is the screen's distance from the front:
// negative once it has passed the camera, positive while it waits behind.
const place = (el: HTMLElement, d: number) => {
  let x = 0;
  let y = 0;
  let z = 0;
  let rx = 0;
  let ry = 0;
  let opacity = 1;
  let shade = 0;
  if (d < 0) {
    // Passed: lifts away toward the camera and up out of frame, tilting back.
    // It stays opaque while it travels, so nothing ghosts through it.
    const u = clamp(-d);
    y = -u * 100;
    z = u * 420;
    x = -u * 3;
    rx = u * 10;
    ry = -u * 5;
    opacity = 1 - smooth(0.5, 0.95, u);
  } else {
    // Behind: smaller, dimmer, a little higher, like a deck seen from the front.
    const k = Math.min(d, 3);
    z = -k * 240;
    y = -k * 8.5;
    x = k * 2.4;
    ry = -k * 1.6;
    shade = Math.min(0.8, k * 0.42);
    opacity = 1 - smooth(1.9, 2.8, k);
  }
  const caption = clamp(1 - Math.abs(d) * 2.6);
  const s = el.style;
  s.setProperty('--x', x.toFixed(3));
  s.setProperty('--y', y.toFixed(3));
  s.setProperty('--z', z.toFixed(2));
  s.setProperty('--rx', rx.toFixed(3));
  s.setProperty('--ry', ry.toFixed(3));
  s.setProperty('--shade', shade.toFixed(3));
  s.setProperty('--cap', caption.toFixed(3));
  s.opacity = opacity.toFixed(3);
  s.visibility = opacity <= 0.002 ? 'hidden' : 'visible';
};

export default function InsuranceSystems() {
  const sectionRef = useRef<HTMLElement>(null);
  const [motion, setMotion] = useState(false);

  // Wide and motion allowed: decided on the client; the server render and
  // no-JS visitors keep the static composition.
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!motion || !section) return undefined;
      const cards = Array.from(
        section.querySelectorAll<HTMLElement>('[data-card]')
      );
      const render = (progress: number) => {
        const t = stepped(
          clamp((progress - MOVE_FROM) / (MOVE_TO - MOVE_FROM)) * LAST
        );
        cards.forEach((card, i) => place(card, i - t));
      };
      render(0);
      // Scroll drives the move directly (no scrub smoothing): the screens
      // follow the wheel.
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: `top ${ENTER * 100}%`,
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        refreshPriority: -1,
        onUpdate: (self) => render(self.progress),
      });
      return () => {
        trigger.kill();
        cards.forEach((card) => {
          VARS.forEach((name) => card.style.removeProperty(name));
          card.style.removeProperty('opacity');
          card.style.removeProperty('visibility');
        });
      };
    },
    { scope: sectionRef, dependencies: [motion] }
  );

  return (
    <section
      id="insurance"
      ref={sectionRef}
      className={`${home.section} ${styles.section}`}
      data-motion={motion ? 'on' : 'off'}
      aria-labelledby="insurance-title"
    >
      <div className={styles.stage}>
        <header className={styles.copy}>
          <h2 id="insurance-title" className={home.h2}>
            Insurance systems
          </h2>
          <p className={home.lede}>
            Agent portals, CRM, analytics and the services behind them.
          </p>
        </header>
        <ol className={styles.deck}>
          {CARDS.map((card, i) => (
            <li
              key={card.project}
              className={styles.card}
              data-card
              style={
                {
                  '--ar': card.w / card.h,
                  zIndex: CARDS.length - i,
                } as React.CSSProperties
              }
            >
              <figure className={styles.figure}>
                <div className={styles.frame}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    width={card.w}
                    height={card.h}
                    alt={card.alt}
                    decoding="async"
                  />
                  <span className={styles.sheen} aria-hidden="true" />
                  <span className={styles.shade} aria-hidden="true" />
                </div>
                <figcaption className={styles.caption}>{card.name}</figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
