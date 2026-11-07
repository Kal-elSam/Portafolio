/* eslint-disable no-bitwise, no-param-reassign, no-continue -- hot pixel loops skip early, they mutate typed arrays and state in place, and the packed colour math needs integer bit ops */
// Software raycaster. Draws into a small ImageData and lets CSS scale it up
// with nearest-neighbour filtering. Walls and the floor are sampled from the
// procedural textures; sprites are billboards tested against a z-buffer.

import { Art, Bitmap, buildArt, GUN_H, GUN_W, TEX } from './art';
import { castRay } from './raycast';
import { Enemy, enemySize, enemyVisual, World } from './world';

/** Half the visible height at unit distance. Fixed so a wider canvas shows
 *  more to the sides without zooming. */
const TAN_V = 0.371;

export interface RenderOptions {
  time: number;
  minimap: boolean;
  reduced: boolean;
}

const pack = (r: number, g: number, b: number) =>
  (0xff000000 | (b << 16) | (g << 8) | r) >>> 0;

const BASE_HEIGHT = { race: 0.6, null: 0.85, leak: 0.8 };
const MAP_COLORS = [
  pack(8, 12, 14),
  pack(52, 74, 30),
  pack(30, 74, 90),
  pack(80, 50, 70),
];

function shadeColor(c: number, f: number): number {
  const r = ((c & 255) * f) >> 8;
  const g = (((c >> 8) & 255) * f) >> 8;
  const b = (((c >> 16) & 255) * f) >> 8;
  return (0xff000000 | (b << 16) | (g << 8) | r) >>> 0;
}

function hash2(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) & 255) / 255;
}

export class Renderer {
  art: Art;

  w = 0;

  h = 0;

  private image!: ImageData;

  private px!: Uint32Array;

  private z!: Float32Array;

  private vignette!: Float32Array;

  constructor(w: number, h: number) {
    this.art = buildArt();
    this.resize(w, h);
  }

  resize(w: number, h: number): void {
    if (w === this.w && h === this.h) return;
    this.w = w;
    this.h = h;
    this.image = new ImageData(w, h);
    this.px = new Uint32Array(this.image.data.buffer);
    this.z = new Float32Array(w);
    this.vignette = new Float32Array(w * h);
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const nx = (x / w) * 2 - 1;
        const ny = (y / h) * 2 - 1;
        this.vignette[y * w + x] = Math.min(
          1,
          Math.max(0, (nx * nx + ny * ny - 0.45) / 0.9)
        );
      }
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    world: World,
    opts: RenderOptions
  ): void {
    const { w, h, px, z, art } = this;
    const { player: p, level } = world;
    const frame = opts.reduced ? 0 : Math.floor(opts.time * 3) & 3;
    const dirX = Math.cos(p.angle);
    const dirY = Math.sin(p.angle);
    const plane = TAN_V * (w / h);
    const planeX = -dirY * plane;
    const planeY = dirX * plane;
    const proj = h / 2 / TAN_V;
    const horizon = h >> 1;

    // ---- floor and ceiling ----
    const floorTex = art.floor.data;
    const ceilTex = art.ceiling.data;
    for (let y = horizon + 1; y < h; y += 1) {
      const rowDist = (0.5 * proj) / (y - horizon);
      const f = Math.max(40, Math.floor(256 / (1 + rowDist * 0.3)));
      const stepX = (rowDist * 2 * planeX) / w;
      const stepY = (rowDist * 2 * planeY) / w;
      let fx = p.x + rowDist * (dirX - planeX);
      let fy = p.y + rowDist * (dirY - planeY);
      const rowF = y * w;
      const rowC = (h - 1 - y) * w;
      for (let x = 0; x < w; x += 1) {
        const tx = ((fx * TEX) | 0) & (TEX - 1);
        const ty = ((fy * TEX) | 0) & (TEX - 1);
        px[rowF + x] = shadeColor(floorTex[ty * TEX + tx], f);
        const cx = (((fx * TEX) / 2) | 0) & (TEX - 1);
        const cy = (((fy * TEX) / 2) | 0) & (TEX - 1);
        px[rowC + x] = shadeColor(ceilTex[cy * TEX + cx], f);
        fx += stepX;
        fy += stepY;
      }
    }
    for (let x = 0; x < w; x += 1) {
      px[horizon * w + x] = pack(5, 8, 10);
      px[(horizon - 1) * w + x] = pack(5, 8, 10);
    }

    // ---- walls ----
    for (let x = 0; x < w; x += 1) {
      const camX = (2 * x) / w - 1;
      const rx = dirX + planeX * camX;
      const ry = dirY + planeY * camX;
      const len = Math.hypot(rx, ry);
      const hit = castRay(
        level.cells,
        level.w,
        level.h,
        p.x,
        p.y,
        rx / len,
        ry / len
      );
      const perp = Math.max(0.05, hit.dist / len);
      z[x] = perp;
      const lineH = proj / perp;
      const top = horizon - lineH / 2;
      const y0 = Math.max(0, Math.ceil(top));
      const y1 = Math.min(h - 1, Math.floor(top + lineH));
      const textures = art.walls[hit.cell - 1] ?? art.walls[0];
      const tex = textures[frame % textures.length].data;
      const tx = Math.min(TEX - 1, (hit.u * TEX) | 0);
      let f = Math.max(40, Math.floor(256 / (1 + perp * 0.3)));
      if (hit.side) f = (f * 0.78) | 0;
      const stepT = TEX / lineH;
      let tpos = (y0 - top) * stepT;
      for (let y = y0; y <= y1; y += 1) {
        const ty = Math.min(TEX - 1, tpos | 0);
        tpos += stepT;
        px[y * w + x] = shadeColor(tex[ty * TEX + tx], f);
      }
    }

    // ---- sprites ----
    this.drawSprites(world, opts, {
      dirX,
      dirY,
      planeX,
      planeY,
      proj,
      horizon,
    });

    // ---- gun ----
    this.drawGun(world, opts);

    // ---- crosshair ----
    const cxm = w >> 1;
    const cym = horizon;
    const cross = pack(200, 255, 46);
    [-3, -2, 2, 3].forEach((d) => {
      px[cym * w + cxm + d] = cross;
      px[(cym + d) * w + cxm] = cross;
    });

    // ---- hurt vignette ----
    if (world.hurt > 0.02) {
      const k = world.hurt * (opts.reduced ? 0.3 : 0.55);
      for (let i = 0; i < px.length; i += 1) {
        const a = this.vignette[i] * k;
        if (a <= 0) continue;
        const c = px[i];
        const r = (c & 255) + (255 - (c & 255)) * a;
        const g = ((c >> 8) & 255) * (1 - a);
        const b = ((c >> 16) & 255) * (1 - a);
        px[i] = pack(r | 0, g | 0, b | 0);
      }
    }

    if (opts.minimap) this.drawMinimap(world);

    ctx.fillStyle = '#05080a';
    ctx.fillRect(0, 0, w, h);
    const s = opts.reduced ? 0 : world.shake;
    const ox = s > 0 ? Math.round(Math.sin(opts.time * 91) * 2.5 * s) : 0;
    const oy = s > 0 ? Math.round(Math.cos(opts.time * 77) * 1.5 * s) : 0;
    ctx.putImageData(this.image, ox, oy);
  }

  private blit(
    bmp: Bitmap,
    sx0: number,
    sy0: number,
    dw: number,
    dh: number,
    shade: number,
    mode: 'alpha' | 'add' = 'alpha'
  ): void {
    const { w, h } = this;
    const x0 = Math.max(0, Math.floor(sx0));
    const x1 = Math.min(w - 1, Math.floor(sx0 + dw) - 1);
    const y0 = Math.max(0, Math.floor(sy0));
    const y1 = Math.min(h - 1, Math.floor(sy0 + dh) - 1);
    for (let y = y0; y <= y1; y += 1) {
      const ty = Math.min(bmp.h - 1, (((y - sy0) * bmp.h) / dh) | 0);
      for (let x = x0; x <= x1; x += 1) {
        const tx = Math.min(bmp.w - 1, (((x - sx0) * bmp.w) / dw) | 0);
        const c = bmp.data[ty * bmp.w + tx];
        const a = c >>> 24;
        if (a < 24) continue;
        this.mix(y * w + x, c, a, shade, mode);
      }
    }
  }

  private mix(
    i: number,
    c: number,
    a: number,
    shade: number,
    mode: 'alpha' | 'add'
  ): void {
    const { px } = this;
    const d = px[i];
    let r = ((c & 255) * shade) >> 8;
    let g = (((c >> 8) & 255) * shade) >> 8;
    let b = (((c >> 16) & 255) * shade) >> 8;
    const k = a / 255;
    if (mode === 'add') {
      r = Math.min(255, (d & 255) + r * k);
      g = Math.min(255, ((d >> 8) & 255) + g * k);
      b = Math.min(255, ((d >> 16) & 255) + b * k);
    } else if (a < 250) {
      r = (d & 255) + (r - (d & 255)) * k;
      g = ((d >> 8) & 255) + (g - ((d >> 8) & 255)) * k;
      b = ((d >> 16) & 255) + (b - ((d >> 16) & 255)) * k;
    }
    px[i] = pack(r | 0, g | 0, b | 0);
  }

  private drawSprites(
    world: World,
    opts: RenderOptions,
    cam: {
      dirX: number;
      dirY: number;
      planeX: number;
      planeY: number;
      proj: number;
      horizon: number;
    }
  ): void {
    const { w, h, z, art } = this;
    const { player: p } = world;
    const { dirX, dirY, planeX, planeY, proj, horizon } = cam;
    const inv = 1 / (planeX * dirY - dirX * planeY);
    type Item = {
      bmp: Bitmap;
      tx: number;
      depth: number;
      worldH: number;
      centerH: number;
      enemy?: Enemy;
    };
    const items: Item[] = [];
    const place = (x: number, y: number) => {
      const rx = x - p.x;
      const ry = y - p.y;
      return {
        tx: inv * (dirY * rx - dirX * ry),
        depth: inv * (-planeY * rx + planeX * ry),
      };
    };
    world.pickups.forEach((pk) => {
      if (pk.taken) return;
      const { tx, depth } = place(pk.x, pk.y);
      const bob = opts.reduced ? 0 : Math.sin(opts.time * 3 + pk.x * 2) * 0.03;
      items.push({
        bmp: pk.kind === 'hotfix' ? art.hotfix : art.patch,
        tx,
        depth,
        worldH: 0.42,
        centerH: 0.24 + bob,
      });
    });
    world.enemies.forEach((e) => {
      if (e.gone) return;
      const v = enemyVisual(e, p.x, p.y);
      const { tx, depth } = place(v.x, v.y);
      const size = enemySize(e);
      const float =
        e.kind === 'null' && !opts.reduced
          ? Math.sin(opts.time * 2.2 + e.id) * 0.05
          : 0;
      const worldH = BASE_HEIGHT[e.kind] * size;
      const centerH = e.kind === 'null' ? 0.5 + float : worldH / 2;
      const anim = opts.reduced ? 0 : Math.floor(opts.time * 3 + e.id) & 1;
      const set = art.enemies[e.kind];
      const bmp = e.state === 'attack' ? set[2] : set[anim];
      items.push({ bmp, tx, depth, worldH, centerH, enemy: e });
    });
    items.sort((a, b) => b.depth - a.depth);

    items.forEach((it) => {
      if (it.depth < 0.15) return;
      const size = (proj / it.depth) * it.worldH;
      const sx = (w / 2) * (1 + it.tx / it.depth);
      const left = sx - size / 2;
      const sy = horizon + (0.5 - it.centerH) * (proj / it.depth) - size / 2;
      const shade = Math.max(60, Math.floor(256 / (1 + it.depth * 0.25)));
      const x0 = Math.max(0, Math.floor(left));
      const x1 = Math.min(w - 1, Math.floor(left + size) - 1);
      const y0 = Math.max(0, Math.floor(sy));
      const y1 = Math.min(h - 1, Math.floor(sy + size) - 1);
      const e = it.enemy;
      const dissolve = e && e.state === 'die' ? Math.min(1, e.stateT / 0.8) : 0;
      const whiten = e && e.state === 'hit' ? 0.6 : 0;
      for (let x = x0; x <= x1; x += 1) {
        if (it.depth >= z[x]) continue;
        const tx = Math.min(it.bmp.w - 1, (((x - left) * it.bmp.w) / size) | 0);
        for (let y = y0; y <= y1; y += 1) {
          const ty = Math.min(it.bmp.h - 1, (((y - sy) * it.bmp.h) / size) | 0);
          let c = it.bmp.data[ty * it.bmp.w + tx];
          const a = c >>> 24;
          if (a < 24) continue;
          if (
            dissolve > 0 &&
            hash2(tx, ty + ((e as Enemy).id << 6)) < dissolve * 1.15
          )
            continue;
          if (whiten > 0) {
            const r = (c & 255) + (255 - (c & 255)) * whiten;
            const g = ((c >> 8) & 255) + (255 - ((c >> 8) & 255)) * whiten;
            const b = ((c >> 16) & 255) + (255 - ((c >> 16) & 255)) * whiten;
            c = ((a << 24) | ((b | 0) << 16) | ((g | 0) << 8) | (r | 0)) >>> 0;
          }
          this.mix(y * w + x, c, a, shade, 'alpha');
        }
      }
    });
  }

  private drawGun(world: World, opts: RenderOptions): void {
    const { w, h, art } = this;
    const p = world.player;
    const bob = opts.reduced ? 0 : 1;
    const bx = Math.round(Math.sin(p.bob) * 3 * bob);
    const by = Math.round(Math.abs(Math.cos(p.bob)) * 3 * bob);
    const kick = p.flash > 0 ? 5 : 0;
    const gx = Math.round((w - GUN_W) / 2) + bx;
    const gy = h - GUN_H + 6 + by + kick;
    this.blit(art.gun, gx, gy, GUN_W, GUN_H, 256);
    if (p.flash > 0) {
      const size = opts.reduced ? 26 : 44;
      this.blit(
        art.flash,
        gx + 56 - size / 2,
        gy + 12 - size / 2,
        size,
        size,
        256,
        'add'
      );
    }
  }

  private drawMinimap(world: World): void {
    const { w, h, px } = this;
    const { level, player: p } = world;
    const s = Math.max(2, Math.min(4, Math.floor((h * 0.38) / level.h)));
    const ox = w - level.w * s - 4;
    const oy = h - level.h * s - 4;
    const dim = (x: number, y: number, c: number) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      px[y * w + x] = c;
    };
    for (let cy = 0; cy < level.h; cy += 1) {
      for (let cx = 0; cx < level.w; cx += 1) {
        const wall = level.cells[cy * level.w + cx];
        const c = MAP_COLORS[wall];
        for (let j = 0; j < s; j += 1)
          for (let i = 0; i < s; i += 1)
            dim(ox + cx * s + i, oy + cy * s + j, c);
      }
    }
    const dot = (x: number, y: number, c: number, r = 1) => {
      const mx = ox + Math.floor(x * s);
      const my = oy + Math.floor(y * s);
      for (let j = 0; j < r; j += 1)
        for (let i = 0; i < r; i += 1) dim(mx + i, my + j, c);
    };
    world.pickups.forEach(
      (pk) => !pk.taken && dot(pk.x, pk.y, pack(53, 214, 255))
    );
    world.enemies.forEach(
      (e) => e.state !== 'die' && dot(e.x, e.y, pack(255, 79, 163), 2)
    );
    dot(p.x, p.y, pack(200, 255, 46), 2);
    for (let t = 1.2; t < 3; t += 0.6) {
      dot(
        p.x + Math.cos(p.angle) * t * 0.5,
        p.y + Math.sin(p.angle) * t * 0.5,
        pack(200, 255, 46)
      );
    }
  }
}
