/* eslint-disable no-bitwise, no-param-reassign -- hot pixel and simulation loops mutate typed arrays and state in place, and the packed colour math needs integer bit ops */
// Two hand-authored levels for the maze shooter. Pure data and parsing; no
// DOM, no React.
//
// Legend
//   #  server rack wall      C  cable tray wall      P  circuit panel wall
//   .  floor                 S  player start (faces +x)
//   n  Null Pointer          r  Race Condition       m  Memory Leak
//   h  hotfix pickup         p  patch pickup

export type SpawnKind = 'null' | 'race' | 'leak' | 'hotfix' | 'patch';

export interface Spawn {
  kind: SpawnKind;
  x: number;
  y: number;
}

export interface Level {
  name: string;
  w: number;
  h: number;
  /** 0 is floor; 1 rack, 2 cable tray, 3 circuit panel. Row-major. */
  cells: Uint8Array;
  start: { x: number; y: number; angle: number };
  spawns: Spawn[];
}

export const LEVEL_SOURCES: { name: string; rows: string[] }[] = [
  {
    name: 'Row A',
    rows: [
      '####################',
      '#S.....#...........#',
      '#......#....n......#',
      '#..h...#...........#',
      '#......C.....##....#',
      '###.####.....##..p.#',
      '#..............#...#',
      '#..n...#####...#...#',
      '#......#...#...#.r.#',
      '#..p...#.h.#.......#',
      '#......P...####.####',
      '#..........#.....p.#',
      '#.....m....#...n...#',
      '####################',
    ],
  },
  {
    name: 'Row B',
    rows: [
      '######################',
      '#S...#.......#.......#',
      '#....#...n...#...r...#',
      '#..p.C.......P.......#',
      '#....#...........h...#',
      '##.###.....#####.#####',
      '#......m...#.......#.#',
      '#.####.....#..n..p.#.#',
      '#.#........C.......P.#',
      '#.#..h.###.#########.#',
      '#.####...#...........#',
      '#......r.#.....#####.#',
      '#.p......P.....#...#.#',
      '#.######.####..#.m.#.#',
      '#..n.....#.........C.#',
      '######################',
    ],
  },
];

const WALLS: Record<string, number> = { '#': 1, C: 2, P: 3 };
const SPAWNS: Record<string, SpawnKind> = {
  n: 'null',
  r: 'race',
  m: 'leak',
  h: 'hotfix',
  p: 'patch',
};

export function parseLevel(source: { name: string; rows: string[] }): Level {
  const h = source.rows.length;
  const w = source.rows[0].length;
  const cells = new Uint8Array(w * h);
  const spawns: Spawn[] = [];
  let start = { x: 1.5, y: 1.5, angle: 0 };
  for (let y = 0; y < h; y += 1) {
    const row = source.rows[y];
    for (let x = 0; x < w; x += 1) {
      const ch = row[x];
      const wall = WALLS[ch];
      if (wall) cells[y * w + x] = wall;
      else if (ch === 'S') start = { x: x + 0.5, y: y + 0.5, angle: 0.35 };
      else if (SPAWNS[ch])
        spawns.push({ kind: SPAWNS[ch], x: x + 0.5, y: y + 0.5 });
    }
  }
  return { name: source.name, w, h, cells, start, spawns };
}

export function loadLevel(index: number): Level {
  return parseLevel(LEVEL_SOURCES[index]);
}

export const LEVEL_COUNT = LEVEL_SOURCES.length;

/** Returns a list of problems; empty when the map is sound. */
export function validateLevel(level: Level): string[] {
  const problems: string[] = [];
  const { w, h, cells } = level;
  for (let x = 0; x < w; x += 1) {
    if (!cells[x] || !cells[(h - 1) * w + x]) problems.push('open top/bottom');
  }
  for (let y = 0; y < h; y += 1) {
    if (!cells[y * w] || !cells[y * w + w - 1]) problems.push('open side');
  }
  // Flood fill from the start: every spawn must be reachable.
  const seen = new Uint8Array(w * h);
  const stack = [Math.floor(level.start.y) * w + Math.floor(level.start.x)];
  seen[stack[0]] = 1;
  while (stack.length) {
    const i = stack.pop() as number;
    const x = i % w;
    const y = (i - x) / w;
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
      const j = ny * w + nx;
      if (cells[j] || seen[j]) return;
      seen[j] = 1;
      stack.push(j);
    });
  }
  level.spawns.forEach((s) => {
    if (!seen[Math.floor(s.y) * w + Math.floor(s.x)])
      problems.push(`unreachable ${s.kind} at ${s.x},${s.y}`);
  });
  return problems;
}
