// World layout of the wall: panels sit on a concave arc (radius R, centre
// (0, 0, R)) so the viewer, standing near the centre, faces every panel.
// Depth comes from a per-panel offset along the normal, not from tilt.

import { AREAS } from '../map/data';
import { SCREENS } from './screens';

import type { Screen } from './screens';

export const R = 42;

export type Pose = {
  id: string;
  x: number;
  y: number;
  z: number;
  /** Rotation about Y. Zero faces +z; the arc turns it toward the centre. */
  yaw: number;
  /** Normal pointing at the viewer. */
  nx: number;
  nz: number;
  w: number;
  h: number;
  /** Offset toward the viewer, in world units: the depth layer of the panel. */
  dz: number;
  /** Forward travel when hovered, enough to clear every layer in front. */
  lift: number;
};

export const arcPoint = (u: number) => {
  const theta = u / R;
  return {
    x: R * Math.sin(theta),
    z: R - R * Math.cos(theta),
    nx: -Math.sin(theta),
    nz: Math.cos(theta),
    yaw: -theta,
  };
};

/** Frontmost layer a hovered panel travels to. */
const FRONT = 2.6;

export const poseOf = (screen: Screen): Pose => {
  const { u, y, dz, width } = screen.place;
  const p = arcPoint(u);
  return {
    id: screen.id,
    x: p.x + p.nx * dz,
    y,
    z: p.z + p.nz * dz,
    yaw: p.yaw,
    nx: p.nx,
    nz: p.nz,
    w: width,
    h: width / screen.aspect,
    dz,
    lift: Math.min(2.0, Math.max(0.6, FRONT - dz)),
  };
};

export const POSES: Record<string, Pose> = Object.fromEntries(
  SCREENS.map((s) => [s.id, poseOf(s)])
);

/* ---------- camera keys ---------- */

export type Key = {
  /** -1 for the hero, otherwise the index in AREAS. */
  group: number;
  /** Arc position the camera looks at. */
  u: number;
  ty: number;
  /** Orbit angle off the wall normal; positive puts the viewer to the right. */
  alpha: number;
  /** Visible span the key must fit, in world units. */
  spanW: number;
  spanH: number;
  lift: number;
  /** Every screen of the set piece, protagonist first. */
  focus: string[];
};

const AREA_INDEX = Object.fromEntries(AREAS.map((a, i) => [a.id, i]));

type Bleed = { right?: number; top?: number; bottom?: number };

/**
 * A stop framed on a whole set piece: the bounding box of its screens plus a
 * small margin, so the protagonist and its neighbours are all on screen. The
 * left edge never bleeds (a screen behind the copy column fades out); the other
 * edges may, which gives the hero its window feel.
 */
const frame = (
  ids: string[],
  alpha: number,
  margin = 0.3,
  bleed: Bleed = {}
): Key => {
  const list = ids.map((id) => {
    const screen = SCREENS.find((s) => s.id === id);
    if (!screen) throw new Error(`Wall: no screen "${id}"`);
    return screen;
  });
  const edges = list.map((s) => ({
    l: s.place.u - s.place.width / 2,
    r: s.place.u + s.place.width / 2,
    b: s.place.y - s.place.width / s.aspect / 2,
    t: s.place.y + s.place.width / s.aspect / 2,
  }));
  const l = Math.min(...edges.map((e) => e.l)) - margin;
  const r = Math.max(...edges.map((e) => e.r)) + margin - (bleed.right ?? 0);
  const b = Math.min(...edges.map((e) => e.b)) - margin + (bleed.bottom ?? 0);
  const t = Math.max(...edges.map((e) => e.t)) + margin - (bleed.top ?? 0);
  return {
    group: AREA_INDEX[list[0].area],
    u: (l + r) / 2,
    ty: (b + t) / 2,
    alpha,
    spanW: r - l,
    spanH: t - b,
    lift: 0.3,
    focus: ids,
  };
};

/** Tour stops crop a little off the right, top and bottom edges: tight. */
const TIGHT: Bleed = { right: 0.25, top: 0.15, bottom: 0.15 };

/** Set pieces in tour order; the first id is the protagonist. */
export const SETS: string[][] = [
  [
    'maximus',
    'crm-comercial',
    'titan',
    'crm-comercial--cartera',
    'crm-mobile',
  ],
  ['titan--tickets', 'prometeo', 'seguros-kc', 'alianza-red-magisterial'],
  [
    'nexus-riesgos-amparados',
    'nexus-riesgos-amparados--landing',
    'portal-bi',
  ],
  ['ari-maya-ai-business-platform', 'kairo-runtime', 'atlas'],
  [
    'eos-mobile',
    'red-medica',
    'eos-mobile--login',
    'eos-mobile--home',
  ],
  ['segunnet', 'volaris-analytics', 'admin-vacunas', 'vacunas'],
  ['dashboard-next14', 'github-search', 'acolyte-health'],
];

/**
 * One flight along the wall: the hero, then one set piece per stop. The hero
 * is a window onto the first set piece that bleeds off the top and right.
 */
export const KEYS: Key[] = [
  { ...frame(SETS[0], 0.24, 0.25, { right: 0.45, top: 0.35 }), group: -1 },
  frame(SETS[1], 0.2, 0.2, TIGHT),
  frame(SETS[2], 0.14, 0.2, TIGHT),
  frame(SETS[3], 0.2, 0.2, TIGHT),
  frame(SETS[4], 0.12, 0.2, TIGHT),
  frame(SETS[5], 0.18, 0.2, TIGHT),
  frame(SETS[6], 0.1, 0.2, TIGHT),
];

/** Caption index for a tour position: 0 is the hero, then one per area. */
export const stopAt = (progress: number) =>
  KEYS[Math.round(progress * (KEYS.length - 1))].group + 1;

/** Progress at which the camera first arrives at a stop (0 hero, 1.. areas). */
export const progressOfStop = (stop: number) => {
  const k = KEYS.findIndex((key) => key.group === stop - 1);
  return Math.max(0, k) / (KEYS.length - 1);
};

const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * How much the screen belongs to the set piece the camera is on: `set` is 1
 * for every screen of it and `lead` is 1 for the protagonist. Both blend
 * between the two keys the camera sits between, with the camera's easing.
 */
export const roleWeight = (f: number, id: string) => {
  const i = Math.min(KEYS.length - 2, Math.max(0, Math.floor(f)));
  const t = ease(Math.min(1, Math.max(0, f - i)));
  const set = (key: Key) => (key.focus.includes(id) ? 1 : 0);
  const lead = (key: Key) => (key.focus[0] === id ? 1 : 0);
  return {
    set: set(KEYS[i]) * (1 - t) + set(KEYS[i + 1]) * t,
    lead: lead(KEYS[i]) * (1 - t) + lead(KEYS[i + 1]) * t,
  };
};
