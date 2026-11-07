/* eslint-disable no-bitwise, no-param-reassign -- hot pixel and simulation loops mutate typed arrays and state in place, and the packed colour math needs integer bit ops */
// Procedural art, drawn at runtime onto scratch canvases and read back as
// packed pixels. There are no image files. Colours follow the home palette:
// near-black, lime, with cyan, magenta, amber and red as accents.

import { mulberry32 } from './rng';

export const TEX = 64;

const LIME = '#c8ff2e';
const CYAN = '#35d6ff';
const MAGENTA = '#ff4fa3';
const AMBER = '#ffb020';
const RED = '#ff3b3b';
const LED_COLORS = [LIME, CYAN, AMBER, RED, LIME];

export interface Bitmap {
  w: number;
  h: number;
  /** Little-endian ABGR, as ImageData stores it. */
  data: Uint32Array;
}

type Ctx = CanvasRenderingContext2D;

function scratch(
  w: number,
  h: number
): { canvas: HTMLCanvasElement; ctx: Ctx } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true }) as Ctx;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

function bitmapOf(ctx: Ctx, w: number, h: number): Bitmap {
  const image = ctx.getImageData(0, 0, w, h);
  return { w, h, data: new Uint32Array(image.data.buffer.slice(0)) };
}

function draw(w: number, h: number, paint: (ctx: Ctx) => void): Bitmap {
  const { ctx } = scratch(w, h);
  paint(ctx);
  return bitmapOf(ctx, w, h);
}

// ---------- walls ----------

function rackTexture(frame: number): Bitmap {
  return draw(TEX, TEX, (c) => {
    c.fillStyle = '#0a0f12';
    c.fillRect(0, 0, TEX, TEX);
    c.fillStyle = '#1c262b';
    c.fillRect(0, 0, 4, TEX);
    c.fillRect(TEX - 4, 0, 4, TEX);
    c.fillStyle = '#0a0f12';
    for (let y = 6; y < TEX; y += 16) {
      c.fillRect(1, y, 2, 2);
      c.fillRect(TEX - 3, y, 2, 2);
    }
    for (let unit = 0; unit < 7; unit += 1) {
      const y = 2 + unit * 9;
      c.fillStyle = '#131b1f';
      c.fillRect(5, y, TEX - 10, 8);
      c.fillStyle = '#26333a';
      c.fillRect(5, y, TEX - 10, 1);
      c.fillStyle = '#080c0e';
      for (let v = 0; v < 12; v += 1) c.fillRect(8 + v * 2, y + 3, 1, 3);
      c.fillStyle = '#222d33';
      c.fillRect(49, y + 2, 9, 4);
      for (let led = 0; led < 3; led += 1) {
        const hash = (unit * 7 + led * 13 + ((unit * led) % 5)) % 11;
        const on = (hash + frame * (led + 1)) % 4 !== 0;
        const color = LED_COLORS[hash % LED_COLORS.length];
        const x = 38 + led * 3;
        if (on) {
          c.globalAlpha = 0.28;
          c.fillStyle = color;
          c.fillRect(x - 1, y + 1, 4, 6);
          c.globalAlpha = 1;
          c.fillRect(x, y + 3, 2, 2);
        } else {
          c.fillStyle = '#1a2428';
          c.fillRect(x, y + 3, 2, 2);
        }
      }
    }
  });
}

function cableTexture(): Bitmap {
  return draw(TEX, TEX, (c) => {
    const rand = mulberry32(31);
    c.fillStyle = '#090e11';
    c.fillRect(0, 0, TEX, TEX);
    const colors = [LIME, CYAN, MAGENTA, AMBER, '#8a98a0'];
    for (let row = 0; row < 11; row += 1) {
      const base = 6 + row * 5;
      c.strokeStyle = colors[Math.floor(rand() * colors.length)];
      c.globalAlpha = 0.85;
      c.lineWidth = 2;
      c.beginPath();
      const phase = rand() * 6;
      for (let x = 0; x <= TEX; x += 2) {
        const y = base + Math.sin(x / 7 + phase) * 1.6;
        if (x === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
    }
    c.globalAlpha = 1;
    c.fillStyle = '#2a363d';
    [2, 30, 58].forEach((y) => {
      c.fillRect(0, y, TEX, 3);
      c.fillStyle = '#10171b';
      c.fillRect(0, y + 3, TEX, 1);
      c.fillStyle = '#2a363d';
    });
    c.fillStyle = '#3a4952';
    [6, 54].forEach((x) => {
      c.fillRect(x, 0, 3, TEX);
      c.fillStyle = '#10171b';
      c.fillRect(x + 3, 0, 1, TEX);
      c.fillStyle = '#3a4952';
    });
  });
}

function panelTexture(frame: number): Bitmap {
  return draw(TEX, TEX, (c) => {
    const rand = mulberry32(77);
    c.fillStyle = '#07120e';
    c.fillRect(0, 0, TEX, TEX);
    c.strokeStyle = '#16302a';
    c.lineWidth = 2;
    c.strokeRect(1, 1, TEX - 2, TEX - 2);
    c.lineWidth = 1;
    for (let t = 0; t < 16; t += 1) {
      let x = Math.floor(rand() * 56) + 4;
      let y = Math.floor(rand() * 56) + 4;
      const hot = t % 5 === 0;
      c.strokeStyle = hot ? LIME : '#2f6d3a';
      c.globalAlpha = hot ? 0.9 : 0.8;
      c.beginPath();
      c.moveTo(x + 0.5, y + 0.5);
      for (let s = 0; s < 4; s += 1) {
        if (s % 2 === 0)
          x = Math.max(3, Math.min(60, x + Math.floor((rand() - 0.5) * 36)));
        else y = Math.max(3, Math.min(60, y + Math.floor((rand() - 0.5) * 36)));
        c.lineTo(x + 0.5, y + 0.5);
      }
      c.stroke();
      c.fillStyle = hot ? LIME : '#2f6d3a';
      c.fillRect(x - 1, y - 1, 3, 3);
    }
    c.globalAlpha = 1;
    c.fillStyle = '#10181b';
    c.fillRect(20, 20, 24, 24);
    c.strokeStyle = '#9aa6a0';
    c.strokeRect(20.5, 20.5, 23, 23);
    c.fillStyle = '#9aa6a0';
    for (let i = 0; i < 6; i += 1) {
      c.fillRect(22 + i * 4, 17, 2, 3);
      c.fillRect(22 + i * 4, 44, 2, 3);
      c.fillRect(17, 22 + i * 4, 3, 2);
      c.fillRect(44, 22 + i * 4, 3, 2);
    }
    c.fillStyle = frame % 2 ? LIME : '#31510f';
    c.fillRect(24, 24, 3, 3);
    c.fillStyle = frame % 2 ? '#1b3a42' : CYAN;
    c.fillRect(29, 24, 3, 3);
    c.fillStyle = '#1d2a2e';
    c.fillRect(24, 36, 16, 3);
    c.fillStyle = '#3a4952';
    [
      [4, 4],
      [57, 4],
      [4, 57],
      [57, 57],
    ].forEach(([x, y]) => c.fillRect(x, y, 3, 3));
  });
}

function floorTexture(): Bitmap {
  return draw(TEX, TEX, (c) => {
    c.fillStyle = '#0d1317';
    c.fillRect(0, 0, TEX, TEX);
    c.fillStyle = '#05080a';
    c.fillRect(0, 0, TEX, 2);
    c.fillRect(0, 0, 2, TEX);
    c.fillRect(0, 31, TEX, 2);
    c.fillRect(31, 0, 2, TEX);
    c.fillStyle = '#18232a';
    c.fillRect(2, 2, 29, 1);
    c.fillRect(33, 2, 29, 1);
    c.fillRect(2, 33, 29, 1);
    c.fillRect(33, 33, 29, 1);
    c.fillStyle = 'rgba(200,255,46,0.16)';
    for (let ty = 0; ty < 2; ty += 1) {
      for (let tx = 0; tx < 2; tx += 1) {
        for (let y = 0; y < 3; y += 1) {
          for (let x = 0; x < 3; x += 1) {
            c.fillRect(tx * 32 + 9 + x * 6, ty * 32 + 9 + y * 6, 2, 2);
          }
        }
      }
    }
  });
}

function ceilingTexture(): Bitmap {
  return draw(TEX, TEX, (c) => {
    c.fillStyle = '#090d10';
    c.fillRect(0, 0, TEX, TEX);
    c.fillStyle = '#04070a';
    c.fillRect(0, 0, TEX, 2);
    c.fillRect(0, 0, 2, TEX);
    c.fillStyle = '#10171b';
    c.fillRect(2, 2, TEX - 2, 1);
    c.fillStyle = 'rgba(200,255,46,0.25)';
    c.fillRect(14, 22, 36, 20);
    c.fillStyle = '#e4ffb4';
    c.fillRect(18, 27, 28, 10);
    c.fillStyle = '#f6ffe0';
    c.fillRect(20, 30, 24, 4);
  });
}

// ---------- sprites ----------

function glitchSlices(
  src: HTMLCanvasElement,
  c: Ctx,
  bands: [number, number, number][]
): void {
  c.clearRect(0, 0, TEX, TEX);
  let y = 0;
  const cuts = bands.slice().sort((a, b) => a[0] - b[0]);
  cuts.forEach(([from, to, shift]) => {
    c.drawImage(src, 0, y, TEX, from - y, 0, y, TEX, from - y);
    c.drawImage(src, 0, from, TEX, to - from, shift, from, TEX, to - from);
    y = to;
  });
  c.drawImage(src, 0, y, TEX, TEX - y, 0, y, TEX, TEX - y);
}

/** Null Pointer: a hovering void with a slashed-zero brow and shifting slices. */
function nullSprite(frame: number, attack: boolean): Bitmap {
  const { canvas: raw, ctx: r } = scratch(TEX, TEX);
  r.fillStyle = '#170c24';
  r.strokeStyle = MAGENTA;
  r.lineWidth = 2;
  r.beginPath();
  r.moveTo(16, 24);
  r.quadraticCurveTo(16, 6, 32, 6);
  r.quadraticCurveTo(48, 6, 48, 24);
  r.lineTo(48, 46);
  r.lineTo(42, 52);
  r.lineTo(37, 46);
  r.lineTo(32, 54);
  r.lineTo(27, 46);
  r.lineTo(22, 52);
  r.lineTo(16, 46);
  r.closePath();
  r.fill();
  r.stroke();
  // slashed zero brow
  r.strokeStyle = CYAN;
  r.lineWidth = 2;
  r.beginPath();
  r.ellipse(32, 15, 6, 4, 0, 0, Math.PI * 2);
  r.moveTo(27, 19);
  r.lineTo(37, 11);
  r.stroke();
  // eyes
  r.fillStyle = attack ? RED : LIME;
  let leftH = frame ? 9 : 7;
  let rightH = frame ? 7 : 9;
  if (attack) {
    leftH = 11;
    rightH = 11;
  }
  r.fillRect(21, 24, 7, leftH);
  r.fillRect(36, 24, 7, rightH);
  // mouth
  r.strokeStyle = MAGENTA;
  r.lineWidth = 2;
  r.beginPath();
  if (attack) {
    r.fillStyle = '#05020a';
    r.fillRect(22, 38, 20, 8);
    r.strokeRect(22, 38, 20, 8);
  } else {
    r.moveTo(21, 40);
    for (let x = 21; x <= 43; x += 4) r.lineTo(x, x % 8 === 1 ? 37 : 42);
    r.stroke();
  }
  const { ctx: out } = scratch(TEX, TEX);
  glitchSlices(
    raw,
    out,
    frame
      ? [
          [12, 17, 4],
          [30, 35, -5],
          [44, 48, 3],
        ]
      : [
          [10, 14, -3],
          [26, 31, 5],
          [40, 45, -4],
        ]
  );
  return bitmapOf(out, TEX, TEX);
}

function beetle(
  c: Ctx,
  ox: number,
  body: string,
  dark: string,
  frame: number,
  attack: boolean,
  alpha: number
): void {
  c.globalAlpha = alpha;
  c.strokeStyle = body;
  c.lineWidth = 2;
  const lift = frame ? 3 : 0;
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 3; i += 1) {
      const y = 28 + i * 8;
      const reach = 11 + (i === 1 ? 4 : 0);
      c.beginPath();
      c.moveTo(32 + ox + side * 10, y);
      c.lineTo(32 + ox + side * (10 + reach / 2), y - 3 - (i % 2 ? lift : 0));
      c.lineTo(32 + ox + side * (10 + reach), y + 6 - (i % 2 ? 0 : lift));
      c.stroke();
    }
    c.beginPath();
    c.moveTo(32 + ox + side * 3, 12);
    c.lineTo(32 + ox + side * 9, 3);
    c.lineTo(32 + ox + side * 14, 6);
    c.stroke();
  }
  c.fillStyle = body;
  c.beginPath();
  c.ellipse(32 + ox, 36, 15, 17, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = dark;
  c.fillRect(31 + ox, 20, 2, 32);
  c.beginPath();
  c.ellipse(32 + ox, 16, 8, 7, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = attack ? '#ffffff' : RED;
  c.fillRect(27 + ox, 13, 3, 3);
  c.fillRect(34 + ox, 13, 3, 3);
  if (attack) {
    c.strokeStyle = '#ffffff';
    c.beginPath();
    c.moveTo(28 + ox, 21);
    c.lineTo(24 + ox, 27);
    c.moveTo(36 + ox, 21);
    c.lineTo(40 + ox, 27);
    c.stroke();
  }
  c.globalAlpha = 1;
}

/** Race Condition: one beetle and its ghost, never quite in a single place. */
function raceSprite(frame: number, attack: boolean): Bitmap {
  return draw(TEX, TEX, (c) => {
    beetle(c, frame ? -7 : 7, CYAN, '#0b4a5c', frame, false, 0.4);
    beetle(c, 0, AMBER, '#5a3600', frame, attack, 1);
  });
}

/** Memory Leak: a gel blob full of stale bits. */
function leakSprite(frame: number, attack: boolean): Bitmap {
  return draw(TEX, TEX, (c) => {
    const squash = frame ? 2 : 0;
    const g = c.createRadialGradient(28, 26, 3, 32, 36, 28);
    g.addColorStop(0, '#7dfbe6');
    g.addColorStop(0.55, '#16a5b0');
    g.addColorStop(1, '#093f4d');
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(8, 50);
    c.quadraticCurveTo(4 - squash, 28, 20, 18);
    c.quadraticCurveTo(32, 4 + squash, 46, 18);
    c.quadraticCurveTo(62 + squash, 30, 56, 50);
    c.quadraticCurveTo(32, 58, 8, 50);
    c.fill();
    c.fillStyle = '#16a5b0';
    [
      [14, 54, 3],
      [30, 58, 4],
      [48, 55, 3],
    ].forEach(([x, y, rr]) => {
      c.beginPath();
      c.arc(x, y + (frame ? 2 : 0), rr, 0, Math.PI * 2);
      c.fill();
    });
    c.fillStyle = 'rgba(255,255,255,0.35)';
    [
      [22, 40, 3],
      [40, 44, 2],
      [46, 30, 2],
    ].forEach(([x, y, rr]) => {
      c.beginPath();
      c.arc(x, y, rr, 0, Math.PI * 2);
      c.fill();
    });
    c.fillStyle = 'rgba(5,40,50,0.7)';
    c.font = 'bold 8px monospace';
    c.fillText(frame ? '1 0 1' : '0 1 0', 22, 49);
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.arc(24, 28, 5, 0, Math.PI * 2);
    c.arc(40, 28, 5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#04141a';
    c.fillRect(attack ? 22 : 24, 27, 3, 3);
    c.fillRect(attack ? 40 : 38, 27, 3, 3);
    if (attack) {
      c.fillStyle = '#04141a';
      c.beginPath();
      c.ellipse(32, 40, 9, 6, 0, 0, Math.PI * 2);
      c.fill();
    }
  });
}

function hotfixSprite(): Bitmap {
  return draw(TEX, TEX, (c) => {
    const g = c.createRadialGradient(32, 32, 4, 32, 32, 30);
    g.addColorStop(0, 'rgba(200,255,46,0.45)');
    g.addColorStop(1, 'rgba(200,255,46,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, TEX, TEX);
    c.fillStyle = '#9aa6a0';
    for (let i = 0; i < 5; i += 1) {
      c.fillRect(18 + i * 7, 12, 3, 5);
      c.fillRect(18 + i * 7, 47, 3, 5);
      c.fillRect(12, 18 + i * 7, 5, 3);
      c.fillRect(47, 18 + i * 7, 5, 3);
    }
    c.fillStyle = '#10181b';
    c.fillRect(17, 17, 30, 30);
    c.strokeStyle = LIME;
    c.lineWidth = 2;
    c.strokeRect(18, 18, 28, 28);
    c.fillStyle = LIME;
    c.fillRect(29, 23, 6, 18);
    c.fillRect(23, 29, 18, 6);
  });
}

function patchSprite(): Bitmap {
  return draw(TEX, TEX, (c) => {
    const g = c.createRadialGradient(32, 32, 4, 32, 32, 30);
    g.addColorStop(0, 'rgba(255,176,32,0.4)');
    g.addColorStop(1, 'rgba(255,176,32,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, TEX, TEX);
    c.save();
    c.translate(32, 32);
    c.rotate(-0.5);
    c.fillStyle = AMBER;
    c.fillRect(-20, -9, 40, 18);
    c.fillStyle = '#6a4300';
    c.fillRect(-9, -9, 18, 18);
    c.strokeStyle = '#ffe3a0';
    c.lineWidth = 1;
    c.setLineDash([3, 3]);
    c.strokeRect(-19, -8, 38, 16);
    c.setLineDash([]);
    c.fillStyle = '#ffe3a0';
    c.fillRect(-5, -2, 10, 4);
    c.restore();
  });
}

// ---------- first-person weapon ----------

export const GUN_W = 112;
export const GUN_H = 84;

function gunSprite(): Bitmap {
  return draw(GUN_W, GUN_H, (c) => {
    // body wedge, seen from behind: wide at the hands, narrow at the emitter
    c.fillStyle = '#1b262b';
    c.beginPath();
    c.moveTo(20, GUN_H);
    c.lineTo(46, 26);
    c.lineTo(66, 26);
    c.lineTo(92, GUN_H);
    c.closePath();
    c.fill();
    c.fillStyle = '#2d3b42';
    c.beginPath();
    c.moveTo(46, 26);
    c.lineTo(66, 26);
    c.lineTo(70, 40);
    c.lineTo(42, 40);
    c.closePath();
    c.fill();
    c.fillStyle = '#0a1013';
    c.fillRect(50, 14, 12, 14);
    c.fillStyle = LIME;
    c.fillRect(52, 16, 8, 3);
    c.fillStyle = '#3c4d56';
    c.fillRect(48, 10, 16, 5);
    // lime spine and ammo window
    c.fillStyle = LIME;
    c.beginPath();
    c.moveTo(54, 44);
    c.lineTo(58, 44);
    c.lineTo(60, GUN_H);
    c.lineTo(52, GUN_H);
    c.closePath();
    c.fill();
    c.fillStyle = '#05080a';
    c.fillRect(38, 52, 36, 14);
    c.fillStyle = '#35d6ff';
    for (let i = 0; i < 6; i += 1) c.fillRect(41 + i * 5, 55, 3, 8);
    // grip pads
    c.fillStyle = '#0d1418';
    c.fillRect(8, 62, 22, 22);
    c.fillRect(82, 62, 22, 22);
    c.fillStyle = '#26333a';
    c.fillRect(8, 62, 22, 2);
    c.fillRect(82, 62, 22, 2);
  });
}

function flashSprite(): Bitmap {
  return draw(TEX, TEX, (c) => {
    const g = c.createRadialGradient(32, 32, 1, 32, 32, 30);
    g.addColorStop(0, 'rgba(255,255,235,1)');
    g.addColorStop(0.3, 'rgba(200,255,46,0.85)');
    g.addColorStop(1, 'rgba(200,255,46,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, TEX, TEX);
    c.strokeStyle = 'rgba(240,255,200,0.9)';
    c.lineWidth = 2;
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      c.beginPath();
      c.moveTo(32, 32);
      c.lineTo(32 + Math.cos(a) * 31, 32 + Math.sin(a) * 31);
      c.stroke();
    }
  });
}

export interface Art {
  /** [wallType - 1][frame] */
  walls: Bitmap[][];
  floor: Bitmap;
  ceiling: Bitmap;
  /** enemy kind -> [idle0, idle1, attack] */
  enemies: Record<'null' | 'race' | 'leak', Bitmap[]>;
  hotfix: Bitmap;
  patch: Bitmap;
  gun: Bitmap;
  flash: Bitmap;
}

export function buildArt(): Art {
  const rack = [0, 1, 2, 3].map(rackTexture);
  const cable = cableTexture();
  const panel = [panelTexture(0), panelTexture(1)];
  return {
    walls: [
      rack,
      [cable, cable, cable, cable],
      [panel[0], panel[1], panel[0], panel[1]],
    ],
    floor: floorTexture(),
    ceiling: ceilingTexture(),
    enemies: {
      null: [nullSprite(0, false), nullSprite(1, false), nullSprite(0, true)],
      race: [raceSprite(0, false), raceSprite(1, false), raceSprite(0, true)],
      leak: [leakSprite(0, false), leakSprite(1, false), leakSprite(0, true)],
    },
    hotfix: hotfixSprite(),
    patch: patchSprite(),
    gun: gunSprite(),
    flash: flashSprite(),
  };
}
