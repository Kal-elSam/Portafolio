import { useEffect, useState } from 'react';

import type { Schematic, WorkShot } from './workData';

import styles from './workScreen.module.css';

/** The class that gives an element the chamfered edge. */
export const CUT = styles.cut;

type SizedStyle = React.CSSProperties & Record<`--${string}`, string | number>;

function Device({
  shot,
  alt,
  thumb,
}: {
  shot: WorkShot;
  alt: string;
  thumb: boolean;
}) {
  const nw = thumb ? shot.tw : shot.w;
  const nh = thumb ? shot.th : shot.h;
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={thumb ? shot.thumb : shot.src}
      width={nw}
      height={nh}
      alt={alt}
      draggable={false}
      decoding="async"
      loading="lazy"
    />
  );
  // The file's own size is the ceiling: the CSS never scales a screen past it.
  const style: SizedStyle = {
    '--ar': (nw / nh).toFixed(4),
    '--nw': nw,
    '--nh': nh,
  };

  if (shot.kind === 'browser') {
    return (
      <span className={`${styles.device} ${styles.browser}`} style={style}>
        <span className={styles.chrome} aria-hidden="true">
          <i />
          <i />
          <i />
          <b />
        </span>
        <span className={styles.viewport}>
          {img}
          <span className={styles.sweep} aria-hidden="true" />
        </span>
      </span>
    );
  }

  if (shot.kind === 'native') {
    return (
      <span className={`${styles.device} ${styles.native}`} style={style}>
        {img}
        <span className={styles.sweep} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className={`${styles.device} ${styles.phone}`} style={style}>
      <span className={styles.viewport}>
        {img}
        <span className={styles.sweep} aria-hidden="true" />
      </span>
    </span>
  );
}

/**
 * Real screens in the frame of their platform. The parent gives a box with a
 * definite size; the screens always sit whole inside it, at their real aspect,
 * centred, never stretched and never larger than the file. Phones sit side by
 * side (up to three). A thumbnail uses the small file.
 */
export function Screen({
  shots,
  alt,
  thumb = false,
}: {
  shots: WorkShot[];
  alt: string;
  thumb?: boolean;
}) {
  const style: SizedStyle = { '--n': shots.length };
  return (
    <span className={styles.fit} style={style}>
      {shots.map((shot, i) => (
        <Device
          key={shot.src}
          shot={shot}
          alt={shots.length > 1 ? `${alt} (${i + 1} of ${shots.length})` : alt}
          thumb={thumb}
        />
      ))}
    </span>
  );
}

// ---- schematics ----

const W = 360;
const H = 200;
const CHAR = 6.2;

// Splits a label over at most two lines at the space that balances them.
const wrap = (text: string, max: number): string[] => {
  const words = text.split(' ');
  if (text.length <= max || words.length === 1) return [text];
  let bestSplit = 1;
  let bestLongest = Infinity;
  for (let i = 1; i < words.length; i += 1) {
    const longest = Math.max(
      words.slice(0, i).join(' ').length,
      words.slice(i).join(' ').length
    );
    if (longest < bestLongest) {
      bestLongest = longest;
      bestSplit = i;
    }
  }
  return [
    words.slice(0, bestSplit).join(' '),
    words.slice(bestSplit).join(' '),
  ];
};

type Box = { x: number; y: number; w: number; h: number; label: string };

const boxFor = (label: string, cx: number, cy: number, maxW: number): Box => {
  const max = Math.max(4, Math.floor((maxW - 8) / CHAR));
  const lines = wrap(label, max);
  const longest = Math.max(...lines.map((l) => l.length));
  const w = Math.min(maxW, Math.max(40, longest * CHAR + 10));
  const h = lines.length * 13 + 10;
  return { x: cx - w / 2, y: cy - h / 2, w, h, label };
};

const LIT_CLASS = ['', styles.passed, styles.now];

function BoxText({
  box,
  core = false,
  lit = 0,
}: {
  box: Box;
  core?: boolean;
  /** 0 off, 1 passed, 2 the pulse is here. */
  lit?: 0 | 1 | 2;
}) {
  const lines = wrap(box.label, Math.max(4, Math.floor((box.w - 8) / CHAR)));
  return (
    <g>
      <rect
        className={[core ? styles.core : styles.box, LIT_CLASS[lit]].join(' ')}
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
      />
      {lines.map((line, i) => (
        <text
          key={line}
          className={styles.label}
          x={box.x + box.w / 2}
          y={box.y + 14 + i * 13}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Wire({ d, hot = 0 }: { d: string; hot?: 0 | 1 | 2 }) {
  return (
    <>
      <path className={styles.wire} d={d} />
      <path className={styles.pulse} d={d} />
      {hot > 0 ? (
        <path
          className={`${styles.hot} ${hot === 2 ? styles.hotNow : ''}`}
          d={d}
          pathLength={1}
        />
      ) : null}
    </>
  );
}

const describe = (def: Schematic) =>
  def.variant === 'hub'
    ? `${def.hub}: ${def.branches.join(', ')}`
    : def.stages.map((s) => s.join(' and ')).join(', then ') +
      (def.rail
        ? `; ${def.railLabel ?? 'with'} ${def.rail.join(' and ')}`
        : '');

function Flow({
  def,
  step,
}: {
  def: Extract<Schematic, { variant: 'flow' }>;
  /** The stage the trace has reached; -1 when no trace has run. */
  step: number;
}) {
  const n = def.stages.length;
  const stageLit = (i: number): 0 | 1 | 2 => {
    if (step < 0 || i > step) return 0;
    return i === step ? 2 : 1;
  };
  const hasRail = Boolean(def.rail && def.rail.length > 0);
  const top = 16;
  const bottom = hasRail ? 118 : H - 16;
  const gap = n > 4 ? 14 : 28;
  const colW = Math.min(104, (W - 28 - (n - 1) * gap) / n);
  const total = n * colW + (n - 1) * gap;
  const x0 = (W - total) / 2;

  const cols: Box[][] = def.stages.map((stage, i) => {
    const cx = x0 + i * (colW + gap) + colW / 2;
    const rowH = 30;
    const span = (stage.length - 1) * (rowH + 8);
    const mid = (top + bottom) / 2;
    return stage.map((label, j) =>
      boxFor(label, cx, mid - span / 2 + j * (rowH + 8), colW)
    );
  });

  const wires: { d: string; into: number }[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    cols[i].forEach((a) => {
      cols[i + 1].forEach((b) => {
        const ay = a.y + a.h / 2;
        const by = b.y + b.h / 2;
        const ax = a.x + a.w;
        const bx = b.x;
        const xm = (ax + bx) / 2;
        wires.push({ d: `M${ax},${ay} H${xm} V${by} H${bx}`, into: i + 1 });
      });
    });
  }

  const midCol = cols[Math.floor((n - 1) / 2)];
  const midBottom = Math.max(...midCol.map((b) => b.y + b.h));
  const midX = midCol[0].x + midCol[0].w / 2;
  const rail = def.rail ?? [];
  const railBoxes = rail.map((label, i) =>
    boxFor(label, W / 2 + (i - (rail.length - 1) / 2) * 96, 162, 90)
  );

  return (
    <>
      {wires.map((w) => (
        <Wire key={w.d} d={w.d} hot={stageLit(w.into)} />
      ))}
      {hasRail ? (
        <>
          <path
            className={`${styles.wire} ${styles.soft}`}
            d={`M${midX},${midBottom} V138`}
          />
          <path
            className={`${styles.wire} ${styles.soft}`}
            d={`M${railBoxes[0].x + railBoxes[0].w / 2},138 H${
              railBoxes[railBoxes.length - 1].x +
              railBoxes[railBoxes.length - 1].w / 2
            }`}
          />
          {railBoxes.map((b) => (
            <path
              key={b.label}
              className={`${styles.wire} ${styles.soft}`}
              d={`M${b.x + b.w / 2},138 V${b.y}`}
            />
          ))}
          {def.railLabel ? (
            <text className={styles.note} x={14} y={134}>
              {def.railLabel}
            </text>
          ) : null}
          {railBoxes.map((b) => (
            <BoxText
              key={b.label}
              box={b}
              lit={stageLit(Math.floor((n - 1) / 2))}
            />
          ))}
        </>
      ) : null}
      {cols.map((col, i) =>
        col.map((b) => (
          <BoxText
            key={b.label}
            box={b}
            core={i === Math.floor((n - 1) / 2) && n > 2}
            lit={stageLit(i)}
          />
        ))
      )}
    </>
  );
}

function Hub({ def }: { def: Extract<Schematic, { variant: 'hub' }> }) {
  const cx = W / 2;
  const cy = H / 2;
  const hub = boxFor(def.hub, cx, cy, 80);
  const count = def.branches.length;
  const rx = 128;
  const ry = 70;
  const branches = def.branches.map((label, i) => {
    const angle = ((i + 0.5) / count) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * rx;
    const y = cy + Math.sin(angle) * ry;
    return boxFor(label, x, y, 104);
  });
  return (
    <>
      {branches.map((b) => {
        const d = `M${cx},${cy} L${b.x + b.w / 2},${b.y + b.h / 2}`;
        return <Wire key={b.label} d={d} />;
      })}
      <BoxText box={hub} core />
      {branches.map((b) => (
        <BoxText key={b.label} box={b} />
      ))}
    </>
  );
}

const TRACE_MS = 1500;

/**
 * A diagram of what a project does. `mini` is the glyph form used in the map:
 * the same drawing without text. `run` starts a trace on a flow diagram each
 * time it changes: one pulse travels stage by stage in about 1.5 s,
 * highlighting each box as it passes. Under reduced motion every box is lit
 * at once and nothing travels.
 */
export function Diagram({
  def,
  mini = false,
  run = 0,
  onTraceEnd = undefined,
}: {
  def: Schematic;
  mini?: boolean;
  run?: number;
  onTraceEnd?: () => void;
}) {
  const [step, setStep] = useState(-1);
  const stages = def.variant === 'flow' ? def.stages.length : 0;

  useEffect(() => {
    if (!run || stages === 0) return undefined;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduce) {
      setStep(stages - 1);
      onTraceEnd?.();
      return undefined;
    }
    const timers: number[] = [];
    const each = TRACE_MS / stages;
    for (let i = 0; i < stages; i += 1) {
      timers.push(window.setTimeout(() => setStep(i), i * each));
    }
    timers.push(window.setTimeout(() => onTraceEnd?.(), TRACE_MS));
    setStep(-1);
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return (
    <svg
      className={`${styles.diagram} ${mini ? styles.mini : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      role={mini ? undefined : 'img'}
      aria-label={mini ? undefined : `Schematic. ${describe(def)}`}
      aria-hidden={mini ? true : undefined}
      style={
        {
          '--trace-ms': `${TRACE_MS / Math.max(1, stages)}ms`,
        } as React.CSSProperties
      }
    >
      {def.variant === 'flow' ? (
        <Flow def={def} step={step} />
      ) : (
        <Hub def={def} />
      )}
    </svg>
  );
}

/**
 * Pointer tilt for the elements marked `data-tilt` inside the ref'd root:
 * about 6 degrees, with parallax between the device (`data-float`) and the
 * base, and a glare (`data-glare`) that follows the pointer. One listener,
 * one rAF, `transform` only; every element resets when the pointer leaves.
 * Only on hover-capable fine pointers and with motion allowed.
 */
/* eslint-disable no-param-reassign */
export function useTilt(root: React.RefObject<HTMLElement>, key: string) {
  useEffect(() => {
    const node = root.current;
    if (!node) return undefined;
    const mq = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );
    if (!mq.matches) return undefined;
    let raf = 0;
    let current: HTMLElement | null = null;
    let nx = 0;
    let ny = 0;

    const apply = () => {
      raf = 0;
      if (!current) return;
      const deg = Number(current.dataset.tiltDeg ?? 6);
      current.style.transform = `rotateX(${(-ny * deg).toFixed(
        2
      )}deg) rotateY(${(nx * deg).toFixed(2)}deg)`;
      const float = current.querySelector<HTMLElement>('[data-float]');
      if (float) {
        float.style.transform = `translate3d(${(nx * 7).toFixed(1)}px, ${(
          ny * 5
        ).toFixed(1)}px, var(--float-z, 30px))`;
      }
      const glare = current.querySelector<HTMLElement>('[data-glare]');
      if (glare) {
        glare.style.transform = `translate3d(${(nx * 55).toFixed(1)}%, ${(
          ny * 55
        ).toFixed(1)}%, 0)`;
        glare.style.opacity = '1';
      }
    };
    const reset = (el: HTMLElement) => {
      el.style.transform = '';
      const float = el.querySelector<HTMLElement>('[data-float]');
      if (float) float.style.transform = '';
      const glare = el.querySelector<HTMLElement>('[data-glare]');
      if (glare) {
        glare.style.transform = '';
        glare.style.opacity = '';
      }
    };
    const onMove = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>(
        '[data-tilt]'
      );
      if (el !== current) {
        if (current) reset(current);
        current = el ?? null;
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      nx = ((event.clientX - r.left) / r.width) * 2 - 1;
      ny = ((event.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = window.requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (current) reset(current);
      current = null;
    };
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      if (raf) window.cancelAnimationFrame(raf);
      if (current) reset(current);
    };
  }, [root, key]);
}
/* eslint-enable no-param-reassign */
