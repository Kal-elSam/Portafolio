/* eslint-disable no-bitwise, no-param-reassign -- hot pixel and simulation loops mutate typed arrays and state in place, and the packed colour math needs integer bit ops */
// Game rules: player movement, hitscan, enemies and pickups. Pure and
// deterministic; the loop feeds it a fixed timestep and an input snapshot.

import { Level, LEVEL_COUNT, loadLevel } from './maps';
import { castRay, distanceField, lineOfSight } from './raycast';

export const STEP = 1 / 60;

export type EnemyKind = 'null' | 'race' | 'leak';
export type EnemyState = 'idle' | 'chase' | 'attack' | 'hit' | 'die';
export type PickupKind = 'hotfix' | 'patch';
export type Phase = 'play' | 'cleared' | 'won' | 'lost';
export type WorldEvent =
  | 'shoot'
  | 'dry'
  | 'hit'
  | 'kill'
  | 'hurt'
  | 'hotfix'
  | 'patch'
  | 'cleared'
  | 'won'
  | 'lost';

export interface Enemy {
  id: number;
  kind: EnemyKind;
  x: number;
  y: number;
  hp: number;
  state: EnemyState;
  stateT: number;
  age: number;
  atkCd: number;
  flip: boolean;
  flipT: number;
  struck: boolean;
  gone: boolean;
}

export interface Pickup {
  kind: PickupKind;
  x: number;
  y: number;
  taken: boolean;
}

export interface Input {
  /** -1 back .. 1 forward. */
  move: number;
  /** -1 left .. 1 right. */
  strafe: number;
  /** -1 left .. 1 right, scaled by the turn rate. */
  turn: number;
  /** Extra turn in radians (mouse), consumed by the update. */
  look: number;
  fire: boolean;
}

export interface World {
  levelIndex: number;
  level: Level;
  player: {
    x: number;
    y: number;
    angle: number;
    hp: number;
    ammo: number;
    fireCd: number;
    flash: number;
    bob: number;
  };
  enemies: Enemy[];
  pickups: Pickup[];
  phase: Phase;
  /** Bugs fixed on this map / on this map in total / over the whole run. */
  levelFixed: number;
  levelTotal: number;
  fixed: number;
  time: number;
  clearedT: number;
  hurt: number;
  shake: number;
  events: WorldEvent[];
  field: Int16Array;
  fieldCell: number;
}

export const MAX_HP = 100;
export const MAX_AMMO = 99;
const START_AMMO = 45;
const MOVE_SPEED = 3.1;
const TURN_SPEED = 2.5;
const PLAYER_R = 0.22;
const FIRE_COOLDOWN = 0.26;
const CLEARED_PAUSE = 2.4;

interface Stats {
  hp: number;
  speed: number;
  dmg: number;
  range: number;
  windup: number;
  cooldown: number;
  sight: number;
  radius: number;
}

export const STATS: Record<EnemyKind, Stats> = {
  null: {
    hp: 3,
    speed: 0.85,
    dmg: 9,
    range: 1.1,
    windup: 0.5,
    cooldown: 1.1,
    sight: 11,
    radius: 0.32,
  },
  race: {
    hp: 2,
    speed: 2.6,
    dmg: 6,
    range: 1,
    windup: 0.22,
    cooldown: 0.7,
    sight: 11,
    radius: 0.28,
  },
  leak: {
    hp: 4,
    speed: 1.25,
    dmg: 5,
    range: 1.15,
    windup: 0.4,
    cooldown: 1,
    sight: 11,
    radius: 0.34,
  },
};

/** The Memory Leak grows as it lives, up to 1.7 times its starting size. */
export function enemySize(e: Enemy): number {
  return e.kind === 'leak' ? Math.min(1.7, 1 + e.age * 0.025) : 1;
}

/** Where the enemy is drawn and where a shot can hit it. The Race Condition
 *  is seen at one of two spots to either side of its true position. */
export function enemyVisual(
  e: Enemy,
  px: number,
  py: number
): { x: number; y: number } {
  if (e.kind !== 'race' || e.state === 'die') return { x: e.x, y: e.y };
  const dx = e.x - px;
  const dy = e.y - py;
  const d = Math.hypot(dx, dy) || 1;
  const o = (e.flip ? 1 : -1) * 0.28;
  return { x: e.x - (dy / d) * o, y: e.y + (dx / d) * o };
}

function fillLevel(world: World, levelIndex: number): void {
  const level = loadLevel(levelIndex);
  world.levelIndex = levelIndex;
  world.level = level;
  world.player.x = level.start.x;
  world.player.y = level.start.y;
  world.player.angle = level.start.angle;
  world.player.fireCd = 0.4;
  world.enemies = [];
  world.pickups = [];
  level.spawns.forEach((s, i) => {
    if (s.kind === 'hotfix' || s.kind === 'patch') {
      world.pickups.push({ kind: s.kind, x: s.x, y: s.y, taken: false });
    } else {
      world.enemies.push({
        id: i + 1,
        kind: s.kind,
        x: s.x,
        y: s.y,
        hp: STATS[s.kind].hp,
        state: 'idle',
        stateT: 0,
        age: 0,
        atkCd: 0.6,
        flip: false,
        flipT: 0.15,
        struck: false,
        gone: false,
      });
    }
  });
  world.levelFixed = 0;
  world.levelTotal = world.enemies.length;
  world.phase = 'play';
  world.clearedT = 0;
  world.field = new Int16Array(level.w * level.h);
  world.fieldCell = -1;
}

export function createWorld(): World {
  const world = {
    player: {
      x: 0,
      y: 0,
      angle: 0,
      hp: MAX_HP,
      ammo: START_AMMO,
      fireCd: 0,
      flash: 0,
      bob: 0,
    },
    fixed: 0,
    time: 0,
    hurt: 0,
    shake: 0,
    events: [],
  } as unknown as World;
  fillLevel(world, 0);
  return world;
}

function blocked(level: Level, x: number, y: number, r: number): boolean {
  const { w, h, cells } = level;
  const x0 = Math.floor(x - r);
  const x1 = Math.floor(x + r);
  const y0 = Math.floor(y - r);
  const y1 = Math.floor(y + r);
  for (let cy = y0; cy <= y1; cy += 1) {
    for (let cx = x0; cx <= x1; cx += 1) {
      if (cx < 0 || cy < 0 || cx >= w || cy >= h || cells[cy * w + cx])
        return true;
    }
  }
  return false;
}

/** Slide along walls: each axis is tried on its own. */
function slide(
  level: Level,
  pos: { x: number; y: number },
  dx: number,
  dy: number,
  r: number
): void {
  if (!blocked(level, pos.x + dx, pos.y, r)) pos.x += dx;
  if (!blocked(level, pos.x, pos.y + dy, r)) pos.y += dy;
}

function fire(world: World): void {
  const p = world.player;
  p.ammo -= 1;
  p.fireCd = FIRE_COOLDOWN;
  p.flash = 0.09;
  world.events.push('shoot');
  const dx = Math.cos(p.angle);
  const dy = Math.sin(p.angle);
  const { level } = world;
  const wall = castRay(level.cells, level.w, level.h, p.x, p.y, dx, dy).dist;
  let best: Enemy | null = null;
  let bestAlong = Infinity;
  world.enemies.forEach((e) => {
    if (e.state === 'die') return;
    const v = enemyVisual(e, p.x, p.y);
    const ex = v.x - p.x;
    const ey = v.y - p.y;
    const along = ex * dx + ey * dy;
    if (along < 0.15 || along > wall || along > bestAlong) return;
    const perp = Math.abs(ex * dy - ey * dx);
    if (perp > STATS[e.kind].radius * enemySize(e)) return;
    best = e;
    bestAlong = along;
  });
  if (!best) return;
  const e = best as Enemy;
  e.hp -= 1;
  world.events.push('hit');
  if (e.hp <= 0) {
    e.state = 'die';
    e.stateT = 0;
    world.levelFixed += 1;
    world.fixed += 1;
    world.events.push('kill');
  } else {
    e.state = 'hit';
    e.stateT = 0;
    e.struck = false;
  }
}

function hurtPlayer(world: World, dmg: number): void {
  const p = world.player;
  if (world.phase !== 'play') return;
  p.hp = Math.max(0, p.hp - dmg);
  world.hurt = 1;
  world.shake = 1;
  world.events.push('hurt');
  if (p.hp <= 0) {
    world.phase = 'lost';
    world.events.push('lost');
  }
}

function updateEnemy(world: World, e: Enemy, dt: number): void {
  const p = world.player;
  const { level } = world;
  const st = STATS[e.kind];
  e.age += dt;
  e.stateT += dt;
  e.atkCd = Math.max(0, e.atkCd - dt);
  if (e.kind === 'race') {
    e.flipT -= dt;
    if (e.flipT <= 0) {
      e.flip = !e.flip;
      e.flipT = 0.1 + ((e.id * 7) % 5) * 0.035;
    }
  }
  if (e.state === 'die') {
    if (e.stateT > 0.9) e.gone = true;
    return;
  }
  const dx = p.x - e.x;
  const dy = p.y - e.y;
  const d = Math.hypot(dx, dy);
  const sees = lineOfSight(level.cells, level.w, level.h, e.x, e.y, p.x, p.y);
  const size = enemySize(e);

  if (e.state === 'idle') {
    if ((sees && d < st.sight) || d < 2.5) {
      e.state = 'chase';
      e.stateT = 0;
    }
    return;
  }
  if (e.state === 'hit') {
    if (e.stateT > 0.16) {
      e.state = 'chase';
      e.stateT = 0;
    }
    return;
  }
  if (e.state === 'attack') {
    if (!e.struck && e.stateT >= st.windup) {
      e.struck = true;
      if (d < st.range * size * 1.3) {
        hurtPlayer(world, Math.round(st.dmg + (size - 1) * 10));
      }
    }
    if (e.stateT >= st.windup + 0.28) {
      e.state = 'chase';
      e.stateT = 0;
      e.atkCd = st.cooldown;
    }
    return;
  }
  // chase
  if (d < st.range * size && e.atkCd <= 0 && sees) {
    e.state = 'attack';
    e.stateT = 0;
    e.struck = false;
    return;
  }
  let tx = p.x;
  let ty = p.y;
  if (!sees) {
    const cx = Math.floor(e.x);
    const cy = Math.floor(e.y);
    let bestD = world.field[cy * level.w + cx];
    let bx = cx;
    let by = cy;
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].forEach(([ox, oy]) => {
      const nx = cx + ox;
      const ny = cy + oy;
      if (nx < 0 || ny < 0 || nx >= level.w || ny >= level.h) return;
      const nd = world.field[ny * level.w + nx];
      if (nd >= 0 && (bestD < 0 || nd < bestD)) {
        bestD = nd;
        bx = nx;
        by = ny;
      }
    });
    tx = bx + 0.5;
    ty = by + 0.5;
  }
  const mx = tx - e.x;
  const my = ty - e.y;
  const md = Math.hypot(mx, my);
  if (md > 0.05 && d > st.range * size * 0.7) {
    const step = Math.min(st.speed * dt, md);
    slide(level, e, (mx / md) * step, (my / md) * step, 0.24);
  }
}

/** Keep crowds from stacking on one spot. */
function separate(world: World): void {
  const live = world.enemies.filter((e) => e.state !== 'die');
  for (let i = 0; i < live.length; i += 1) {
    for (let j = i + 1; j < live.length; j += 1) {
      const a = live[i];
      const b = live[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      if (d > 0 && d < 0.55) {
        const push = (0.55 - d) * 0.25;
        slide(world.level, a, (-dx / d) * push, (-dy / d) * push, 0.24);
        slide(world.level, b, (dx / d) * push, (dy / d) * push, 0.24);
      }
    }
  }
}

export function update(world: World, input: Input, dt: number = STEP): void {
  const p = world.player;
  world.hurt = Math.max(0, world.hurt - dt * 2.2);
  world.shake = Math.max(0, world.shake - dt * 3);
  p.flash = Math.max(0, p.flash - dt);
  p.fireCd = Math.max(0, p.fireCd - dt);

  if (world.phase === 'cleared') {
    world.clearedT += dt;
    if (world.clearedT >= CLEARED_PAUSE) fillLevel(world, world.levelIndex + 1);
    return;
  }
  if (world.phase !== 'play') return;

  world.time += dt;
  p.angle += input.turn * TURN_SPEED * dt + input.look;
  const fx = Math.cos(p.angle);
  const fy = Math.sin(p.angle);
  let vx = fx * input.move - fy * input.strafe;
  let vy = fy * input.move + fx * input.strafe;
  const len = Math.hypot(vx, vy);
  if (len > 1) {
    vx /= len;
    vy /= len;
  }
  slide(world.level, p, vx * MOVE_SPEED * dt, vy * MOVE_SPEED * dt, PLAYER_R);
  p.bob = len > 0.01 ? p.bob + dt * 9 : p.bob;

  if (input.fire && p.fireCd <= 0) {
    if (p.ammo > 0) fire(world);
    else {
      p.fireCd = 0.35;
      world.events.push('dry');
    }
  }

  const cell = Math.floor(p.y) * world.level.w + Math.floor(p.x);
  if (cell !== world.fieldCell) {
    world.fieldCell = cell;
    distanceField(
      world.level.cells,
      world.level.w,
      world.level.h,
      Math.floor(p.x),
      Math.floor(p.y),
      world.field
    );
  }
  world.enemies.forEach((e) => {
    if (!e.gone) updateEnemy(world, e, dt);
  });
  separate(world);

  world.pickups.forEach((pk) => {
    if (pk.taken || Math.hypot(pk.x - p.x, pk.y - p.y) > 0.5) return;
    if (pk.kind === 'hotfix' && p.hp < MAX_HP) {
      pk.taken = true;
      p.hp = Math.min(MAX_HP, p.hp + 30);
      world.events.push('hotfix');
    } else if (pk.kind === 'patch' && p.ammo < MAX_AMMO) {
      pk.taken = true;
      p.ammo = Math.min(MAX_AMMO, p.ammo + 15);
      world.events.push('patch');
    }
  });

  if (world.phase === 'play' && world.levelFixed >= world.levelTotal) {
    if (world.levelIndex + 1 >= LEVEL_COUNT) {
      world.phase = 'won';
      world.events.push('won');
    } else {
      world.phase = 'cleared';
      world.clearedT = 0;
      world.events.push('cleared');
    }
  }
}
