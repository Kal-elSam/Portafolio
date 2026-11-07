// Progressive texture loading for the wall. Client only (imported by the lazy
// scene chunk). Every panel gets its small derivative first so the whole wall
// exists within a few KB; the full-size derivatives follow one at a time in
// priority order. Textures are disposed on unmount, a failed image hides its
// panel, and nothing here blocks first paint.

import * as THREE from 'three';

import { KAIRO_COMMAND, KAIRO_REPO, SCREENS } from './screens';

/** Panels with a priority below this load at full size together, first. */
export const HERO_COUNT = 5;

export type Entry = {
  map: THREE.Texture | null;
  full: boolean;
  glow: THREE.Color;
  failed: boolean;
};

const ACCENT = '#c8ff2e';

const pause = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const decode = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`texture failed: ${src}`));
    img.src = src;
  });

/** Average colour of the image, used as the colour of the screen's glow. */
const averageColor = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new THREE.Color('#4a5560');
  ctx.drawImage(img, 0, 0, 8, 8);
  const { data } = ctx.getImageData(0, 0, 8, 8);
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const n = data.length / 4;
  const c = new THREE.Color().setRGB(
    r / n / 255,
    g / n / 255,
    b / n / 255,
    THREE.SRGBColorSpace
  );
  // Keep the glow chromatic but never brighter than a soft wash.
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  return c.setHSL(hsl.h, Math.min(1, hsl.s * 1.1), Math.min(0.5, hsl.l));
};

const configure = (texture: THREE.Texture, anisotropy: number) => {
  const t = texture;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
};

/** Terminal panel: real text only (the README line, command and repository). */
const drawTerminal = (fontFamily: string, anisotropy: number) => {
  const W = 1920;
  const H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#080b09';
  ctx.fillRect(0, 0, W, H);
  // One accent rule on the left edge; no window chrome, no fake output.
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 0, 10, H);
  ctx.fillStyle = '#16201a';
  ctx.fillRect(10, 0, W - 10, 6);
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f0f4ec';
  ctx.font = `600 104px ${fontFamily}`;
  ctx.fillText('Kairo Runtime', 120, 210);
  ctx.fillStyle = '#b4beb2';
  ctx.font = `400 50px ${fontFamily}`;
  ctx.fillText('Routes work between Claude Code,', 120, 330);
  ctx.fillText('Codex and OpenCode by capability,', 120, 400);
  ctx.fillText('eligibility, quota and cost.', 120, 470);
  ctx.fillStyle = '#10170f';
  ctx.fillRect(120, 590, W - 240, 190);
  ctx.fillStyle = ACCENT;
  ctx.fillRect(120, 590, 6, 190);
  ctx.font = `500 76px ${fontFamily}`;
  ctx.fillText('$', 176, 708);
  ctx.fillStyle = '#f0f4ec';
  ctx.fillText(KAIRO_COMMAND, 262, 708);
  ctx.fillStyle = '#9aa598';
  ctx.font = `400 46px ${fontFamily}`;
  ctx.fillText(KAIRO_REPO, 120, 940);
  const texture = new THREE.CanvasTexture(canvas);
  return configure(texture, anisotropy);
};

export class WallTextures {
  private entries = new Map<string, Entry>();

  private disposed = false;

  constructor(private anisotropy: number, private onChange: () => void) {
    SCREENS.forEach((s) =>
      this.entries.set(s.id, {
        map: null,
        full: false,
        glow: new THREE.Color('#3a4650'),
        failed: false,
      })
    );
  }

  get(id: string) {
    return this.entries.get(id);
  }

  private set(id: string, patch: Partial<Entry>) {
    const entry = this.entries.get(id);
    if (!entry || this.disposed) return;
    Object.assign(entry, patch);
    this.onChange();
  }

  private swap(id: string, texture: THREE.Texture, full: boolean) {
    const entry = this.entries.get(id);
    if (!entry) return;
    if (this.disposed) {
      texture.dispose();
      return;
    }
    entry.map?.dispose();
    this.set(id, { map: texture, full });
  }

  /**
   * Small derivatives for every panel in parallel, then full-size ones one at a
   * time in priority order. `fullSize` is false on small screens.
   */
  async start(fullSize: boolean, fontFamily: string) {
    const ordered = [...SCREENS].sort((a, b) => a.priority - b.priority);

    const terminal = ordered.find((s) => s.kind === 'terminal');
    if (terminal) {
      const draw = async () => {
        try {
          await document.fonts.load(`500 76px ${fontFamily}`);
          await document.fonts.load(`600 104px ${fontFamily}`);
        } catch {
          /* fall back to the stack that is available */
        }
        const texture = drawTerminal(fontFamily, this.anisotropy);
        if (texture) this.swap(terminal.id, texture, true);
        else this.set(terminal.id, { failed: true });
        this.set(terminal.id, { glow: new THREE.Color('#5d7d17') });
      };
      draw();
    }

    const images = ordered.filter((s) => s.kind === 'image');
    await Promise.all(
      images.map(async (s) => {
        try {
          const img = await decode(s.lo);
          if (this.disposed) return;
          const glow = averageColor(img);
          this.swap(
            s.id,
            configure(new THREE.Texture(img), this.anisotropy),
            false
          );
          this.set(s.id, { glow });
        } catch {
          this.set(s.id, { failed: true });
        }
      })
    );
    if (!fullSize) return;

    // The hero screens decode together, so the first view is sharp at once.
    const hero = images.filter((s) => s.priority < HERO_COUNT);
    await Promise.all(
      hero.map(async (s) => {
        try {
          const img = await decode(s.src);
          if (this.disposed) return;
          this.swap(
            s.id,
            configure(new THREE.Texture(img), this.anisotropy),
            true
          );
        } catch {
          /* keep the small derivative */
        }
      })
    );

    const rest = images.filter((s) => s.priority >= HERO_COUNT);
    for (let i = 0; i < rest.length && !this.disposed; i += 1) {
      const s = rest[i];
      // One upload per turn: decode off the main thread, then yield.
      try {
        // eslint-disable-next-line no-await-in-loop
        const img = await decode(s.src);
        if (this.disposed) return;
        this.swap(
          s.id,
          configure(new THREE.Texture(img), this.anisotropy),
          true
        );
      } catch {
        /* keep the small derivative */
      }
      // eslint-disable-next-line no-await-in-loop
      await pause(140);
    }
  }

  /** Decoded GPU estimate in MB (RGBA8 plus a full mip chain). */
  gpuMB() {
    let bytes = 0;
    this.entries.forEach((entry) => {
      const img = entry.map?.image as
        | { width: number; height: number }
        | undefined;
      if (img) bytes += img.width * img.height * 4 * (4 / 3);
    });
    return bytes / (1024 * 1024);
  }

  dispose() {
    this.disposed = true;
    this.entries.forEach((entry) => {
      entry.map?.dispose();
      Object.assign(entry, { map: null });
    });
  }
}
