import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ScrollTrigger, useGSAP } from '../gsap';
import {
  AREAS,
  CONTACT_HREF,
  COPY,
  CV_HREF,
  projectsByArea,
} from '../map/data';
import { Boundary, hasWebGL } from '../SceneLayer';
import { KEYS, progressOfStop, stopAt } from './layout';
import { PRIMARY, primaryByArea, SCREENS } from './screens';
import StaticWall from './StaticWall';
import { wallStore } from './store';

import styles from './wall.module.css';

// Loaded only after the client confirmed it can run the scene, so the server
// render, no-JS visitors and every other page never wait on three.
const WallScene = dynamic(() => import('./WallScene'), { ssr: false });

const QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
const WIDE = 900;

function SceneLayer({
  ready,
  onReady,
  onFail,
}: {
  ready: boolean;
  onReady: () => void;
  onFail: () => void;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    let supported: boolean | null = null;
    const update = () => {
      if (mq.matches && supported === null) supported = hasWebGL();
      const next = mq.matches && supported === true;
      setEnabled(next);
      if (!next) onFail();
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
    // onFail is stable (useCallback in the stage).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;
  return (
    <Boundary onError={onFail}>
      <WallScene ready={ready} onReady={onReady} onFail={onFail} />
    </Boundary>
  );
}

export default function WallStage() {
  const stageRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [ready, setReady] = useState(false);
  const [stop, setStop] = useState(0);
  const lastStop = useRef(0);

  const handleReady = useCallback(() => setReady(true), []);
  const handleFail = useCallback(() => {
    wallStore.invalidate = () => undefined;
    setReady(false);
  }, []);

  useGSAP(
    () => {
      if (!ready || !stageRef.current) return undefined;
      const trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top top',
        // About 0.65 of a screen of scroll per camera move.
        end: () =>
          `+=${Math.round(window.innerHeight * (KEYS.length - 1) * 0.65)}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          wallStore.progress = self.progress;
          wallStore.invalidate();
          const next = stopAt(self.progress);
          if (lastStop.current !== next) {
            lastStop.current = next;
            wallStore.setActive(null);
            setStop(next);
          }
        },
      });
      triggerRef.current = trigger;
      return () => {
        triggerRef.current = null;
        wallStore.progress = 0;
        lastStop.current = 0;
        setStop(0);
      };
    },
    { scope: stageRef, dependencies: [ready], revertOnUpdate: true }
  );

  // Damped parallax follows the pointer over the whole stage.
  useEffect(() => {
    if (!ready) return undefined;
    const onMove = (event: PointerEvent) => {
      wallStore.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      wallStore.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      wallStore.invalidate();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [ready]);

  // Tell the camera where the free region of the stage is: right of the copy
  // on wide screens, below the active block on narrow ones.
  useEffect(() => {
    if (!ready) return undefined;
    const measure = () => {
      const stage = stageRef.current;
      const el = stage?.querySelector('[data-block][data-active="true"]');
      if (!stage || !el) return;
      const box = stage.getBoundingClientRect();
      const copy = stage.querySelector('[data-copy]');
      const wide = window.innerWidth >= WIDE;
      wallStore.regionTop = wide
        ? 0
        : el.getBoundingClientRect().bottom - box.top + 12;
      // The wall starts where the copy column ends, in the hero and the tour:
      // no screen is ever drawn behind the text.
      const copyRight =
        wide && copy ? copy.getBoundingClientRect().right - box.left : 0;
      wallStore.copyRight = copyRight;
      wallStore.regionLeft = copyRight > 0 ? copyRight + 24 : 0;
      wallStore.invalidate();
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ready, stop]);

  /** Scrolls the pinned tour to a stop; false when the tour is not running. */
  const goToStop = useCallback((index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return false;
    const top =
      trigger.start + progressOfStop(index) * (trigger.end - trigger.start);
    window.scrollTo({ top, behavior: 'smooth' });
    return true;
  }, []);

  const goToArea = useCallback(
    (index: number) => {
      if (!goToStop(index + 1)) return false;
      // Keyboard users land on the new heading once the move has settled.
      window.setTimeout(() => {
        const heading = stageRef.current?.querySelector<HTMLElement>(
          `[data-caption="${AREAS[index].id}"] h2`
        );
        heading?.focus({ preventScroll: true });
      }, 900);
      return true;
    },
    [goToStop]
  );

  return (
    <section
      ref={stageRef}
      className={styles.stage}
      data-scene={ready ? 'on' : 'off'}
      data-stop={stop}
      aria-label="Work: a wall of real product screens"
    >
      <SceneLayer ready={ready} onReady={handleReady} onFail={handleFail} />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.stageInner}>
        <div className={styles.copy} data-copy>
          <div className={styles.hero} data-block data-active={stop === 0}>
            <p className={styles.name}>{COPY.name}</p>
            <p className={styles.title}>{COPY.title}</p>
            <h1 className={styles.headline}>{COPY.headline}</h1>
            <p className={styles.sub}>{COPY.subheadline}</p>
            <div className={styles.actions}>
              <a className={styles.cta} href={CV_HREF} download>
                Download CV
              </a>
              <a className={styles.ghost} href={CONTACT_HREF}>
                Contact
              </a>
            </div>
            <nav
              className={styles.areaNav}
              aria-label="Browse projects by area"
            >
              <p>
                {SCREENS.length} screens from {PRIMARY.length} projects.
              </p>
              <ul>
                {AREAS.map((area, i) => (
                  <li key={area.id}>
                    <a
                      href={`#lane-${area.id}`}
                      onClick={(event) => {
                        if (goToArea(i)) event.preventDefault();
                      }}
                    >
                      {area.name}
                      <span className={`${styles.count} ${styles.data}`}>
                        {projectsByArea(area.id).length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <p className={styles.hint}>Scroll to fly along the wall.</p>
          </div>

          {AREAS.map((area, i) => {
            const list = projectsByArea(area.id);
            const withScreen = primaryByArea(area.id).length;
            return (
              <div
                key={area.id}
                className={styles.caption}
                data-block
                data-caption={area.id}
                data-active={stop === i + 1}
              >
                <h2 className={styles.capTitle} tabIndex={-1}>
                  {area.name}
                </h2>
                <p className={`${styles.capMeta} ${styles.data}`}>
                  {list.length} projects, {withScreen} on the wall
                </p>
                <p className={styles.capSummary}>{area.summary}</p>
                <ul className={styles.capList}>
                  {list.map((p) => (
                    <li key={p.id}>
                      {p.href ? (
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => wallStore.setActive(p.id)}
                          onMouseLeave={() => wallStore.setActive(null)}
                          onFocus={() => wallStore.setActive(p.id)}
                          onBlur={() => wallStore.setActive(null)}
                        >
                          {p.name}
                        </a>
                      ) : (
                        // No public destination: a label, not a link.
                        <button
                          type="button"
                          onMouseEnter={() => wallStore.setActive(p.id)}
                          onMouseLeave={() => wallStore.setActive(null)}
                          onFocus={() => wallStore.setActive(p.id)}
                          onBlur={() => wallStore.setActive(null)}
                        >
                          {p.name}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className={styles.art}>
          <StaticWall />
        </div>
      </div>

      <nav className={styles.screenNav} aria-label="Screens on the wall">
        <ul>
          {PRIMARY.map((s) => (
            <li key={s.id}>
              {s.project.href ? (
                <a
                  href={s.project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onFocus={() => wallStore.setActive(s.id)}
                  onBlur={() => wallStore.setActive(null)}
                >
                  {s.project.name}
                </a>
              ) : (
                <button
                  type="button"
                  onFocus={() => wallStore.setActive(s.id)}
                  onBlur={() => wallStore.setActive(null)}
                >
                  {s.project.name}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
