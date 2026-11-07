// Mutable bridge between the DOM (scroll trigger, captions, keyboard list) and
// the WebGL scene (lazy chunk). Plain numbers: values change every frame.
type Listener = () => void;

const listeners = new Set<Listener>();

export const wallStore = {
  /** 0..1 across the pinned tour. 0 is the hero. */
  progress: 0,
  /** Normalised pointer, -1..1. */
  pointerX: 0,
  pointerY: 0,
  /** Screen currently hovered or focused (project id). */
  active: null as string | null,
  /** Pixels from the stage top where the free scene region starts (narrow). */
  regionTop: 0,
  /** Right edge of the copy column in px (wide layouts); 0 when stacked. */
  copyRight: 0,
  /** Pixels from the stage left where the free scene region starts (wide). */
  regionLeft: 0,
  /** Replaced by the scene with r3f's invalidate while it is mounted. */
  invalidate: (): void => undefined,
  setActive(id: string | null) {
    if (wallStore.active === id) return;
    wallStore.active = id;
    listeners.forEach((l) => l());
    wallStore.invalidate();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
