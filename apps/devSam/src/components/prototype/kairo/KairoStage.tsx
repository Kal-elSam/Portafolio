import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Boundary, hasWebGL } from '../SceneLayer';
import {
  CAPTION,
  CHANNELS,
  claudeQuota,
  COPY,
  DENY,
  LABEL_KEYS,
  PHASE,
  REPO_HREF,
  ROLE_NOTE,
  ROLES,
  SAMPLE,
} from './data';
import StaticSystem from './StaticSystem';
import { kairoStore } from './store';

import type { LabelKey } from './data';

import styles from './kairo.module.css';

// Loaded only after the client confirmed it can run the scene, so the server
// render, no-JS visitors and every other page never wait on three.
const KairoScene = dynamic(() => import('./KairoScene'), { ssr: false });

type Rect = [number, number, number, number];
type Spot = [
  'above-end' | 'above-start' | 'below' | 'below-end',
  number,
  number
];

// Labels that move with the scene and must dodge everything else.
const FLOATING = new Set<LabelKey>(['deny', 't0', 't1', 't2']);

// Gap kept around the headline column, and the step between label heights.
const CLEAR = 24;
const LIFT = 34;

const hit = (a: Rect, b: Rect, pad = 0) =>
  a[0] < b[2] + pad &&
  a[2] > b[0] - pad &&
  a[1] < b[3] + pad &&
  a[3] > b[1] - pad;

const hitDisc = (r: Rect, cx: number, cy: number, radius: number) =>
  Math.hypot(
    Math.max(r[0], Math.min(cx, r[2])) - cx,
    Math.max(r[1], Math.min(cy, r[3])) - cy
  ) < radius;

const WIDE = '(min-width: 768px)';
const REDUCED = '(prefers-reduced-motion: reduce)';

// Mount the scene only once the stage is this close to the viewport, so a
// visitor who never scrolls this far never pays for three or the WebGL context.
const NEAR_MARGIN = '700px 0px';

// Gestures that count as the visitor's first move on the page.
const MOVE_EVENTS = ['scroll', 'wheel', 'touchmove', 'keydown'] as const;

type SceneLayerProps = {
  near: boolean;
  onReady: () => void;
  onFail: () => void;
  onLost: () => void;
  onStill: (still: boolean) => void;
};

function SceneLayer({
  near,
  onReady,
  onFail,
  onLost,
  onStill,
}: SceneLayerProps) {
  const [enabled, setEnabled] = useState(false);
  const [still, setStill] = useState(false);
  const [failed, setFailed] = useState(false);
  const [down, setDown] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const timer = useRef<number | null>(null);

  const fail = useCallback(() => {
    setFailed(true);
    onFail();
  }, [onFail]);

  // A lost context drops the scene for the static drawing, then a fresh
  // canvas replaces it once the browser can create a context again.
  const lose = useCallback(() => {
    onLost();
    setDown(true);
    let tries = 0;
    const retry = () => {
      if (hasWebGL()) {
        setDown(false);
        setEpoch((e) => e + 1);
      } else if (tries < 10) {
        tries += 1;
        timer.current = window.setTimeout(retry, 1000);
      }
    };
    timer.current = window.setTimeout(retry, 800);
  }, [onLost]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  useEffect(() => {
    if (!near) return undefined;
    const wide = window.matchMedia(WIDE);
    const reduced = window.matchMedia(REDUCED);
    let supported: boolean | null = null;
    const update = () => {
      if (wide.matches && supported === null) supported = hasWebGL();
      const next = wide.matches && supported === true;
      setEnabled(next);
      setStill(reduced.matches);
      onStill(reduced.matches);
      if (!next) onFail();
    };
    update();
    wide.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      wide.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
    // Callbacks are stable (useCallback in the stage).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near]);

  if (!enabled || failed || down) return null;
  return (
    <Boundary onError={fail}>
      <KairoScene
        key={`${still ? 'still' : 'live'}-${epoch}`}
        still={still}
        onReady={onReady}
        onFail={fail}
        onLost={lose}
      />
    </Boundary>
  );
}

type KairoStageProps = {
  /** The stage is the whole page (/prototype/kairo): it takes the h1 and has
   *  no home section to link to. On the home it is an h2 section. */
  standalone?: boolean;
};

export default function KairoStage({ standalone = false }: KairoStageProps) {
  const stageRef = useRef<HTMLElement>(null);
  const labelRefs = useRef<Partial<Record<LabelKey, HTMLDivElement | null>>>(
    {}
  );
  const labelsRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const taskNames = useRef<(HTMLSpanElement | null)[]>([]);
  const taskRoles = useRef<(HTMLSpanElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const [still, setStill] = useState(false);
  const [near, setNear] = useState(false);
  const [moved, setMoved] = useState(standalone);

  const handleReady = useCallback(() => setReady(true), []);
  const handleFail = useCallback(() => setReady(false), []);

  // The scene waits until the stage approaches the viewport. Without an
  // observer the scene starts straight away, as before.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: NEAR_MARGIN }
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // On the home the stage sits right under the hero, so it is "near" at load.
  // The scene still waits for the visitor's first move, so the first load
  // stays free of WebGL. It starts at once when the page loads already
  // scrolled (restored scroll, a #building hash) or when it cannot scroll at
  // all. The standalone page starts moved: the stage is its whole page.
  useEffect(() => {
    if (moved) return undefined;
    const root = document.documentElement;
    if (window.scrollY > 0 || root.scrollHeight <= window.innerHeight + 1) {
      setMoved(true);
      return undefined;
    }
    const go = () => setMoved(true);
    MOVE_EVENTS.forEach((name) =>
      window.addEventListener(name, go, { passive: true, once: true })
    );
    return () =>
      MOVE_EVENTS.forEach((name) => window.removeEventListener(name, go));
  }, [moved]);

  // Pointer parallax over the whole stage.
  useEffect(() => {
    if (!ready || still) return undefined;
    const onMove = (event: PointerEvent) => {
      kairoStore.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      kairoStore.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      kairoStore.pointerX = 0;
      kairoStore.pointerY = 0;
    };
  }, [ready, still]);

  // Sharp HTML labels follow their 3D anchors; state flags drive the copy.
  useEffect(() => {
    const stage = stageRef.current;
    if (!ready || !stage) return undefined;
    let raf = 0;
    let lastPct = -1;
    let lastRoute = '';
    let lastCap = '';
    const taskSig = ['', '', ''];
    const picks: Partial<Record<LabelKey, number>> = {};
    const placeLabels = () => {
      const world = labelsRef.current;
      const copy = stage.querySelector<HTMLElement>('[data-copy]');
      if (!world) return;
      const wr = world.getBoundingClientRect();
      const cr = copy ? copy.getBoundingClientRect() : null;
      const sw = world.clientWidth;
      const sh = world.clientHeight;
      // Read every size first, then write every transform.
      const info = LABEL_KEYS.map((key) => {
        const el = labelRefs.current[key];
        const inner = el?.firstElementChild as HTMLElement | null;
        return {
          key,
          el,
          inner,
          a: kairoStore.anchors[key],
          w: inner?.offsetWidth ?? 0,
          h: inner?.offsetHeight ?? 0,
        };
      });
      const taken: Rect[] = [];
      // The headline column is never covered.
      const column: Rect | null =
        cr && cr.width > 0
          ? [
              cr.left - wr.left - CLEAR,
              cr.top - wr.top - CLEAR,
              cr.right - wr.left + CLEAR,
              cr.bottom - wr.top + CLEAR,
            ]
          : null;
      const { core, slabs } = kairoStore;

      // Fixed labels: clamp inside the frame and remember where they sit.
      info.forEach((entry) => {
        const { key, el, inner, a, w, h } = entry;
        if (!el || !inner || !a.on || FLOATING.has(key)) return;
        const mode = inner.dataset.at;
        let lo = 14;
        let hi = sw - w - 20;
        if (mode === 'above-center') {
          lo = w / 2 + 14;
          hi = sw - w / 2 - 14;
        }
        const x = Math.max(lo, Math.min(a.x, hi));
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${a.y.toFixed(
          1
        )}px, 0)`;
        const op = a.a.toFixed(2);
        if (el.style.opacity !== op) el.style.opacity = op;
        if (a.a > 0.1) {
          const left = mode === 'above-center' ? x - w / 2 : x;
          const top = mode === 'below' ? a.y : a.y - h;
          taken.push([left, top, left + w, top + h]);
        }
      });

      // Floating labels (the denied launch and the three task labels) take the
      // first spot that clears every slab, the core, the headline column and
      // the other labels. They keep their spot while it stays free, and fade
      // out rather than overlap when none is.
      info.forEach((entry) => {
        const { key, el, inner, a, w, h } = entry;
        if (!el || !inner || !a.on || !FLOATING.has(key)) return;
        const spots: Spot[] =
          key === 'deny'
            ? [0, 1, 2, 3].flatMap((n): Spot[] => [
                ['below', 0, n * LIFT],
                ['below-end', -w, n * LIFT],
              ])
            : [0, 1, 2, 3].flatMap((n): Spot[] => [
                ['above-end', -w, -h - n * LIFT],
                ['above-start', 0, -h - n * LIFT],
              ]);
        const free = (i: number) => {
          const [, dx, dy] = spots[i];
          const left = Math.max(10, Math.min(a.x + dx, sw - w - 10));
          const top = a.y + dy;
          const r: Rect = [left, top, left + w, top + h];
          if (top < 10 || r[3] > sh - 10) return null;
          if (column && hit(r, column)) return null;
          if (taken.some((t) => hit(r, t, 6))) return null;
          for (let n = 0; n < kairoStore.slabCount; n += 1) {
            const sx = slabs[n * 4 + 2] + 6;
            const sy = slabs[n * 4 + 3] + 6;
            const cx = slabs[n * 4];
            const cy = slabs[n * 4 + 1];
            if (hit(r, [cx - sx, cy - sy, cx + sx, cy + sy])) return null;
          }
          if (hitDisc(r, core.x, core.y, core.r + 8)) return null;
          return r;
        };
        const kept = picks[key] ?? -1;
        let pick = kept >= 0 && free(kept) ? kept : -1;
        for (let i = 0; pick < 0 && i < spots.length; i += 1) {
          if (free(i)) pick = i;
        }
        picks[key] = pick;
        if (pick < 0) {
          if (el.style.opacity !== '0') el.style.opacity = '0';
          return;
        }
        const r = free(pick) as Rect;
        const mode = spots[pick][0];
        if (inner.dataset.at !== mode) inner.dataset.at = mode;
        const ex = mode.endsWith('end') ? r[2] : r[0];
        const ey = mode.startsWith('above') ? r[3] : r[1];
        el.style.transform = `translate3d(${ex.toFixed(1)}px, ${ey.toFixed(
          1
        )}px, 0)`;
        const op = a.a.toFixed(2);
        if (el.style.opacity !== op) el.style.opacity = op;
        if (a.a > 0.1) taken.push(r);
      });
    };
    const tick = () => {
      raf = window.requestAnimationFrame(tick);
      placeLabels();
      [0, 1, 2].forEach((s) => {
        const t = kairoStore.tasks[s];
        const sig = `${t.name}|${t.role}`;
        if (sig === taskSig[s]) return;
        taskSig[s] = sig;
        const nameEl = taskNames.current[s];
        const roleEl = taskRoles.current[s];
        if (nameEl) nameEl.textContent = t.name;
        if (roleEl) roleEl.textContent = ROLES[t.role];
      });
      const p = kairoStore.shown;
      // One value drives the visual and every state word: the displayed Claude
      // 5h percentage. "working" needs quota above zero; at zero the work is
      // Codex's.
      const pct = Math.round(claudeQuota(p) * 100);
      const route = pct > 0 ? 'a' : 'b';
      if (route !== lastRoute) {
        lastRoute = route;
        stage.dataset.route = route;
      }
      const cap = p < PHASE.drainStart * 0.9 ? 'sample' : 'illustrative';
      if (cap !== lastCap) {
        lastCap = cap;
        stage.dataset.cap = cap;
      }
      if (pct !== lastPct && pctRef.current) {
        lastPct = pct;
        pctRef.current.textContent = String(pct);
      }
    };
    tick();
    return () => window.cancelAnimationFrame(raf);
  }, [ready]);

  const setLabel = (key: LabelKey) => (node: HTMLDivElement | null) => {
    labelRefs.current[key] = node;
  };

  return (
    <section
      ref={stageRef}
      className={styles.stage}
      data-scene={ready ? 'on' : 'off'}
      data-still={still ? '1' : '0'}
      data-route="b"
      data-cap="illustrative"
      aria-labelledby="building-title"
    >
      <div className={styles.world}>
        <StaticSystem hidden={ready} />
        <SceneLayer
          near={near && moved}
          onReady={handleReady}
          onFail={handleFail}
          onLost={handleFail}
          onStill={setStill}
        />
        <div className={styles.scrim} aria-hidden="true" />
        <div ref={labelsRef} className={styles.labels} aria-hidden={!ready}>
          {[0, 1, 2].map((n) => (
            <div
              key={n}
              ref={setLabel(`t${n}` as LabelKey)}
              className={styles.label}
            >
              <div className={styles.at} data-at="above-end">
                <span className={styles.task}>
                  <span
                    ref={(node) => {
                      taskNames.current[n] = node;
                    }}
                    className={styles.taskName}
                  />
                  <span
                    ref={(node) => {
                      taskRoles.current[n] = node;
                    }}
                    className={styles.taskRole}
                  />
                </span>
              </div>
            </div>
          ))}
          <div ref={setLabel('kairo')} className={styles.label}>
            <div className={styles.at} data-at="above-center">
              <span className={styles.kairo}>Kairo</span>
              <span className={styles.mono}>
                <span data-s="a" data-accent="1">
                  {ROLE_NOTE.approved}
                </span>
                <span data-s="b" data-accent="1">
                  {ROLE_NOTE.approved}
                </span>
              </span>
              <span className={styles.mono}>
                <span data-s="b">{ROLE_NOTE.rerouted}</span>
              </span>
            </div>
          </div>
          {ROLES.map((role, i) => (
            <div
              key={role}
              ref={setLabel(`role${i}` as LabelKey)}
              className={styles.label}
            >
              <div className={styles.at} data-at="above-center">
                <span className={styles.role}>{role}</span>
              </div>
            </div>
          ))}
          <div ref={setLabel('deny')} className={styles.label}>
            <div className={styles.at} data-at="below">
              <span className={styles.denyName}>{DENY.title}</span>
              <span className={styles.mono}>{DENY.detail}</span>
            </div>
          </div>
          <div ref={setLabel('claude')} className={styles.label}>
            <div className={styles.at} data-at="above" data-id="claude">
              <span className={styles.name}>{CHANNELS.claude.provider}</span>
              <span className={styles.mono}>
                5h <span ref={pctRef}>0</span>%
              </span>
              <span className={styles.detail}>
                {CHANNELS.claude.model}
                <br />
                week {SAMPLE.claude.week}%
              </span>
              <span className={styles.badge}>
                <span data-s="a" data-accent="1">
                  working
                </span>
                <span data-s="b">quota out</span>
              </span>
            </div>
          </div>
          <div ref={setLabel('codex')} className={styles.label}>
            <div className={styles.at} data-at="below" data-id="codex">
              <span className={styles.name}>{CHANNELS.codex.provider}</span>
              <span className={styles.mono}>5h {SAMPLE.codex.h5}%</span>
              <span className={styles.detail}>
                {CHANNELS.codex.model}
                <br />
                week {SAMPLE.codex.week}%
                <br />
                projected idle ~{SAMPLE.codexIdleHours}h
              </span>
              <span className={styles.badge}>
                <span data-s="a" data-accent="1">
                  working
                </span>
                <span data-s="b" data-accent="1">
                  takes over
                </span>
              </span>
            </div>
          </div>
        </div>
        <p className={styles.caption}>
          <span data-c="sample">{CAPTION.sample}</span>
          <span data-c="illustrative">{CAPTION.illustrative}</span>
        </p>
      </div>

      <div className={styles.copy} data-copy>
        <p className={styles.eyebrow}>{COPY.building}</p>
        {standalone ? (
          <h1 id="building-title" className={styles.kairoName}>
            Kairo
          </h1>
        ) : (
          <h2 id="building-title" className={styles.kairoName}>
            Kairo
          </h2>
        )}
        <p className={styles.slogan}>{COPY.slogan}</p>
        <p className={styles.line}>{COPY.line}</p>
        <div className={styles.actions}>
          {!standalone && (
            <a className={styles.cta} href="#kairo">
              How it works
            </a>
          )}
          <a
            className={styles.repo}
            href={REPO_HREF}
            target="_blank"
            rel="noopener noreferrer"
          >
            Kairo on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
