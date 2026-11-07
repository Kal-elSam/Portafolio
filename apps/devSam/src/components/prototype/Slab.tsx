import type { PartKind } from './parts';
import type { CSSProperties } from 'react';

import styles from './prototype.module.css';

// Dimetric projection of a flat plate, drawn in plate coordinates (u, v).
const OX = 96;
const OY = 4;
const KX = 0.78;
const KY = 0.27;
const U = 220;
const V = 120;
const T = 12;

type Pt = [number, number, number?];

const proj = ([u, v, z = 0]: Pt): [number, number] => [
  OX + (u - v) * KX,
  OY + (u + v) * KY + z,
];

const pts = (list: Pt[]) =>
  list
    .map((q) =>
      proj(q)
        .map((n) => n.toFixed(1))
        .join(',')
    )
    .join(' ');

const rect = (u: number, v: number, w: number, d: number): Pt[] => [
  [u, v],
  [u + w, v],
  [u + w, v + d],
  [u, v + d],
];

function Poly({ a, className }: { a: Pt[]; className: string }) {
  return <polygon points={pts(a)} className={className} />;
}

function Seg({ a, b, className }: { a: Pt; b: Pt; className: string }) {
  const [x1, y1] = proj(a);
  const [x2, y2] = proj(b);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={className} />;
}

function Details({ kind }: { kind: PartKind }) {
  switch (kind) {
    case 'plugin':
      return (
        <>
          <Seg a={[14, 82]} b={[206, 82]} className={styles.dim} />
          {[30, 95, 160].map((u) => (
            <Poly key={u} a={rect(u, 22, 32, 26)} className={styles.fill} />
          ))}
        </>
      );
    case 'router':
      return (
        <>
          <Poly a={rect(14, 54, 12, 12)} className={styles.fill} />
          {[30, 60, 90].map((v) => (
            <g key={v}>
              <Seg a={[26, 60]} b={[U - 26, v]} className={styles.stroke} />
              <Poly a={rect(U - 26, v - 6, 12, 12)} className={styles.fill} />
            </g>
          ))}
        </>
      );
    case 'capability':
      return (
        <>
          <Seg a={[14, 102]} b={[206, 102]} className={styles.dim} />
          {[28, 52, 76, 44, 64].map((h, i) => (
            <Poly
              key={h}
              a={rect(24 + i * 38, 100 - h, 22, h)}
              className={styles.cell}
            />
          ))}
        </>
      );
    case 'quota':
      return (
        <>
          <Seg a={[20, 60]} b={[200, 60]} className={styles.dim} />
          {Array.from({ length: 10 }, (_, k) => (
            <Seg
              key={k}
              a={[20 + k * 20, 54]}
              b={[20 + k * 20, 66]}
              className={styles.dim}
            />
          ))}
          <Seg a={[20, 60]} b={[130, 60]} className={styles.strokeThick} />
          <Poly
            a={[
              [130, 50],
              [140, 60],
              [130, 70],
              [120, 60],
            ]}
            className={styles.fill}
          />
        </>
      );
    case 'fallback':
      return (
        <>
          <Seg a={[20, 36]} b={[100, 36]} className={styles.strokeThick} />
          <Seg a={[100, 36]} b={[200, 36]} className={styles.dimDash} />
          <Seg a={[100, 36]} b={[100, 84]} className={styles.stroke} />
          <Seg a={[100, 84]} b={[200, 84]} className={styles.stroke} />
          <Seg a={[200, 84]} b={[200, 36]} className={styles.stroke} />
          <Poly a={rect(194, 30, 12, 12)} className={styles.fill} />
        </>
      );
    default:
      return (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <Poly
              key={i}
              a={rect(14 + i * 41, 30, 33, 60)}
              className={styles.cell}
            />
          ))}
        </>
      );
  }
}

type SlabProps = {
  kind: PartKind;
  className?: string;
  tone?: 'primary' | 'secondary';
};

export default function Slab({
  kind,
  className = '',
  tone = 'primary',
}: SlabProps) {
  const top: Pt[] = [
    [0, 0],
    [U, 0],
    [U, V],
    [0, V],
  ];
  const style = {
    '--tone': tone === 'primary' ? 'var(--accent)' : 'var(--accent-2)',
  } as CSSProperties;

  return (
    <svg
      viewBox="0 0 270 110"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <Poly
        a={[
          [0, V, 0],
          [U, V, 0],
          [U, V, T],
          [0, V, T],
        ]}
        className={styles.faceSideA}
      />
      <Poly
        a={[
          [U, 0, 0],
          [U, V, 0],
          [U, V, T],
          [U, 0, T],
        ]}
        className={styles.faceSideB}
      />
      <Poly a={top} className={styles.faceTop} />
      <g data-lit="" className={styles.lit}>
        <Poly a={top} className={styles.glowWide} />
        <Poly a={top} className={styles.glowTight} />
        <Poly a={top} className={styles.edge} />
        <Seg a={[0, V, T]} b={[U, V, T]} className={styles.edgeFront} />
        <Seg a={[U, V, T]} b={[U, 0, T]} className={styles.edgeFront} />
        <Details kind={kind} />
      </g>
    </svg>
  );
}
