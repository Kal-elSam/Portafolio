// Mutable bridge between the DOM (scroll triggers, captions, list) and the
// WebGL scene (lazy chunk). Plain numbers: values change every frame.
type Listener = () => void;

const listeners = new Set<Listener>();

export const mapStore = {
  /** 0..1 across the pinned tour. 0 is the hero overview. */
  progress: 0,
  /** Normalised pointer, -1..1. */
  pointerX: 0,
  pointerY: 0,
  /** Project currently hovered or focused. */
  active: null as string | null,
  /** Narrow layouts: pixels from the stage top where the scene region starts. */
  regionTop: 0,
  /** Wide layouts: pixels from the stage left where the scene region starts. */
  regionLeft: 0,
  /** Replaced by the scene with r3f's invalidate while it is mounted. */
  invalidate: (): void => undefined,
  setActive(id: string | null) {
    if (mapStore.active === id) return;
    mapStore.active = id;
    listeners.forEach((l) => l());
    mapStore.invalidate();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const STOPS = 5; // hero + four lanes
