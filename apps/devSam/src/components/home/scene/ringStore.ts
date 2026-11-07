// Motion state of the project ring. Input (drag, wheel scroll, keys, buttons)
// writes it, the scene steps it every frame. Plain mutable state, not React
// state, so a drag never waits on a render.
//
// `pos` is a float panel index that is never wrapped: the panel at the front is
// round(pos) modulo the count, and the ring turns the short way round.

const now = () => performance.now();

const wrap = (value: number, n: number) => ((value % n) + n) % n;

export const ringStore = {
  count: 0,
  pos: 0,
  /** Panels per second, after a drag is released. */
  vel: 0,
  /** Where the ring is heading (key, button, filter, focus), or null. */
  target: null as number | null,
  dragging: false,
  lastInput: 0,
  /** Filtered area id, or null for all. */
  area: null as string | null,
  active: 0,
  /** Pointer over the stage, -1..1: a little parallax only. */
  pointerX: 0,
  pointerY: 0,
  listeners: new Set<(index: number) => void>(),
  /** Set by the scene: asks for one more frame while the loop is on demand. */
  wake: null as (() => void) | null,

  reset(count: number) {
    this.count = count;
    this.pos = 0;
    this.vel = 0;
    this.target = null;
    this.dragging = false;
    this.active = 0;
    this.lastInput = now();
  },

  /** Rotate to a panel by the shortest way. */
  goto(index: number) {
    const n = this.count;
    if (!n) return;
    const from = this.target ?? this.pos;
    let delta = wrap(index, n) - wrap(from, n);
    if (delta > n / 2) delta -= n;
    if (delta < -n / 2) delta += n;
    this.target = from + delta;
    this.vel = 0;
    this.lastInput = now();
    this.wake?.();
  },

  /** One panel forward or back from where the ring is heading. */
  nudge(direction: 1 | -1) {
    const base = this.target ?? Math.round(this.pos);
    this.target = base + direction;
    this.vel = 0;
    this.lastInput = now();
    this.wake?.();
  },

  dragStart() {
    this.dragging = true;
    this.target = null;
    this.vel = 0;
    this.lastInput = now();
    this.wake?.();
  },

  /** `delta` in panels, `ms` since the previous move. */
  dragMove(delta: number, ms: number) {
    this.pos += delta;
    const instant = ms > 0 ? (delta / ms) * 1000 : 0;
    // Smoothed, so one noisy event does not decide the throw.
    this.vel = this.vel * 0.6 + instant * 0.4;
    this.lastInput = now();
    this.wake?.();
  },

  dragEnd() {
    this.dragging = false;
    this.vel = Math.max(-14, Math.min(14, this.vel));
    if (now() - this.lastInput > 90) this.vel = 0;
    this.lastInput = now();
    this.wake?.();
  },

  /** Scrolling the page turns the ring; it never traps the page. */
  scrollBy(delta: number) {
    this.target = null;
    this.vel = 0;
    this.pos += delta;
    this.lastInput = now();
    this.wake?.();
  },

  /** Advance by `dt` seconds: inertia, then settle on the nearest panel. */
  step(dt: number) {
    if (!this.count) return;
    if (!this.dragging) {
      if (this.target !== null) {
        this.pos += (this.target - this.pos) * (1 - Math.exp(-dt * 8.5));
        if (Math.abs(this.target - this.pos) < 0.0015) {
          this.pos = this.target;
          this.target = null;
        }
      } else if (Math.abs(this.vel) > 0.35) {
        this.pos += this.vel * dt;
        this.vel *= Math.exp(-dt * 2.4);
        this.lastInput = now();
      } else if (now() - this.lastInput > 130) {
        const settle = Math.round(this.pos);
        if (Math.abs(settle - this.pos) > 0.0015) {
          this.vel = 0;
          this.target = settle;
        }
      }
    }
    const idx = wrap(Math.round(this.pos), this.count);
    if (idx !== this.active) {
      this.active = idx;
      this.listeners.forEach((fn) => fn(idx));
    }
  },
};
