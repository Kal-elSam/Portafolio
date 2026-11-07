/* eslint-disable no-bitwise, no-param-reassign -- hot pixel and simulation loops mutate typed arrays and state in place, and the packed colour math needs integer bit ops */
// Grid ray casting shared by the renderer, hitscan and enemy sight checks.
// Pure functions over a row-major cell array.

export interface RayHit {
  dist: number;
  /** Wall type (1..3). */
  cell: number;
  /** True when a horizontal face (constant y) was hit. */
  side: boolean;
  /** 0..1 along the face. */
  u: number;
}

const FAR = 64;

/** DDA walk. dist is the euclidean distance along (dx, dy), which is unit length. */
export function castRay(
  cells: Uint8Array,
  w: number,
  h: number,
  ox: number,
  oy: number,
  dx: number,
  dy: number
): RayHit {
  let mx = Math.floor(ox);
  let my = Math.floor(oy);
  const ddx = dx === 0 ? 1e30 : Math.abs(1 / dx);
  const ddy = dy === 0 ? 1e30 : Math.abs(1 / dy);
  const stepX = dx < 0 ? -1 : 1;
  const stepY = dy < 0 ? -1 : 1;
  let sdx = (dx < 0 ? ox - mx : mx + 1 - ox) * ddx;
  let sdy = (dy < 0 ? oy - my : my + 1 - oy) * ddy;
  let side = false;
  for (let i = 0; i < FAR; i += 1) {
    if (sdx < sdy) {
      sdx += ddx;
      mx += stepX;
      side = false;
    } else {
      sdy += ddy;
      my += stepY;
      side = true;
    }
    if (mx < 0 || my < 0 || mx >= w || my >= h) break;
    const cell = cells[my * w + mx];
    if (cell) {
      const dist = side ? sdy - ddy : sdx - ddx;
      let u = side ? ox + dist * dx : oy + dist * dy;
      u -= Math.floor(u);
      // Mirror so textures read left to right from the viewer.
      if ((!side && dx > 0) || (side && dy < 0)) u = 1 - u;
      return { dist, cell, side, u };
    }
  }
  return { dist: FAR, cell: 1, side, u: 0 };
}

/** True when no wall lies between the two points. */
export function lineOfSight(
  cells: Uint8Array,
  w: number,
  h: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): boolean {
  const dx = bx - ax;
  const dy = by - ay;
  const dist = Math.hypot(dx, dy);
  if (dist < 1e-6) return true;
  const hit = castRay(cells, w, h, ax, ay, dx / dist, dy / dist);
  return hit.dist >= dist;
}

/** Walkable step counts from a cell, four-connected; -1 is unreachable. */
export function distanceField(
  cells: Uint8Array,
  w: number,
  h: number,
  cx: number,
  cy: number,
  out: Int16Array
): void {
  out.fill(-1);
  const queue = new Int16Array(w * h);
  let head = 0;
  let tail = 0;
  const start = cy * w + cx;
  out[start] = 0;
  queue[tail] = start;
  tail += 1;
  while (head < tail) {
    const i = queue[head];
    head += 1;
    const x = i % w;
    const y = (i - x) / w;
    const d = out[i] + 1;
    if (x > 0 && !cells[i - 1] && out[i - 1] < 0) {
      out[i - 1] = d;
      queue[tail] = i - 1;
      tail += 1;
    }
    if (x < w - 1 && !cells[i + 1] && out[i + 1] < 0) {
      out[i + 1] = d;
      queue[tail] = i + 1;
      tail += 1;
    }
    if (y > 0 && !cells[i - w] && out[i - w] < 0) {
      out[i - w] = d;
      queue[tail] = i - w;
      tail += 1;
    }
    if (y < h - 1 && !cells[i + w] && out[i + w] < 0) {
      out[i + w] = d;
      queue[tail] = i + w;
      tail += 1;
    }
  }
}
