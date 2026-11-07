// Textures of the project ring. Client only (imported by the lazy scene chunk).
//
// Every panel gets a small texture first, so the whole ring exists within a few
// KB. Full-size ones are made only for the panels near the front (full-size
// images decode one at a time; typographic panels are drawn at full size) and
// are disposed again once a panel is far from the front, so GPU memory stays
// bounded however many projects there are.

import * as THREE from 'three';

import { areaName, KAIRO_COMMAND, KAIRO_REPO, KAIRO_SLOGAN } from '../ringData';
import { configure, decode, pause, textureMB } from './common';

import type { RingPanel } from '../ringData';

export type Fonts = { display: string; mono: string };

const ACCENT = '#c8ff2e';
const INK = '#f0f4ec';
const MUTED = '#a9b3a7';
const PLATE = '#080b0a';

/** Layout is drawn in a 1280 x 800 design space and scaled to the pixel width. */
const DESIGN_W = 1280;
const WIDTH_HI = 1024;
const WIDTH_LO = 560;

/** Break `text` into lines no wider than `max` at the current font. */
const wrapText = (ctx: CanvasRenderingContext2D, text: string, max: number) => {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines;
};

const base = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = PLATE;
  ctx.fillRect(0, 0, w, h);
  const sheen = ctx.createLinearGradient(0, 0, w, h);
  sheen.addColorStop(0, 'rgba(255,255,255,0.05)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);
  // One short lit rule in the corner marks the plate; no side stripe.
  ctx.fillStyle = ACCENT;
  ctx.fillRect(96, 70, 72, 6);
};

/** A typographic panel: the project's own stated data, nothing else. */
const drawType = (panel: RingPanel, fonts: Fonts, width: number) => {
  const sc = width / DESIGN_W;
  const w = DESIGN_W * sc;
  const h = 800 * sc;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w);
  canvas.height = Math.round(h);
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(sc, sc);
  base(ctx, DESIGN_W, 800);
  ctx.textBaseline = 'alphabetic';

  // A very large initial, outlined: depth, not content.
  ctx.save();
  ctx.font = `700 880px ${fonts.display}`;
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(232,237,229,0.07)';
  ctx.strokeText(panel.name.charAt(0).toUpperCase(), 760, 760);
  ctx.restore();

  const left = 96;
  const maxW = DESIGN_W - left - 110;
  let size = 128;
  let lines: string[] = [];
  for (; size >= 64; size -= 8) {
    ctx.font = `600 ${size}px ${fonts.display}`;
    lines = wrapText(ctx, panel.name, maxW);
    if (
      lines.length <= 3 &&
      lines.every((l) => ctx.measureText(l).width <= maxW)
    ) {
      break;
    }
  }
  ctx.fillStyle = INK;
  const lead = size * 1.02;
  const top = 330 - ((lines.length - 1) * lead) / 2;
  lines.forEach((line, i) => ctx.fillText(line, left, top + i * lead));

  ctx.fillStyle = MUTED;
  ctx.font = `400 42px ${fonts.display}`;
  const metaLines = wrapText(ctx, panel.meta, maxW);
  metaLines
    .slice(0, 2)
    .forEach((line, i) => ctx.fillText(line, left, 560 + i * 56));

  // Area and year as plain facts, in the data face.
  ctx.fillStyle = '#8c978a';
  ctx.font = `400 32px ${fonts.mono}`;
  const year = panel.project.year ? `  ${panel.project.year}` : '';
  ctx.fillText(`${areaName(panel.project.area)}${year}`, left, 716);
  return canvas;
};

/** Kairo: a terminal with the real command, the slogan and the repository. */
const drawTerminal = (fonts: Fonts, width: number) => {
  const sc = width / DESIGN_W;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(DESIGN_W * sc);
  canvas.height = Math.round(800 * sc);
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(sc, sc);
  base(ctx, DESIGN_W, 800);
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = INK;
  ctx.font = `600 168px ${fonts.display}`;
  ctx.fillText('Kairo', 96, 232);
  ctx.fillStyle = MUTED;
  ctx.font = `400 50px ${fonts.display}`;
  ctx.fillText(KAIRO_SLOGAN, 100, 318);

  // The terminal block.
  const bx = 96;
  const by = 400;
  const bw = DESIGN_W - bx - 90;
  const bh = 190;
  ctx.fillStyle = '#0f1611';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = 'rgba(232,237,229,0.16)';
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);
  let size = 66;
  ctx.font = `500 ${size}px ${fonts.mono}`;
  while (ctx.measureText(KAIRO_COMMAND).width > bw - 150 && size > 36) {
    size -= 2;
    ctx.font = `500 ${size}px ${fonts.mono}`;
  }
  const baseline = by + bh / 2 + size * 0.34;
  ctx.fillStyle = ACCENT;
  ctx.fillText('$', bx + 38, baseline);
  ctx.fillStyle = INK;
  ctx.fillText(KAIRO_COMMAND, bx + 38 + size * 1.1, baseline);

  ctx.fillStyle = '#8c978a';
  ctx.font = `400 36px ${fonts.mono}`;
  ctx.fillText(KAIRO_REPO, 96, 716);
  return canvas;
};

export class RingTextures {
  private lo = new Map<string, THREE.Texture>();

  private hi = new Map<string, THREE.Texture>();

  private pending = new Set<string>();

  private queue: Promise<void> = Promise.resolve();

  private disposed = false;

  constructor(
    private panels: RingPanel[],
    private anisotropy: number,
    private fonts: Fonts,
    private onChange: () => void
  ) {}

  /** The best texture there is for a panel right now. */
  get(id: string) {
    return this.hi.get(id) ?? this.lo.get(id) ?? null;
  }

  private draw(panel: RingPanel, width: number) {
    return panel.kind === 'terminal'
      ? drawTerminal(this.fonts, width)
      : drawType(panel, this.fonts, width);
  }

  async start() {
    try {
      await Promise.all([
        document.fonts.load(`600 64px ${this.fonts.display}`),
        document.fonts.load(`500 40px ${this.fonts.mono}`),
      ]);
    } catch {
      /* the fallback stack draws instead */
    }
    if (this.disposed) return;
    // Pictures: small derivatives, all together.
    const images = this.panels.filter((p) => p.kind === 'image');
    const drawn = this.panels.filter((p) => p.kind !== 'image');
    // Typographic panels first, one per turn, nearest the front first.
    drawn.forEach((panel, n) => {
      window.setTimeout(() => {
        if (this.disposed) return;
        const canvas = this.draw(
          panel,
          panel.kind === 'terminal' ? DESIGN_W : WIDTH_LO
        );
        if (!canvas) return;
        const tex = configure(canvas, this.anisotropy);
        if (panel.kind === 'terminal') this.hi.set(panel.id, tex);
        else this.lo.set(panel.id, tex);
        this.onChange();
      }, n * 16);
    });
    await Promise.all(
      images.map(async (panel) => {
        try {
          const img = await decode(panel.lo);
          if (this.disposed) return;
          this.lo.set(panel.id, configure(img, this.anisotropy));
          this.onChange();
        } catch {
          /* the panel stays dark */
        }
      })
    );
  }

  /**
   * Full-size textures for the panels in `near`; those outside `keep` lose
   * theirs. Images decode one at a time.
   */
  want(near: Set<string>, keep: Set<string>) {
    if (this.disposed) return;
    Array.from(this.hi.keys()).forEach((id) => {
      const panel = this.panels.find((p) => p.id === id);
      if (panel?.kind === 'terminal' || keep.has(id)) return;
      this.hi.get(id)?.dispose();
      this.hi.delete(id);
      this.onChange();
    });
    near.forEach((id) => {
      if (this.hi.has(id) || this.pending.has(id)) return;
      const panel = this.panels.find((p) => p.id === id);
      if (!panel || panel.kind === 'terminal') return;
      this.pending.add(id);
      this.queue = this.queue.then(async () => {
        if (this.disposed) return;
        try {
          let tex: THREE.Texture | null = null;
          if (panel.kind === 'image') {
            tex = configure(await decode(panel.src), this.anisotropy);
          } else {
            const canvas = this.draw(panel, WIDTH_HI);
            tex = canvas ? configure(canvas, this.anisotropy) : null;
          }
          if (tex && !this.disposed && keep.has(id)) this.hi.set(id, tex);
          else tex?.dispose();
          this.onChange();
        } catch {
          /* keep the small texture */
        }
        this.pending.delete(id);
        await pause(40);
      });
    });
  }

  gpuMB() {
    let mb = 0;
    this.lo.forEach((t) => {
      mb += textureMB(t);
    });
    this.hi.forEach((t) => {
      mb += textureMB(t);
    });
    return mb;
  }

  dispose() {
    this.disposed = true;
    this.lo.forEach((t) => t.dispose());
    this.hi.forEach((t) => t.dispose());
    this.lo.clear();
    this.hi.clear();
  }
}
