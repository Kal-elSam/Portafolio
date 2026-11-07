import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import projectsData from '@/contents/projects/proyects';

import { ScrollTrigger, useGSAP } from '../gsap';
import { CONTACT_HREF, COPY, CV_HREF } from '../map/data';
import { Boundary, hasWebGL } from '../SceneLayer';
import { ASSET_DIR, WIN } from './pieces';
import { layersStore, PHASE } from './store';

import styles from './layers.module.css';

// Loaded only after the client confirmed it can run the scene, so the server
// render, no-JS visitors and every other page never wait on three.
const LayersScene = dynamic(() => import('./LayersScene'), { ssr: false });

// Wide screens with motion allowed. Narrow widths, reduced motion, no WebGL and
// a lost context all keep the plain assembled screenshot.
const QUERY = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';

const maximus = projectsData.find((p) => p.projectName === 'Maximus');
const SCREEN_ALT =
  'Maximus dashboard: sidebar, filters, agent profile, ranking, three KPI tiles and three goal charts.';

type SceneLayerProps = {
  ready: boolean;
  onReady: () => void;
  onFail: () => void;
};

function SceneLayer({ ready, onReady, onFail }: SceneLayerProps) {
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);

  const fail = useCallback(() => {
    setFailed(true);
    onFail();
  }, [onFail]);

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

  if (!enabled || failed) return null;
  return (
    <Boundary onError={fail}>
      <LayersScene ready={ready} onReady={onReady} onFail={fail} />
    </Boundary>
  );
}

export default function LayersStage() {
  const stageRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);
  const handleFail = useCallback(() => setReady(false), []);

  // One authored move: open layers to a fully assembled, readable view, then a
  // short exit. Scroll only writes progress; the scene damps it.
  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!ready || !stage) return undefined;
      let caption = false;
      let copyOff = false;
      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 3.4)}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          layersStore.progress = p;
          const copy = 1 - Math.min(1, Math.max(0, (p - 0.04) / 0.14));
          stage.style.setProperty('--copy', copy.toFixed(3));
          const off = copy < 0.02;
          if (off !== copyOff) {
            copyOff = off;
            stage.dataset.copy = off ? 'off' : 'on';
          }
          const showCaption =
            p >= PHASE.assembleEnd + 0.03 && p < PHASE.exitStart + 0.03;
          if (showCaption !== caption) {
            caption = showCaption;
            stage.dataset.caption = showCaption ? 'on' : 'off';
          }
        },
      });
      return () => {
        trigger.kill();
        layersStore.progress = 0;
        stage.style.removeProperty('--copy');
        stage.dataset.copy = 'on';
        stage.dataset.caption = 'off';
      };
    },
    { scope: stageRef, dependencies: [ready], revertOnUpdate: true }
  );

  // Damped parallax follows the pointer over the whole stage.
  useEffect(() => {
    if (!ready) return undefined;
    const onMove = (event: PointerEvent) => {
      layersStore.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      layersStore.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      layersStore.pointerX = 0;
      layersStore.pointerY = 0;
    };
  }, [ready]);

  return (
    <section
      ref={stageRef}
      className={styles.stage}
      data-scene={ready ? 'on' : 'off'}
      data-copy="on"
      data-caption="off"
      aria-label="Maximus dashboard, taken apart into its real layers"
    >
      <SceneLayer ready={ready} onReady={handleReady} onFail={handleFail} />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.name}>{COPY.name}</p>
          <p className={styles.title}>{COPY.title}</p>
          <h1 className={styles.headline}>{COPY.headline}</h1>
          <div className={styles.actions}>
            <a className={styles.cta} href={CV_HREF} download>
              Download CV
            </a>
            <a className={styles.ghost} href={CONTACT_HREF}>
              Contact
            </a>
          </div>
        </div>

        <figure className={styles.art}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ASSET_DIR}/maximus/window.webp`}
            width={WIN.w}
            height={WIN.h}
            alt={SCREEN_ALT}
            decoding="async"
          />
          <figcaption className={styles.figcap}>
            <strong>Maximus</strong>
            <span>{maximus?.role}</span>
          </figcaption>
        </figure>
      </div>

      <p className={styles.caption} aria-hidden="true">
        <strong>Maximus</strong>
        <span>{maximus?.role}</span>
      </p>
    </section>
  );
}
