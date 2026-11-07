import { LABEL_KEYS } from './data';

import type { LabelKey } from './data';

type Anchor = { x: number; y: number; on: boolean; a: number };

const anchors = Object.fromEntries(
  LABEL_KEYS.map((key) => [key, { x: 0, y: 0, on: false, a: 1 }])
) as Record<LabelKey, Anchor>;

// Mutable bridge between the DOM (pointer, labels) and the
// WebGL scene (lazy chunk). Plain numbers: the values change every frame.
export const kairoStore = {
  /** Event position (0..0.58) actually shown, written by the scene each frame. */
  shown: 0,
  /** Normalised pointer, -1..1. */
  pointerX: 0,
  pointerY: 0,
  /** Projected label anchors in canvas CSS pixels, written by the scene. */
  anchors,
  /**
   * Projected work-item slabs in canvas pixels, four numbers each (centre x,
   * centre y, half width, half height), so the sharp labels can stay clear.
   */
  slabs: new Float32Array(64 * 4),
  slabCount: 0,
  /** Projected core disc: centre x, centre y, radius, in canvas pixels. */
  core: { x: 0, y: 0, r: 0 },
  /** Work item text for the three moving task labels: name and role index. */
  tasks: [
    { name: '', role: 0 },
    { name: '', role: 0 },
    { name: '', role: 0 },
  ],
};
