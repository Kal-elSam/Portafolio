import * as THREE from 'three';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const CREASE = 0.62; // rad: smooth a bevel's steps, keep real edges sharp

const finish = (geo: THREE.BufferGeometry) => {
  const smooth = toCreasedNormals(geo, CREASE);
  geo.dispose();
  return smooth;
};

type Pts = THREE.Vector2[];

export const polygon = (sides: number, radius: number, rotation = 0): Pts =>
  Array.from({ length: sides }, (_, k) => {
    const a = rotation + (k / sides) * Math.PI * 2;
    return new THREE.Vector2(Math.cos(a) * radius, Math.sin(a) * radius);
  });

/** Rounded rectangle outline (counter-clockwise). */
export const roundedRectPts = (
  w: number,
  d: number,
  r: number,
  seg = 6
): Pts => {
  const pts: Pts = [];
  const hw = w / 2;
  const hd = d / 2;
  const corners: [number, number, number][] = [
    [hw - r, hd - r, 0],
    [-hw + r, hd - r, Math.PI / 2],
    [-hw + r, -hd + r, Math.PI],
    [hw - r, -hd + r, Math.PI * 1.5],
  ];
  corners.forEach(([cx, cy, start]) => {
    for (let k = 0; k <= seg; k += 1) {
      const a = start + (k / seg) * (Math.PI / 2);
      pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
  });
  return pts;
};

const scalePts = (pts: Pts, f: number): Pts =>
  pts.map((p) => new THREE.Vector2(p.x * f, p.y * f));

// Inset a convex-ish outline toward its centroid by roughly `amount`.
function scaleShrink(pts: Pts, amount: number): Pts {
  let maxR = 0;
  pts.forEach((p) => {
    maxR = Math.max(maxR, p.length());
  });
  return scalePts(pts, Math.max((maxR - amount) / maxR, 0.2));
}

/** Bevelled plate: exact outer size, rounded corners. */
export function plate(
  w: number,
  d: number,
  h: number,
  radius: number,
  bevel: number
) {
  const inner = roundedRectPts(w - bevel * 2, d - bevel * 2, radius - bevel, 8);
  const shape = new THREE.Shape(inner);
  const depth = h - bevel * 2;
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 8,
    steps: 1,
  });
  geo.translate(0, 0, -depth / 2);
  geo.rotateX(-Math.PI / 2);
  return finish(geo);
}

/**
 * Extrudes an outline into a bevelled solid centred on the origin, lying in
 * the XZ plane with its height along +Y. `outline` is the final outer shape.
 */
export function solidFromOutline(
  outline: Pts,
  height: number,
  bevel: number,
  holeScale?: number
) {
  // Bevel grows the silhouette outward by `bevel`, so shrink the base shape.
  const base = scaleShrink(outline, bevel);
  const shape = new THREE.Shape(base);
  if (holeScale) {
    shape.holes.push(new THREE.Path(scalePts(outline, holeScale)));
  }
  const depth = Math.max(height - bevel * 2, 0.0001);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 12,
    steps: 1,
  });
  geo.translate(0, 0, -depth / 2);
  geo.rotateX(-Math.PI / 2);
  return finish(geo);
}

/** Small bevelled block with exact outer size. */
export const slab = (w: number, h: number, d: number, bevel = 0.012) =>
  plate(w, d, h, Math.max(bevel * 1.6, 0.02), bevel);

/** Chamfered cylinder (or prism when `segments` is small), centred on origin. */
export function lathe(
  radius: number,
  height: number,
  bevel: number,
  segments = 40
) {
  const b = Math.min(bevel, radius * 0.4, height * 0.4);
  const h = height / 2;
  const pts = [
    new THREE.Vector2(0.0001, -h),
    new THREE.Vector2(radius - b, -h),
    new THREE.Vector2(radius, -h + b),
    new THREE.Vector2(radius, h - b),
    new THREE.Vector2(radius - b, h),
    new THREE.Vector2(0.0001, h),
  ];
  return finish(new THREE.LatheGeometry(pts, segments));
}

export const capsulePts = (w: number, d: number): Pts => {
  const r = d / 2;
  const pts: Pts = [];
  for (let k = 0; k <= 12; k += 1) {
    const a = -Math.PI / 2 + (k / 12) * Math.PI;
    pts.push(new THREE.Vector2(w / 2 - r + Math.cos(a) * r, Math.sin(a) * r));
  }
  for (let k = 0; k <= 12; k += 1) {
    const a = Math.PI / 2 + (k / 12) * Math.PI;
    pts.push(new THREE.Vector2(-w / 2 + r + Math.cos(a) * r, Math.sin(a) * r));
  }
  return pts;
};

export type PortKind = 'circle' | 'square' | 'hexagon' | 'triangle' | 'obround';

export const PORT_KINDS: PortKind[] = [
  'circle',
  'square',
  'hexagon',
  'triangle',
  'obround',
];

export const portOutline = (kind: PortKind): Pts => {
  switch (kind) {
    case 'circle':
      return polygon(48, 0.27);
    case 'square':
      return roundedRectPts(0.5, 0.5, 0.05, 3);
    case 'hexagon':
      return polygon(6, 0.29, Math.PI / 6);
    case 'triangle':
      return polygon(3, 0.34, -Math.PI / 2);
    default:
      return capsulePts(0.6, 0.36);
  }
};

/** Socket frame with a hole, and a thin contact shape that sits inside it. */
export function portFrame(kind: PortKind, height: number) {
  return solidFromOutline(portOutline(kind), height, 0.014, 0.62);
}

export function portContact(kind: PortKind) {
  return solidFromOutline(scalePts(portOutline(kind), 0.4), 0.025, 0.006);
}
