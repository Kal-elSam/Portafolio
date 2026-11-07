// Mutable bridge between the scroll triggers (static bundle) and the WebGL
// scene (lazy chunk). Plain numbers, no React state: values change every frame.
export const stage = {
  /** 0..1 across the pinned separation. */
  progress: 0,
  /** 0..1 while the assembly glides from the hero into the pinned scene. */
  glide: 0,
  /** Normalised pointer, -1..1. */
  pointerX: 0,
  pointerY: 0,
  /** Replaced by the scene with r3f's invalidate while it is mounted. */
  invalidate: (): void => undefined,
};
