import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ScrollTrigger, useGSAP } from '../gsap';
import { Boundary, hasWebGL } from '../SceneLayer';
import {
  AREAS,
  CONTACT_HREF,
  COPY,
  CV_HREF,
  PROJECTS,
  projectsByArea,
} from './data';
import StaticLandscape from './StaticLandscape';
import { mapStore } from './store';

import styles from './map.module.css';

// Loaded only after the client confirmed it can run the scene, so the server
// render, no-JS visitors and every other page never wait on three.
const MapScene = dynamic(() => import('./MapScene'), { ssr: false });

const REDUCED = '(prefers-reduced-motion: reduce)';
const TOUR_STOPS = AREAS.length; // plus the hero at progress 0

function MapSceneLayer({
  ready,
  onReady,
  onFail,
  onLane,
}: {
  ready: boolean;
  onReady: () => void;
  onFail: () => void;
  onLane: (lane: number) => void;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    let supported: boolean | null = null;
    const update = () => {
      if (!mq.matches && supported === null) supported = hasWebGL();
      const next = !mq.matches && supported === true;
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
      <MapScene
        ready={ready}
        onReady={onReady}
        onFail={onFail}
        onLane={onLane}
      />
    </Boundary>
  );
}

export default function MapStage() {
  const stageRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [ready, setReady] = useState(false);
  const [stop, setStop] = useState(0);
  const lastStop = useRef(0);

  const handleReady = useCallback(() => setReady(true), []);
  const handleFail = useCallback(() => {
    mapStore.invalidate = () => undefined;
    setReady(false);
  }, []);

  useGSAP(
    () => {
      if (!ready || !stageRef.current) return undefined;
      const trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 3.4)}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          mapStore.progress = self.progress;
          mapStore.invalidate();
          const next = Math.round(self.progress * TOUR_STOPS);
          if (lastStop.current !== next) {
            lastStop.current = next;
            mapStore.setActive(null);
            setStop(next);
          }
        },
      });
      triggerRef.current = trigger;
      return () => {
        triggerRef.current = null;
        mapStore.progress = 0;
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
      mapStore.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      mapStore.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      mapStore.invalidate();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [ready]);

  // Narrow layouts stack the text above the scene; tell the camera where the
  // free region starts.
  useEffect(() => {
    if (!ready) return undefined;
    const measure = () => {
      const stage = stageRef.current;
      const el = stage?.querySelector('[data-block][data-active="true"]');
      if (!stage || !el) return;
      const box = stage.getBoundingClientRect();
      const copy = stage.querySelector('[data-copy]');
      mapStore.regionTop = el.getBoundingClientRect().bottom - box.top + 20;
      mapStore.regionLeft = copy
        ? copy.getBoundingClientRect().right - box.left + 16
        : 0;
      mapStore.invalidate();
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
      trigger.start + (index / TOUR_STOPS) * (trigger.end - trigger.start);
    window.scrollTo({ top, behavior: 'smooth' });
    return true;
  }, []);

  return (
    <section
      ref={stageRef}
      className={styles.stage}
      data-scene={ready ? 'on' : 'off'}
      data-stop={stop}
      aria-label="Work map"
    >
      <MapSceneLayer
        ready={ready}
        onReady={handleReady}
        onFail={handleFail}
        onLane={(lane) => goToStop(lane + 1)}
      />

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
              <p>Browse by area</p>
              <ul>
                {AREAS.map((area, i) => (
                  <li key={area.id}>
                    <a
                      href={`#lane-${area.id}`}
                      onClick={(event) => {
                        if (goToStop(i + 1)) event.preventDefault();
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
            <p className={styles.hint}>Scroll to move across the areas.</p>
          </div>

          {AREAS.map((area, i) => {
            const list = projectsByArea(area.id);
            return (
              <div
                key={area.id}
                className={styles.caption}
                data-block
                data-active={stop === i + 1}
              >
                <h2 className={styles.capTitle}>{area.name}</h2>
                <p className={`${styles.capMeta} ${styles.data}`}>
                  {list.length} projects
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
                          onMouseEnter={() => mapStore.setActive(p.id)}
                          onMouseLeave={() => mapStore.setActive(null)}
                          onFocus={() => mapStore.setActive(p.id)}
                          onBlur={() => mapStore.setActive(null)}
                        >
                          {p.name}
                        </a>
                      ) : (
                        // No public destination: a label, not a link.
                        <button
                          type="button"
                          onMouseEnter={() => mapStore.setActive(p.id)}
                          onMouseLeave={() => mapStore.setActive(null)}
                          onFocus={() => mapStore.setActive(p.id)}
                          onBlur={() => mapStore.setActive(null)}
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

        <figure className={styles.art}>
          <div className={styles.poster}>
            <StaticLandscape />
          </div>
          <figcaption className={styles.legend}>
            Each block is one of {PROJECTS.length} projects. Lane is the area of
            work. Depth is the year, older toward the back; projects with no
            stated year sit in the front band. <strong>Green</strong> marks
            featured work.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
