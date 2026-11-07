// The real structure of the Maximus dashboard, as exact pixel rectangles of
// the owner's screenshot (1830 x 1115, cropped to the window 1830 x 790: the
// rest of the screenshot is empty background). Prototype-only.
//
// Every rectangle was measured on the source pixels (card borders are 1px
// lines, so a rectangle includes its border). The base plate is the screenshot
// with every piece rectangle painted flat white, so stacking the pieces back at
// their own positions rebuilds the original. Nothing is redrawn or invented.
// This file is also read by the cutting script, so keep it free of imports.

/** World units are 100 source pixels. */
export const UNIT = 100;

export const WIN = { w: 1830, h: 790 } as const;

export const ASSET_DIR = '/assets/images/prototype-layers';

export type PieceDef = {
  id: string;
  /** Piece this one rests on (it casts its soft shadow there). */
  parent: string | null;
  /** x, y, width, height in source pixels. */
  rect: readonly [number, number, number, number];
  /** Height above its parent plane when fully open, in world units. */
  lift: number;
  /** Corner radius in source pixels. */
  radius: number;
  /** Sideways shift when open, in world units (x right, y up). */
  drift: readonly [number, number];
  /** True for the chart plots, which reveal with a mask wipe. */
  plot?: boolean;
  /** Lower loads first. */
  priority: number;
};

export const PIECES: readonly PieceDef[] = [
  {
    id: 'plate',
    parent: null,
    rect: [0, 0, 1830, 790],
    lift: 0,
    radius: 10,
    drift: [0, 0],
    priority: 0,
  },
  {
    id: 'brand',
    parent: 'plate',
    rect: [0, 5, 256, 66],
    lift: 1.7,
    radius: 5,
    drift: [-0.9, 0.35],
    priority: 5,
  },
  {
    id: 'nav',
    parent: 'plate',
    rect: [0, 71, 256, 719],
    lift: 0.9,
    radius: 5,
    drift: [-0.7, 0],
    priority: 5,
  },
  {
    id: 'topbar',
    parent: 'plate',
    rect: [256, 5, 1574, 64],
    lift: 1.4,
    radius: 5,
    drift: [0.25, 0.6],
    priority: 4,
  },
  {
    id: 'filterA',
    parent: 'plate',
    rect: [366, 93, 491, 71],
    lift: 2.1,
    radius: 6,
    drift: [-0.2, 0.45],
    priority: 5,
  },
  {
    id: 'filterB',
    parent: 'plate',
    rect: [879, 93, 457, 71],
    lift: 2.5,
    radius: 6,
    drift: [0.2, 0.55],
    priority: 5,
  },
  {
    id: 'profile',
    parent: 'plate',
    rect: [366, 178, 447, 256],
    lift: 1.7,
    radius: 6,
    drift: [-0.3, 0],
    priority: 1,
  },
  {
    id: 'datos',
    parent: 'plate',
    rect: [827, 178, 893, 256],
    lift: 1.5,
    radius: 6,
    drift: [0.25, 0],
    priority: 1,
  },
  {
    id: 'rank',
    parent: 'datos',
    rect: [926, 250, 106, 153],
    lift: 3.7,
    radius: 6,
    drift: [-0.15, 0.1],
    priority: 3,
  },
  {
    id: 'kpiPersist',
    parent: 'datos',
    rect: [1130, 250, 286, 77],
    lift: 3.2,
    radius: 5,
    drift: [0, 0.15],
    priority: 3,
  },
  {
    id: 'kpiPro',
    parent: 'datos',
    rect: [1424, 250, 288, 77],
    lift: 4,
    radius: 5,
    drift: [0.2, 0.2],
    priority: 3,
  },
  {
    id: 'kpiNew',
    parent: 'datos',
    rect: [1424, 327, 288, 73],
    lift: 3.4,
    radius: 5,
    drift: [0.2, -0.1],
    priority: 3,
  },
  {
    id: 'chartGoal',
    parent: 'plate',
    rect: [366, 448, 442, 282],
    lift: 1.9,
    radius: 6,
    drift: [-0.25, -0.2],
    priority: 2,
  },
  {
    id: 'chartMix',
    parent: 'plate',
    rect: [822, 448, 442, 282],
    lift: 2.2,
    radius: 6,
    drift: [0, -0.3],
    priority: 2,
  },
  {
    id: 'chartGrowth',
    parent: 'plate',
    rect: [1278, 448, 442, 282],
    lift: 1.8,
    radius: 6,
    drift: [0.25, -0.2],
    priority: 2,
  },
  {
    id: 'plotGoal',
    parent: 'chartGoal',
    rect: [370, 540, 434, 167],
    lift: 3.7,
    radius: 5,
    drift: [-0.1, -0.15],
    plot: true,
    priority: 2,
  },
  {
    id: 'plotMix',
    parent: 'chartMix',
    rect: [826, 540, 434, 167],
    lift: 4.3,
    radius: 5,
    drift: [0, -0.25],
    plot: true,
    priority: 2,
  },
  {
    id: 'plotGrowth',
    parent: 'chartGrowth',
    rect: [1282, 540, 434, 167],
    lift: 3.9,
    radius: 5,
    drift: [0.1, -0.15],
    plot: true,
    priority: 2,
  },
];

/** Highest lift: sets the depth of the open state. */
export const MAX_LIFT = Math.max(...PIECES.map((p) => p.lift));

/** Six other real screens that sit far behind, shaded into the dark world. */
export const BACKDROP = [
  { id: 'atlas', file: 'atlas' },
  { id: 'crm', file: 'crm' },
  { id: 'nexus', file: 'nexus' },
  { id: 'prometeo', file: 'prometeo' },
  { id: 'seguros', file: 'seguros' },
  { id: 'titan', file: 'titan' },
] as const;
