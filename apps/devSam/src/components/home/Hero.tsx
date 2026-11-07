import { useRef } from 'react';

import { gsap, useGSAP } from '@/components/prototype/gsap';

import { MQ_ANY } from './motion';
import {
  CONTRIBUTIONS_2026,
  COPY,
  CV_HREF,
  HERO_STATEMENT,
  PROJECT_COUNT,
  SOFTWARE_SINCE,
  STACK_COUNTS,
  WORKED_FOR,
} from './workData';

import styles from './hero.module.css';

// Pointer depth only where there is a pointer and room for it.
const MQ_POINTER =
  '(min-width: 900px) and (hover: hover) and (prefers-reduced-motion: no-preference)';
const MQ_WIDE_ORBIT = '(min-width: 1200px)';
const MQ_XL_ORBIT = '(min-width: 1600px)';

const [FIRST, ...REST] = COPY.name.split(' ');

// ---------------------------------------------------------------------------
// Stack orbit geometry.
//
// One wide, flat ring circles the portrait at shoulder height: the near arc
// crosses the chest in front of the plane (never the face), the far arc passes
// behind the plane and the head. Everything is in `u`, the width of the orbit
// box (the box has a fixed aspect, so `u` is also the unit of height), which
// keeps the server markup, the stylesheet and the script on one geometry.
//
// Labels sit at equal angular spacing, in rank order. The count is the largest
// one for which every pair of labels, each with its own width, stays apart at
// every phase of the turn (see `fits`). The server writes a static arrangement
// (near half of the ring only); the script spreads it round the whole ring and
// turns it.
// ---------------------------------------------------------------------------

type LayoutKey = 'c' | 'w' | 'x';

const TAU = Math.PI * 2;
const deg = (n: number) => (n * Math.PI) / 180;
const r3 = (n: number) => Math.round(n * 1000) / 1000;
const KEYS: LayoutKey[] = ['c', 'w', 'x'];

// The plane is 0.5u wide, 0.625u tall and starts 0.02u from the top of the
// box; the head (beard) ends at 77% of it.
const PLANE = { l: 0.25, r: 0.75, t: 0.02, b: 0.645 };
const HEAD_BOTTOM = 0.02 + 0.77 * 0.625;
const FACE_CLEAR = 0.035;
const GAP = 0.01;
// Longest name allowed on the ring; the full list is behind "All N".
const MAX_LABEL = 10;
// Label font size per layout as a fraction of u: the largest the stylesheet
// can produce inside that layout, so counts hold across its whole range.
const FONT: Record<LayoutKey, number> = { c: 0.0358, w: 0.0265, x: 0.0245 };
const RY: Record<LayoutKey, number> = { c: 0.14, w: 0.17, x: 0.17 };
// The most used technologies are larger and lime.
const TOP = 3;
const TIER = 1.12;
const MAX_SCALE = 1.1;
const OMEGA = TAU / 70;

type Ring = {
  rx: number;
  ry: number;
  cy: number;
  /** Labels on the full ring. */
  n: number;
  /** Labels shown on the near half in the static arrangement. */
  ns: number;
  phase: number;
  /** Top of the "All N" control, just under the near arc, in u. */
  foot: number;
};

// Every technology short enough for the ring; labels cycle through all of them.
const POOL = STACK_COUNTS.filter((tech) => tech.name.length <= MAX_LABEL);

// A slot is reserved the width of the name it starts with, at the larger size;
// later it only takes names no longer than that, so it never grows into its
// neighbours.
const labelWidth = (rank: number, fs: number) =>
  (POOL[rank].name.length * 0.6 + 1.6) * fs * TIER * MAX_SCALE;
const labelHeight = (_rank: number, fs: number) =>
  2 * fs * TIER * MAX_SCALE + 0.004;

// Every pair of the first `n` labels, at sixteen phases of one spacing step,
// stays apart.
function fits(n: number, rx: number, ry: number, fs: number) {
  const d = TAU / n;
  for (let k = 0; k < 16; k += 1) {
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const a = (k / 16) * d + i * d;
        const b = (k / 16) * d + j * d;
        const dx = Math.abs(rx * (Math.cos(a) - Math.cos(b)));
        const dy = Math.abs(ry * (Math.sin(a) - Math.sin(b)));
        const w = (labelWidth(i, fs) + labelWidth(j, fs)) / 2;
        const h = (labelHeight(i, fs) + labelHeight(j, fs)) / 2;
        if (dx < w + GAP && dy < h + GAP) return false;
      }
    }
  }
  return true;
}

function buildRing(key: LayoutKey): Ring {
  const fs = FONT[key];
  const ry = RY[key];
  const hh = labelHeight(0, fs) / 2;
  const cy = HEAD_BOTTOM + FACE_CLEAR + hh;
  let n = 1;
  let rx = 0.3;
  for (let count = Math.min(POOL.length, 12); count > 1; count -= 1) {
    let widest = 0;
    for (let i = 0; i < count; i += 1) {
      widest = Math.max(widest, labelWidth(i, fs));
    }
    // Wide enough to clear the plane, within the box.
    const room = 0.5 - widest / 2 - 0.02;
    if (fits(count, room, ry, fs)) {
      n = count;
      rx = room;
      break;
    }
  }
  const step = 360 / n;
  return {
    rx,
    ry,
    cy,
    n,
    ns: Math.floor(150 / step) + 1,
    phase: 0.3,
    foot: cy + ry + hh + 0.02,
  };
}

const GEO: Record<LayoutKey, Ring> = {
  c: buildRing('c'),
  w: buildRing('w'),
  x: buildRing('x'),
};

type Slot = {
  /** Angle on the full ring. */
  theta: number;
  /** Angle in the static arrangement, or null when it only exists live. */
  fixed: number | null;
};

type OrbitItem = {
  name: string;
  count: number;
  rank: number;
  slots: Partial<Record<LayoutKey, Slot>>;
};

const ITEMS: OrbitItem[] = POOL.slice(
  0,
  Math.max(...KEYS.map((k) => GEO[k].n))
).map((tech, rank) => {
  const slots: OrbitItem['slots'] = {};
  KEYS.forEach((key) => {
    const ring = GEO[key];
    if (rank >= ring.n) return;
    // Left to right along the near half of the ring.
    let fixed: number | null = null;
    if (rank < ring.ns) {
      fixed =
        ring.ns === 1
          ? Math.PI / 2
          : deg(165) - (rank * deg(150)) / (ring.ns - 1);
    }
    slots[key] = { theta: ring.phase + (rank / ring.n) * TAU, fixed };
  });
  return { name: tech.name, count: tech.count, rank, slots };
});

const sideOf = (depth: number) => (depth > 0.5 ? 'front' : 'back');

type Placed = {
  /** Offset from the box centre and from the top, in u. */
  x: number;
  y: number;
  /** 0 at the back of the ring, 1 at the front. */
  depth: number;
  scale: number;
  opacity: number;
};

// Far labels stay at 0.8 or more while visible, so they read easily.
function project(ring: Ring, theta: number): Placed {
  const s = Math.sin(theta);
  const depth = (s + 1) / 2;
  return {
    x: ring.rx * Math.cos(theta),
    y: ring.cy + ring.ry * s,
    depth,
    scale: 0.9 + 0.2 * depth,
    opacity: 0.8 + 0.2 * depth ** 0.8,
  };
}

function itemStyle(item: OrbitItem): React.CSSProperties {
  const vars: Record<string, number> = {};
  KEYS.forEach((key) => {
    const slot = item.slots[key];
    if (!slot) return;
    const p = project(GEO[key], slot.fixed ?? slot.theta);
    vars[`--nx-${key}`] = r3(p.x);
    vars[`--ny-${key}`] = r3(p.y);
    vars[`--s-${key}`] = r3(p.scale);
    vars[`--o-${key}`] = r3(p.opacity);
    vars[`--t-${key}`] = item.rank < TOP ? 1 : 0;
    vars[`--z-${key}`] = sideOf(p.depth) === 'front' ? 4 : 1;
  });
  return vars as React.CSSProperties;
}

// Layouts where an item only exists once the script runs.
const liveOnly = (item: OrbitItem) =>
  KEYS.filter((key) => item.slots[key] && item.slots[key]?.fixed === null).join(
    ' '
  );

function ringStyle(): React.CSSProperties {
  const vars: Record<string, number> = {};
  KEYS.forEach((key) => {
    const ring = GEO[key];
    vars[`--grx-${key}`] = r3(ring.rx);
    vars[`--gry-${key}`] = r3(ring.ry);
    vars[`--gcy-${key}`] = r3(ring.cy);
    vars[`--fy-${key}`] = r3(ring.foot);
  });
  return vars as React.CSSProperties;
}

const projectsLabel = (count: number) =>
  `${count} project${count === 1 ? '' : 's'}`;

function Guides({ side }: { side: 'back' | 'front' }) {
  return (
    <div
      className={`${styles.guides} ${
        side === 'front' ? styles.guidesFront : ''
      }`}
      data-guides={side}
      aria-hidden="true"
    >
      <span className={styles.guide} />
    </div>
  );
}

// The first screen of the page: who Samuel is, who he has worked for, and the
// two things a visitor wants to do, with his real stack orbiting his portrait.
// The entrance is CSS (it plays at first paint, before any script); script
// only turns the rings, adds pointer depth and counts the figures up. The base
// markup is the complete static state.
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const readoutRef = useRef<HTMLParagraphElement>(null);
  const pausedRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  // What each slot shows right now, as an index into POOL; the loop swaps
  // entries while their label is hidden behind the plane.
  const shownRef = useRef<number[]>(ITEMS.map((_, i) => i));

  const hold = (slot?: number) => {
    pausedRef.current += slot === undefined ? -1 : 1;
    if (pausedRef.current < 0) pausedRef.current = 0;
    const readout = readoutRef.current;
    if (!readout) return;
    if (slot !== undefined) {
      const tech = POOL[shownRef.current[slot]];
      readout.textContent = `${tech.name} · ${projectsLabel(tech.count)}`;
      readout.dataset.on = '1';
    } else if (pausedRef.current === 0) {
      readout.dataset.on = '0';
    }
  };

  // In-page jump to a section; falls back to the browser's own anchor jump.
  const jump = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (
      !target ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  const pick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    name: string | null
  ) => {
    // Tell the work section which technology was chosen, then go there.
    if (name) {
      window.dispatchEvent(new CustomEvent('work:pick', { detail: name }));
    }
    const target = document.getElementById('projects');
    if (
      !target ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    target.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
    window.history.replaceState(null, '', '#projects');
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;
      const mm = gsap.matchMedia();

      mm.add(MQ_ANY, () => {
        const orbit = section.querySelector<HTMLElement>('[data-orbit]');
        if (!orbit) return undefined;
        const plane = orbit.querySelector<HTMLElement>('[data-plane]');
        const cutout = orbit.querySelector<HTMLElement>('[data-cutout]');
        const back = orbit.querySelector<HTMLElement>('[data-guides="back"]');
        const front = orbit.querySelector<HTMLElement>('[data-guides="front"]');
        const nodes = Array.from(
          orbit.querySelectorAll<HTMLElement>('[data-orb]')
        );
        const mqW = window.matchMedia(MQ_WIDE_ORBIT);
        const mqX = window.matchMedia(MQ_XL_ORBIT);

        // The portrait leaves a little slower than the page as the hero does.
        const drift = gsap.to(orbit, {
          yPercent: -7,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        const counts = Array.from(
          section.querySelectorAll<HTMLElement>('[data-count]')
        ).map((node) => ({
          node,
          end: Number(node.dataset.count),
          state: { v: 0 },
        }));
        // Only count up when the page is still in its first moments; a late
        // script must not blank figures the visitor is already reading.
        const countTweens =
          window.performance.now() < 1500
            ? counts.map(({ node, end, state }) => {
                const el = node;
                el.textContent = '0';
                return gsap.to(state, {
                  v: end,
                  duration: 0.9,
                  delay: 0.4,
                  ease: 'power2.out',
                  onUpdate: () => {
                    el.textContent = Math.round(state.v).toLocaleString(
                      'en-US'
                    );
                  },
                  onComplete: () => {
                    el.textContent = end.toLocaleString('en-US');
                  },
                });
              })
            : [];

        let width = orbit.clientWidth;
        let labelW: number[] = [];
        let labelH: number[] = [];
        const measure = () => {
          width = orbit.clientWidth;
          labelW = nodes.map((node) => node.offsetWidth);
          labelH = nodes.map((node) => node.offsetHeight);
        };
        measure();
        const resize = new ResizeObserver(measure);
        resize.observe(orbit);
        document.fonts?.ready.then(measure);

        // From here on the whole rings show, not only the static near halves.
        section.dataset.live = '1';

        const clock = { t: 0, speed: 1, intro: 0 };
        const par = { x: 0, y: 0, tx: 0, ty: 0 };
        const sides = nodes.map(() => '');
        const names = nodes.map((node) =>
          node.querySelector<HTMLElement>('[data-slot-name]')
        );
        const tallies = nodes.map((node) =>
          node.querySelector<HTMLElement>('[data-slot-count]')
        );
        const swapped = nodes.map(() => false);
        const shown = shownRef.current;
        // How often each technology has been on the ring, so the least shown
        // one that fits the slot comes next and the whole list passes through.
        const tally = POOL.map((_, k) => (k < shown.length ? 1 : 0));

        // While a label is fully faded behind the plane it takes another
        // technology: nobody sees it change.
        const swap = (i: number, limit: number) => {
          const taken = new Set(shown.slice(0, limit));
          const room = POOL[i].name.length;
          let next = -1;
          for (let k = 0; k < POOL.length; k += 1) {
            if (
              !taken.has(k) &&
              POOL[k].name.length <= room &&
              (next < 0 || tally[k] < tally[next])
            ) {
              next = k;
            }
          }
          if (next < 0) return;
          tally[next] += 1;
          shown[i] = next;
          const tech = POOL[next];
          const nameEl = names[i];
          const countEl = tallies[i];
          if (nameEl) nameEl.textContent = tech.name;
          if (countEl) countEl.textContent = `, ${projectsLabel(tech.count)}`;
          KEYS.forEach((k) =>
            nodes[i].style.setProperty(`--t-${k}`, next < TOP ? '1' : '0')
          );
          labelW[i] = nodes[i].offsetWidth;
          labelH[i] = nodes[i].offsetHeight;
        };

        // 1 when the label is clear of the portrait plane, falling to 0 before
        // it touches it: text is never seen cut by the plane's straight edge.
        const clear = (cx: number, cy: number, w: number, h: number) => {
          if (cy + h / 2 < PLANE.t - 0.01 || cy - h / 2 > PLANE.b + 0.01) {
            return 1;
          }
          const gap = Math.max(PLANE.l - (cx + w / 2), cx - w / 2 - PLANE.r);
          return Math.min(1, Math.max(0, (gap - 0.012) / (0.3 * w)));
        };

        const tick = (_time: number, deltaMs: number) => {
          const dt = Math.min(deltaMs, 50) / 1000;
          // Hover and focus ease the turning to a stop and back.
          const target = pausedRef.current > 0 ? 0 : 1;
          clock.speed += (target - clock.speed) * (1 - Math.exp(-dt * 6));
          clock.t += dt * clock.speed;
          clock.intro = Math.min(clock.intro + dt, 1.2);
          // Spin-up: labels spread from the static near arcs around the rings.
          const e = Math.min(Math.max((clock.intro - 0.25) / 0.85, 0), 1);
          const spread = 1 - (1 - e) ** 3;
          const smooth = 1 - Math.exp(-dt * 6);
          par.tx = pointerRef.current.x;
          par.ty = pointerRef.current.y;
          par.x += (par.tx - par.x) * smooth;
          par.y += (par.ty - par.y) * smooth;

          let key: LayoutKey = 'c';
          if (mqX.matches) key = 'x';
          else if (mqW.matches) key = 'w';

          for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            const slot = ITEMS[i]?.slots[key];
            // eslint-disable-next-line no-continue
            if (!slot) continue;
            const ring = GEO[key];
            const from = slot.fixed ?? slot.theta;
            const theta =
              from + (slot.theta - from) * spread + OMEGA * clock.t * spread;
            const p = project(ring, theta);
            const shift = 3 + 9 * p.depth;
            const x = p.x * width + par.x * shift;
            const y = p.y * width + par.y * shift * 0.7;
            let { opacity } = p;
            if (p.depth < 0.5 && width > 0) {
              const w = (labelW[i] * p.scale) / width;
              const h = (labelH[i] * p.scale) / width;
              const seen = clear(0.5 + p.x, p.y, w, h);
              opacity *= seen;
              // Swap only while even the widest name the slot can take would
              // sit wholly behind the plane.
              const reserve =
                (labelWidth(i, FONT[key]) / MAX_SCALE) * p.scale * 1.05;
              const inside =
                0.5 + p.x - reserve / 2 >= PLANE.l &&
                0.5 + p.x + reserve / 2 <= PLANE.r &&
                p.y - h / 2 >= PLANE.t &&
                p.y + h / 2 <= PLANE.b;
              if (seen <= 0.001) {
                if (
                  inside &&
                  !swapped[i] &&
                  pausedRef.current === 0 &&
                  clock.intro >= 1.2
                ) {
                  swapped[i] = true;
                  swap(i, GEO[key].n);
                }
              } else if (seen > 0.3) {
                swapped[i] = false;
              }
            } else {
              swapped[i] = false;
            }
            node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(
              1
            )}px) translate(-50%, -50%) scale(${p.scale.toFixed(3)})`;
            node.style.opacity = opacity.toFixed(3);
            // Behind the head below the midline of depth, over it above.
            const side = sideOf(p.depth);
            if (sides[i] !== side) {
              sides[i] = side;
              node.style.zIndex = side === 'front' ? '4' : '1';
            }
          }

          if (plane) {
            plane.style.transform = `translate3d(${(par.x * -7).toFixed(
              1
            )}px, ${(par.y * -5).toFixed(1)}px, 0) rotateY(${(
              -6 +
              par.x * 7
            ).toFixed(2)}deg) rotateX(${(2.5 - par.y * 5).toFixed(2)}deg)`;
          }
          if (cutout) {
            cutout.style.transform = `translate3d(${(par.x * 9).toFixed(
              1
            )}px, ${(par.y * 6).toFixed(1)}px, 40px)`;
          }
          if (back) {
            back.style.transform = `translate3d(${(par.x * 3).toFixed(1)}px, ${(
              par.y * 2
            ).toFixed(1)}px, 0)`;
          }
          if (front) {
            front.style.transform = `translate3d(${(par.x * 12).toFixed(
              1
            )}px, ${(par.y * 8).toFixed(1)}px, 0)`;
          }
        };

        // The loop runs only while the hero is on screen and the tab is shown.
        let inView = true;
        let running = false;
        const sync = () => {
          const should = inView && !document.hidden;
          if (should && !running) {
            gsap.ticker.add(tick);
            running = true;
          } else if (!should && running) {
            gsap.ticker.remove(tick);
            running = false;
          }
        };
        const observer = new IntersectionObserver(
          (entries) => {
            inView = entries[entries.length - 1]?.isIntersecting ?? true;
            sync();
          },
          { threshold: 0 }
        );
        observer.observe(section);
        document.addEventListener('visibilitychange', sync);
        sync();

        return () => {
          if (running) gsap.ticker.remove(tick);
          observer.disconnect();
          resize.disconnect();
          delete section.dataset.live;
          shown.forEach((_, i) => {
            shown[i] = i;
            const tech = POOL[i];
            const nameEl = names[i];
            const countEl = tallies[i];
            if (nameEl) nameEl.textContent = tech.name;
            if (countEl) countEl.textContent = `, ${projectsLabel(tech.count)}`;
            KEYS.forEach((k) => nodes[i].style.removeProperty(`--t-${k}`));
          });
          document.removeEventListener('visibilitychange', sync);
          countTweens.forEach((tween) => tween.kill());
          counts.forEach((entry) => {
            const el = entry.node;
            el.textContent = entry.end.toLocaleString('en-US');
          });
          drift.scrollTrigger?.kill();
          drift.kill();
          [...nodes, plane, cutout, back, front].forEach((entry) => {
            const el = entry;
            el?.style.removeProperty('transform');
            el?.style.removeProperty('opacity');
            el?.style.removeProperty('z-index');
          });
        };
      });

      mm.add(MQ_POINTER, () => {
        const pointer = pointerRef.current;
        const move = (event: PointerEvent) => {
          // Read every frame by the orbit loop.
          pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
          pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('pointermove', move, { passive: true });
        return () => {
          window.removeEventListener('pointermove', move);
          pointer.x = 0;
          pointer.y = 0;
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.stage}>
        <div className={styles.copy}>
          <p
            className={styles.role}
            style={{ '--i': 0 } as React.CSSProperties}
          >
            {COPY.title}
          </p>
          <h1 id="hero-title" className={styles.name}>
            <span className={styles.mask}>
              <span
                className={styles.rise}
                style={{ '--i': 1 } as React.CSSProperties}
              >
                {FIRST}
              </span>
            </span>{' '}
            <span className={styles.mask}>
              <span
                className={styles.rise}
                style={{ '--i': 2 } as React.CSSProperties}
              >
                {REST.join(' ')}
              </span>
            </span>
          </h1>
          <p
            className={styles.headline}
            style={{ '--i': 3 } as React.CSSProperties}
          >
            {HERO_STATEMENT}
          </p>
          <div
            className={styles.actions}
            style={{ '--i': 4 } as React.CSSProperties}
          >
            <a className={styles.cta} href={CV_HREF} download>
              Download CV
            </a>
            <a
              className={styles.ghost}
              href="#contact"
              onClick={(event) => jump(event, 'contact')}
            >
              Contact
            </a>
          </div>
        </div>

        <div
          className={styles.orbit}
          style={ringStyle()}
          data-portrait
          data-orbit
        >
          <Guides side="back" />
          <div className={styles.deck}>
            <div className={styles.plane} data-plane>
              <span className={`${styles.frame} ${styles.frameFar}`} />
              <span className={`${styles.frame} ${styles.frameNear}`} />
              <span className={styles.face} />
              {/* Source is swappable: a real photo can replace this file. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.cutout}
                data-cutout
                src="/assets/images/home/sam-cutout.webp"
                width={457}
                height={567}
                alt="Illustration of Samuel Gomez Serrano"
                decoding="async"
                // React 18 only knows the lowercase attribute.
                {...{ fetchpriority: 'high' }}
              />
            </div>
          </div>
          <Guides side="front" />

          <ul
            className={styles.orbitList}
            aria-label="Technologies, most used first"
            data-pool={POOL.map((tech) => tech.name).join('|')}
          >
            {ITEMS.map((item, i) => (
              <li
                key={item.name}
                className={styles.item}
                data-orb={i}
                data-lo={liveOnly(item) || undefined}
                style={
                  {
                    ...itemStyle(item),
                    '--k': Math.min(i, 12),
                  } as React.CSSProperties
                }
              >
                <a
                  className={styles.tech}
                  href="#projects"
                  onClick={(event) =>
                    pick(event, POOL[shownRef.current[i]].name)
                  }
                  onPointerEnter={() => hold(i)}
                  onPointerLeave={() => hold()}
                  onFocus={() => hold(i)}
                  onBlur={() => hold()}
                >
                  <span data-slot-name>{item.name}</span>
                  <span className={styles.srOnly} data-slot-count>
                    , {projectsLabel(item.count)}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.foot}>
            <a
              className={styles.all}
              href="#projects"
              aria-label={`All ${STACK_COUNTS.length} technologies`}
              onClick={(event) => pick(event, null)}
            >
              All {STACK_COUNTS.length}
              <span aria-hidden="true"> →</span>
            </a>
            <p
              ref={readoutRef}
              className={styles.readout}
              data-on="0"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <dl className={styles.facts} style={{ '--i': 5 } as React.CSSProperties}>
        <div className={styles.fact}>
          <dt>Worked with</dt>
          <dd>
            <ul className={styles.companies}>
              {WORKED_FOR.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>Projects</dt>
          <dd className={styles.figure} data-count={PROJECT_COUNT}>
            {PROJECT_COUNT}
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>In software since</dt>
          <dd className={styles.figure}>{SOFTWARE_SINCE}</dd>
        </div>
        <div className={styles.fact}>
          <dt>Contributions in 2026</dt>
          <dd className={styles.figure} data-count={CONTRIBUTIONS_2026}>
            {CONTRIBUTIONS_2026.toLocaleString('en-US')}
          </dd>
        </div>
      </dl>
    </section>
  );
}
