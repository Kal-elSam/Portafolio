// Mutable bridge between the DOM (scroll trigger, pointer) and the WebGL scene
// (lazy chunk). Plain numbers: the values change every frame.
export const layersStore = {
  /** 0..1 across the pinned scroll. 0 is the open stack, 1 is the exit. */
  progress: 0,
  /** Normalised pointer, -1..1. */
  pointerX: 0,
  pointerY: 0,
};

/** Scroll phases, as fractions of the pinned distance. */
export const PHASE = {
  /** Layers stay open while the viewer reads the first screen. */
  assembleStart: 0.07,
  /** Fully assembled: a clear, readable view. */
  assembleEnd: 0.76,
  /** The short exit begins. */
  exitStart: 0.9,
} as const;
