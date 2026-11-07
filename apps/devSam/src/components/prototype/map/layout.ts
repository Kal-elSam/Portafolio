import { AREAS, PROJECTS } from './data';

import type { AreaId, MapProject } from './data';

// World layout shared by the WebGL scene and the static SVG, so both draw the
// same landscape. x: lane (area). z: depth. Depth is time: one YEAR_STEP per
// calendar year, older toward the back. Projects with no stated year sit in a
// separate band at the front. Block size encodes nothing.
export const COLS = 3;
export const PITCH = 1;
export const BLOCK = 0.84;
export const BLOCK_H = 0.56;
export const LANE_PITCH = 3.9;
export const LANE_W = 3.6;
export const YEAR_STEP = 1.2;
export const BAND_GAP = 1.35;

export type Placed = { id: string; x: number; z: number; lane: number };

const chunk = <T>(items: T[]) => {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += COLS) {
    rows.push(items.slice(i, i + COLS));
  }
  return rows;
};

const colX = (laneX: number, col: number, count: number) =>
  laneX + (col - (count - 1) / 2) * PITCH;

function build(projects: MapProject[]) {
  const laneX = (lane: number) => (lane - (AREAS.length - 1) / 2) * LANE_PITCH;
  const placed: Record<string, Placed> = {};

  const undatedRows = Math.max(
    ...AREAS.map(
      (a) =>
        chunk(projects.filter((p) => p.area === a.id && p.year === null)).length
    )
  );

  const years = projects
    .map((p) => p.year)
    .filter((y): y is number => y !== null);
  const maxYear = Math.max(...years);
  const minYear = Math.min(...years);
  const firstDatedZ = -(undatedRows - 1) * PITCH - BAND_GAP;
  const yearZ = (y: number) => firstDatedZ - (maxYear - y) * YEAR_STEP;

  AREAS.forEach((area, lane) => {
    const mine = projects.filter((p) => p.area === area.id);
    chunk(mine.filter((p) => p.year === null)).forEach((row, r) => {
      row.forEach((p, c) => {
        placed[p.id] = {
          id: p.id,
          x: colX(laneX(lane), c, COLS),
          z: -r * PITCH,
          lane,
        };
      });
    });
    for (let y = minYear; y <= maxYear; y += 1) {
      const atYear = mine.filter((p) => p.year === y);
      if (atYear.length > COLS) {
        throw new Error(`Lane ${area.id} has more than ${COLS} in ${y}`);
      }
      atYear.forEach((p, c) => {
        placed[p.id] = {
          id: p.id,
          x: colX(laneX(lane), c, COLS),
          z: yearZ(y),
          lane,
        };
      });
    }
  });

  const yearList: { year: number; z: number }[] = [];
  for (let y = maxYear; y >= minYear; y -= 1) {
    yearList.push({ year: y, z: yearZ(y) });
  }

  const zFront = 0.9;
  const zBack = yearZ(minYear) - 0.9;
  const xMin = laneX(0) - LANE_W / 2;
  const xMax = laneX(AREAS.length - 1) + LANE_W / 2;

  return {
    placed,
    lanes: AREAS.map((a, i) => ({ id: a.id as AreaId, x: laneX(i) })),
    years: yearList,
    undated: { front: 0, back: -(undatedRows - 1) * PITCH },
    bounds: { xMin, xMax, zFront, zBack },
  };
}

export const LAYOUT = build(PROJECTS);
