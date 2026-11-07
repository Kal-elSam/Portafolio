// Dimensions of the machined assembly, in scene units.
export const PLATE_W = 3.4;
export const PLATE_D = 1.8;
export const PLATE_T = 0.2;
export const TOP = PLATE_T / 2;

// Rest pitch leaves a visible gap: rods and collars show the joints from the first frame.
export const PITCH_CLOSED = 0.82;
export const PITCH_OPEN = 1.08;
export const PART_COUNT = 6;

export const closedY = (i: number) => ((PART_COUNT - 1) / 2 - i) * PITCH_CLOSED;
export const openY = (i: number) => ((PART_COUNT - 1) / 2 - i) * PITCH_OPEN;

/** Fastener and connecting-rod positions, in plate-local x/z. */
export const CORNERS: [number, number][] = [
  [-1.52, -0.72],
  [1.52, -0.72],
  [-1.52, 0.72],
  [1.52, 0.72],
];
export const ROD_SITES: [number, number][] = CORNERS;

export const ACCENT = '#c8ff2e';
export const BG = '#06080a';
