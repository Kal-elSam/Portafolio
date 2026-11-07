/* The ring is a keyboard-operable widget when it is on: the arrow keys turn it,
   so its stage takes focus and carries the pointer handlers that drag it. */
/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-tabindex */
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ScrollTrigger, useGSAP } from '@/components/prototype/gsap';
import { PROJECTS } from '@/components/prototype/map/data';
import { Boundary, hasWebGL } from '@/components/prototype/SceneLayer';

import {
  areaName,
  FILTERS,
  firstOfArea,
  KAIRO_COMMAND,
  KAIRO_REPO,
  KAIRO_SLOGAN,
  PANELS,
} from './ringData';
import { ringStore } from './scene/ringStore';

import type { RingPanel } from './ringData';
import type { Fonts } from './scene/ringTextures';
import type { AreaId } from '@/components/prototype/map/data';

import home from './home.module.css';
import styles from './ring.module.css';

// All projects, "the archive": a ring of panels around the viewer. Projects
// with a real screen show it on a curved panel, dark until it is at the front;
// the others get a typographic panel with their own stated data. The HTML list
// is the source of truth; the canvas is decoration. Touch, narrow, reduced
// motion, no WebGL and no JS get the same panels as a horizontal gallery.

const RingScene = dynamic(() => import('./scene/RingScene'), { ssr: false });

const QUERY =
  '(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/** Panels the ring turns through across the whole pinned scroll. */
const SCROLL_SPAN = 9;
/** Pixels of drag per panel. */
const DRAG_PX = 0.26;

function ProjectLink({
  panel,
  className = undefined,
  children,
  tabIndex = undefined,
  onFocus = undefined,
}: {
  panel: RingPanel;
  className?: string;
  children: React.ReactNode;
  tabIndex?: number;
  onFocus?: () => void;
}) {
  const { project } = panel;
  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        tabIndex={tabIndex}
        onFocus={onFocus}
      >
        {children}
        <span className={home.srOnly}> (opens in a new tab)</span>
      </a>
    );
  }
  // No public destination: a label, not a link.
  return (
    <span className={className} tabIndex={tabIndex} onFocus={onFocus}>
      {children}
    </span>
  );
}

/** The panel as a card of the gallery: the same screens, no WebGL. */
function Card({ panel, index }: { panel: RingPanel; index: number }) {
  const ar = panel.kind === 'image' ? panel.w / panel.h : 1.6;
  return (
    <li
      className={styles.card}
      data-i={index}
      data-area={panel.project.area}
      data-hero={panel.kind === 'terminal' ? '1' : undefined}
      style={{ '--ar': ar } as React.CSSProperties}
    >
      <ProjectLink panel={panel} className={styles.cardLink}>
        {panel.kind === 'image' && (
          <>
            <span className={styles.plate}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={panel.src}
                width={panel.w}
                height={panel.h}
                alt=""
                draggable={false}
                decoding="async"
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            </span>
            <span className={styles.cardName}>{panel.name}</span>
            <span className={styles.cardMeta}>{panel.meta}</span>
          </>
        )}
        {panel.kind === 'terminal' && (
          <span className={`${styles.plate} ${styles.type}`}>
            <span className={styles.typeBody}>
              <span className={styles.terminalTitle}>Kairo</span>
              <span className={styles.terminalSlogan}>{KAIRO_SLOGAN}</span>
              <span className={styles.terminalBlock}>
                <span aria-hidden="true">$</span> {KAIRO_COMMAND}
              </span>
              <span className={styles.typeFact}>{KAIRO_REPO}</span>
            </span>
          </span>
        )}
        {panel.kind === 'type' && (
          <span className={`${styles.plate} ${styles.type}`}>
            <span className={styles.typeBody}>
              <span className={styles.typeName}>{panel.name}</span>
              <span className={styles.typeMeta}>{panel.meta}</span>
              <span className={styles.typeFact}>
                {areaName(panel.project.area)}
                {panel.project.year ? `  ${panel.project.year}` : ''}
              </span>
            </span>
          </span>
        )}
      </ProjectLink>
    </li>
  );
}

type Mode = 'gallery' | 'ring';

export default function AllProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLUListElement>(null);
  const drag = useRef({ id: -1, x: 0, t: 0, moved: 0 });

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>('gallery');
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [fonts, setFonts] = useState<Fonts | null>(null);
  const [active, setActive] = useState(0);
  const [area, setArea] = useState<AreaId | null>(null);

  const ring = mode === 'ring' && !failed;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    let supported: boolean | null = null;
    const update = () => {
      if (mq.matches && supported === null) supported = hasWebGL();
      setMode(mq.matches && supported ? 'ring' : 'gallery');
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // The ring's state belongs to this section while the ring is on.
  useEffect(() => {
    if (!ring) return undefined;
    ringStore.reset(PANELS.length);
    ringStore.area = null;
    setArea(null);
    setActive(0);
    const onActive = (index: number) => setActive(index);
    ringStore.listeners.add(onActive);
    const node = sectionRef.current;
    if (node) {
      const cs = getComputedStyle(node);
      setFonts({
        display:
          cs.getPropertyValue('--font-proto-display').trim() || 'system-ui',
        mono: cs.getPropertyValue('--font-proto-mono').trim() || 'ui-monospace',
      });
    }
    return () => {
      ringStore.listeners.delete(onActive);
    };
  }, [ring]);

  // Mount the scene a screen and a half before it is needed; unmount it once
  // the visitor is well past, freeing its textures and context.
  useEffect(() => {
    const node = sectionRef.current;
    if (!ring || !node) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (!entry.isIntersecting) setReady(false);
      },
      { rootMargin: '150% 0px 150% 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [ring]);

  // Scrolling through the short pinned section turns the ring. Only deltas are
  // applied, so drag, keys and scroll compose, and a jump (section navigator)
  // never spins it.
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!ring || !section) return undefined;
      let last: number | null = null;
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        refreshPriority: -2,
        onUpdate: (self) => {
          const p = self.progress;
          if (last !== null && Math.abs(p - last) < 0.3) {
            ringStore.scrollBy((p - last) * SCROLL_SPAN);
          }
          last = p;
        },
        onRefresh: (self) => {
          last = self.progress;
        },
      });
      last = trigger.progress;
      return () => trigger.kill();
    },
    { scope: sectionRef, dependencies: [ring] }
  );

  const handleReady = useCallback(() => setReady(true), []);
  const handleFail = useCallback(() => setFailed(true), []);

  const choose = (id: AreaId) => {
    const next = area === id ? null : id;
    setArea(next);
    ringStore.area = next;
    ringStore.wake?.();
    if (!next) return;
    if (ring) {
      ringStore.goto(firstOfArea(next, ringStore.active));
      return;
    }
    const list = galleryRef.current;
    const card = list?.querySelector<HTMLElement>(
      `[data-i="${firstOfArea(next, 0)}"]`
    );
    if (list && card) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      list.scrollTo({
        left: card.offsetLeft - list.offsetLeft - 8,
        behavior: reduced.matches ? 'auto' : 'smooth',
      });
    }
  };

  const clear = () => {
    setArea(null);
    ringStore.area = null;
    ringStore.wake?.();
  };

  const step = (direction: 1 | -1) => {
    if (ring) {
      ringStore.nudge(direction);
      return;
    }
    const list = galleryRef.current;
    if (!list) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    list.scrollBy({
      left: direction * list.clientWidth * 0.8,
      behavior: reduced.matches ? 'auto' : 'smooth',
    });
  };

  // Drag turns the ring, with inertia (the store throws it on release).
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!ring || event.button !== 0) return;
    if ((event.target as HTMLElement).closest('a, button')) return;
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      t: performance.now(),
      moved: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    ringStore.dragStart();
    stageRef.current?.setAttribute('data-dragging', '1');
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    ringStore.pointerX = (event.clientX / innerWidth) * 2 - 1;
    ringStore.pointerY = (event.clientY / innerHeight) * 2 - 1;
    ringStore.wake?.();
    const d = drag.current;
    if (d.id !== event.pointerId) return;
    const now = performance.now();
    const dx = event.clientX - d.x;
    d.moved += Math.abs(dx);
    ringStore.dragMove(-dx / (innerWidth * DRAG_PX), now - d.t);
    d.x = event.clientX;
    d.t = now;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current.id !== event.pointerId) return;
    drag.current.id = -1;
    ringStore.dragEnd();
    stageRef.current?.removeAttribute('data-dragging');
  };

  // A drag must not follow the link it ended on.
  const onClickCapture = (event: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      event.preventDefault();
      event.stopPropagation();
    }
    drag.current.moved = 0;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!ring || event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight') ringStore.nudge(1);
    else if (event.key === 'ArrowLeft') ringStore.nudge(-1);
    else if (event.key === 'Home') ringStore.goto(0);
    else if (event.key === 'End') ringStore.goto(PANELS.length - 1);
    else return;
    event.preventDefault();
  };

  const current = PANELS[active];
  const showScene = ring && near && fonts;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`${home.section} ${styles.section}`}
      data-mode={ring ? 'ring' : 'gallery'}
      aria-labelledby="projects-title"
    >
      <div
        ref={stageRef}
        className={styles.stage}
        data-ready={ring && ready ? '1' : '0'}
        data-filter={area ?? undefined}
        role={ring ? 'group' : undefined}
        aria-label={
          ring
            ? 'Projects ring. Use the left and right arrow keys to turn it.'
            : undefined
        }
        tabIndex={ring ? 0 : undefined}
        onPointerDown={ring ? onPointerDown : undefined}
        onPointerMove={ring ? onPointerMove : undefined}
        onPointerUp={ring ? endDrag : undefined}
        onPointerCancel={ring ? endDrag : undefined}
        onClickCapture={ring ? onClickCapture : undefined}
        onKeyDown={ring ? onKeyDown : undefined}
      >
        {showScene && (
          <Boundary onError={handleFail}>
            <RingScene
              fonts={fonts}
              onReady={handleReady}
              onFail={handleFail}
            />
          </Boundary>
        )}

        <header className={styles.head}>
          <div className={styles.title}>
            <h2 id="projects-title" className={home.h2}>
              All projects
            </h2>
            <p className={styles.count}>
              <span className={home.mono}>{PROJECTS.length}</span> projects
              <Link href="/projects" className={`${home.ghost} ${styles.more}`}>
                Descriptions on the projects page
              </Link>
            </p>
          </div>
          <div className={styles.filters} hidden={!mounted}>
            <div
              role="group"
              aria-label="Filter by area"
              className={styles.chips}
            >
              <button
                type="button"
                className={styles.chip}
                aria-pressed={area === null}
                onClick={() => clear()}
              >
                All<span className={styles.chipCount}>{PROJECTS.length}</span>
              </button>
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={area === f.id}
                  onClick={() => choose(f.id)}
                >
                  {f.label}
                  <span className={styles.chipCount}>{f.count}</span>
                </button>
              ))}
            </div>
            {!ring && (
              <div className={styles.arrows}>
                <button
                  type="button"
                  className={styles.arrow}
                  onClick={() => step(-1)}
                  aria-label="Previous projects"
                >
                  <span aria-hidden="true">&larr;</span>
                </button>
                <button
                  type="button"
                  className={styles.arrow}
                  onClick={() => step(1)}
                  aria-label="Next projects"
                >
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {ring && (
          <>
            <div className={styles.caption}>
              <p
                className={styles.captionName}
                data-show={current.kind === 'image' ? '1' : '0'}
              >
                {current.name}
              </p>
              <p className={styles.captionMeta}>{current.meta}</p>
              <ProjectLink panel={current} className={styles.captionLink}>
                {current.project.href ? 'Open project' : 'Private project'}
                {current.project.href ? (
                  <span aria-hidden="true"> &rarr;</span>
                ) : null}
              </ProjectLink>
            </div>
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => step(-1)}
                aria-label="Previous project"
              >
                <span aria-hidden="true">&larr;</span>
              </button>
              <p className={styles.counter} aria-hidden="true">
                <span className={home.mono}>
                  {String(active + 1).padStart(2, '0')}
                </span>
                <span className={styles.of}>
                  {' / '}
                  {PANELS.length}
                </span>
              </p>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => step(1)}
                aria-label="Next project"
              >
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
            <p className={home.srOnly} aria-live="polite">
              {current.name}. {current.meta}
            </p>
          </>
        )}

        {!ring && (
          <ul
            ref={galleryRef}
            className={styles.gallery}
            aria-label="Project screens"
            data-filter={area ?? undefined}
            onDragStart={(event) => event.preventDefault()}
          >
            {PANELS.map((panel, i) => (
              <Card key={panel.id} panel={panel} index={i} />
            ))}
          </ul>
        )}

        <nav
          className={ring ? styles.listHidden : styles.index}
          aria-label="All projects"
        >
          <ul className={styles.list}>
            {PANELS.map((panel, i) => (
              <li key={panel.id}>
                <ProjectLink
                  panel={panel}
                  className={styles.link}
                  onFocus={ring ? () => ringStore.goto(i) : undefined}
                >
                  {panel.name}
                </ProjectLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
