/* eslint-disable no-bitwise, no-param-reassign -- hot pixel and simulation loops mutate typed arrays and state in place, and the packed colour math needs integer bit ops */
// The game object: owns the world, renderer, input and the loop. It runs a
// fixed 60 Hz timestep, draws once per animation frame, and stops itself
// whenever the game loses attention (Esc, blur, hidden tab, section offscreen).

import { Sfx } from './audio';
import { LEVEL_COUNT } from './maps';
import { Renderer } from './render';
import { createWorld, Input, STEP, update, World } from './world';

export type Status = 'ready' | 'playing' | 'paused' | 'won' | 'lost';
export type PauseReason = 'esc' | 'blur' | 'hidden' | 'offscreen';

export interface Hud {
  status: Status;
  pauseReason: PauseReason | null;
  hp: number;
  ammo: number;
  fixed: number;
  levelFixed: number;
  levelTotal: number;
  level: number;
  levelName: string;
  levelCount: number;
  time: number;
  cleared: boolean;
  minimap: boolean;
  sound: boolean;
  lowAmmo: boolean;
}

export interface EngineOptions {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  reduced: boolean;
  coarse: boolean;
  onHud: (hud: Hud) => void;
  onQuit: () => void;
}

const MOUSE_SENS = 0.0024;
const GAME_KEYS = new Set([
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyQ',
  'KeyE',
  'KeyM',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Space',
]);

export class Game {
  status: Status = 'ready';

  world: World = createWorld();

  private opts: EngineOptions;

  private ctx: CanvasRenderingContext2D;

  private renderer: Renderer;

  private sfx = new Sfx();

  private keys = new Set<string>();

  private stick = { x: 0, y: 0 };

  private fireHeld = false;

  private firePulse = false;

  private mouseDx = 0;

  private minimap = false;

  private pauseReason: PauseReason | null = null;

  private raf = 0;

  private last = 0;

  private acc = 0;

  private clock = 0;

  private hudAt = 0;

  private visible = true;

  private observers: (() => void)[] = [];

  /** Moving average of the work done per drawn frame, in milliseconds. */
  frameMs = 0;

  constructor(opts: EngineOptions) {
    this.opts = opts;
    this.ctx = opts.canvas.getContext('2d', {
      alpha: false,
    }) as CanvasRenderingContext2D;
    const { w, h } = this.resolution();
    opts.canvas.width = w;
    opts.canvas.height = h;
    this.renderer = new Renderer(w, h);
    this.bind();
    this.draw();
    this.emit(true);
  }

  // ---------- lifecycle ----------

  start(): void {
    if (this.status === 'playing') return;
    if (this.status === 'won' || this.status === 'lost') this.reset();
    this.status = 'playing';
    this.pauseReason = null;
    this.beginLoop();
    this.grab();
    this.emit(true);
  }

  resume(): void {
    this.start();
  }

  restart(): void {
    this.reset();
    this.start();
  }

  pause(reason: PauseReason): void {
    if (this.status !== 'playing') return;
    this.status = 'paused';
    this.pauseReason = reason;
    this.releaseInput();
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (document.pointerLockElement === this.opts.canvas)
      document.exitPointerLock();
    this.draw();
    this.emit(true);
  }

  destroy(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.observers.forEach((off) => off());
    this.observers = [];
    if (document.pointerLockElement === this.opts.canvas)
      document.exitPointerLock();
    this.sfx.close();
    this.status = 'ready';
  }

  setSound(on: boolean): void {
    this.sfx.setEnabled(on);
    this.emit(true);
  }

  toggleMinimap(): void {
    this.minimap = !this.minimap;
    this.draw();
    this.emit(true);
  }

  setStick(x: number, y: number): void {
    this.stick.x = x;
    this.stick.y = y;
  }

  setFire(held: boolean): void {
    if (held && !this.fireHeld) this.firePulse = true;
    this.fireHeld = held;
  }

  private reset(): void {
    this.world = createWorld();
    this.acc = 0;
    this.clock = 0;
    this.releaseInput();
  }

  private releaseInput(): void {
    this.keys.clear();
    this.stick.x = 0;
    this.stick.y = 0;
    this.fireHeld = false;
    this.firePulse = false;
    this.mouseDx = 0;
  }

  private grab(): void {
    this.opts.container.focus({ preventScroll: true });
    if (!this.opts.coarse) this.lock();
  }

  private lock(): void {
    const { canvas } = this.opts;
    if (document.pointerLockElement === canvas) return;
    try {
      const result = canvas.requestPointerLock() as unknown as
        | Promise<void>
        | undefined;
      if (result && typeof result.catch === 'function')
        result.catch(() => undefined);
    } catch {
      // Pointer lock is optional; the keyboard still works.
    }
  }

  private resolution(): { w: number; h: number } {
    const { clientWidth, clientHeight } = this.opts.canvas;
    const aspect =
      clientWidth > 0 && clientHeight > 0 ? clientWidth / clientHeight : 16 / 9;
    return {
      w: Math.max(200, Math.min(340, Math.round((180 * aspect) / 4) * 4)),
      h: 180,
    };
  }

  // ---------- events ----------

  private bind(): void {
    const { container, canvas } = this.opts;
    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement,
      type: K,
      fn: (e: HTMLElementEventMap[K]) => void
    ) => {
      el.addEventListener(type, fn as EventListener);
      this.observers.push(() =>
        el.removeEventListener(type, fn as EventListener)
      );
    };
    const onDoc = (
      type: string,
      fn: (e: Event) => void,
      target: Document | Window = document
    ) => {
      target.addEventListener(type, fn);
      this.observers.push(() => target.removeEventListener(type, fn));
    };

    on(container, 'keydown', (e) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        if (this.status === 'playing') this.pause('esc');
        else this.opts.onQuit();
        return;
      }
      if (this.status !== 'playing' || !GAME_KEYS.has(e.code)) return;
      e.preventDefault();
      if (e.repeat) return;
      if (e.code === 'KeyM') {
        this.toggleMinimap();
        return;
      }
      if (e.code === 'Space') this.firePulse = true;
      this.keys.add(e.code);
    });
    on(container, 'keyup', (e) => {
      this.keys.delete(e.code);
      if (GAME_KEYS.has(e.code) && this.status === 'playing')
        e.preventDefault();
    });
    on(container, 'focusout', (e) => {
      const next = e.relatedTarget as Node | null;
      if (next && container.contains(next)) return;
      this.pause('blur');
    });
    on(canvas, 'mousedown', (e) => {
      if (this.status !== 'playing' || e.button !== 0) return;
      e.preventDefault();
      container.focus({ preventScroll: true });
      if (!this.opts.coarse) this.lock();
      this.setFire(true);
    });
    on(canvas, 'contextmenu', (e) => e.preventDefault());
    onDoc('mouseup', () => this.setFire(false));
    onDoc('mousemove', (e) => {
      if (this.status === 'playing' && document.pointerLockElement === canvas) {
        this.mouseDx += (e as MouseEvent).movementX;
      }
    });
    onDoc('pointerlockchange', () => {
      if (
        document.pointerLockElement !== canvas &&
        this.status === 'playing' &&
        !this.opts.coarse
      ) {
        this.pause('esc');
      }
    });
    onDoc('visibilitychange', () => {
      if (document.hidden) this.pause('hidden');
    });
    onDoc('blur', () => this.pause('blur'), window);

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          this.visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
          if (!this.visible) this.pause('offscreen');
        },
        { threshold: [0, 0.2, 0.5] }
      );
      io.observe(container);
      this.observers.push(() => io.disconnect());
    }
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        const { w, h } = this.resolution();
        if (w !== this.renderer.w) {
          canvas.width = w;
          canvas.height = h;
          this.renderer.resize(w, h);
          this.draw();
        }
      });
      ro.observe(canvas);
      this.observers.push(() => ro.disconnect());
    }
  }

  // ---------- loop ----------

  private beginLoop(): void {
    cancelAnimationFrame(this.raf);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number): void => {
    this.raf = 0;
    if (this.status !== 'playing') return;
    const t0 = performance.now();
    this.acc += Math.min(0.25, (now - this.last) / 1000);
    this.last = now;
    let steps = 0;
    while (this.acc >= STEP && steps < 5) {
      this.step();
      this.acc -= STEP;
      steps += 1;
    }
    if (steps === 5) this.acc = 0;
    this.drainEvents();
    this.draw();
    this.frameMs = this.frameMs * 0.9 + (performance.now() - t0) * 0.1;
    this.emit(this.status !== 'playing');
    if (this.status === 'playing') this.raf = requestAnimationFrame(this.frame);
  };

  private input(): Input {
    const k = this.keys;
    const move =
      (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) -
      (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    const strafe = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    const turn =
      (k.has('ArrowRight') || k.has('KeyE') ? 1 : 0) -
      (k.has('ArrowLeft') || k.has('KeyQ') ? 1 : 0);
    const look = this.mouseDx * MOUSE_SENS;
    this.mouseDx = 0;
    const fire = this.fireHeld || this.firePulse || k.has('Space');
    this.firePulse = false;
    return {
      move: Math.max(-1, Math.min(1, move - this.stick.y)),
      strafe,
      turn: Math.max(-1, Math.min(1, turn + this.stick.x)),
      look,
      fire,
    };
  }

  private step(): void {
    update(this.world, this.input(), STEP);
    this.clock += STEP;
    this.drainEvents();
    const { phase } = this.world;
    if (phase === 'won' || phase === 'lost') {
      this.status = phase;
      this.releaseInput();
      if (document.pointerLockElement === this.opts.canvas)
        document.exitPointerLock();
      this.acc = 0;
    }
  }

  private drainEvents(): void {
    const { events } = this.world;
    if (!events.length) return;
    events.forEach((ev) => this.sfx.play(ev));
    events.length = 0;
  }

  private draw(): void {
    this.renderer.render(this.ctx, this.world, {
      time: this.clock,
      minimap: this.minimap,
      reduced: this.opts.reduced,
    });
  }

  private emit(force: boolean): void {
    const now = performance.now();
    if (!force && now - this.hudAt < 100) return;
    this.hudAt = now;
    const w = this.world;
    this.opts.onHud({
      status: this.status,
      pauseReason: this.pauseReason,
      hp: Math.ceil(w.player.hp),
      ammo: w.player.ammo,
      fixed: w.fixed,
      levelFixed: w.levelFixed,
      levelTotal: w.levelTotal,
      level: w.levelIndex,
      levelName: w.level.name,
      levelCount: LEVEL_COUNT,
      time: w.time,
      cleared: w.phase === 'cleared',
      minimap: this.minimap,
      sound: this.sfx.enabled,
      lowAmmo: w.player.ammo <= 5,
    });
  }
}
