import { AREAS, PROJECTS, projectsByArea } from './data';
import { BLOCK, BLOCK_H, LANE_W, LAYOUT } from './layout';

import styles from './map.module.css';

// Server-rendered drawing of the same landscape the WebGL scene shows: lanes
// are areas, depth is the year, one block is one project. Oblique projection.
const S = 44;
const SKEW_X = 0.4;
const SKEW_Y = 0.85;
const PAD = 70;

type P = [number, number];
const pt = (x: number, d: number, h: number): P => [
  x * S + d * S * SKEW_X,
  -d * S * SKEW_Y - h * S,
];
const poly = (points: P[]) => points.map((p) => p.join(',')).join(' ');

const { bounds, placed, lanes, years, undated } = LAYOUT;
// d is depth toward the back: d = -z.
const dFront = -bounds.zFront;
const dBack = -bounds.zBack;

const corners = [
  pt(bounds.xMin - 1.6, dFront - 1.2, 0),
  pt(bounds.xMax, dFront - 1.2, 0),
  pt(bounds.xMax, dBack, BLOCK_H),
  pt(bounds.xMin - 1.6, dBack, BLOCK_H),
];
const minX = Math.min(...corners.map((c) => c[0])) - PAD;
const maxX = Math.max(...corners.map((c) => c[0])) + PAD;
const minY = Math.min(...corners.map((c) => c[1])) - PAD * 0.4;
const maxY = Math.max(...corners.map((c) => c[1])) + PAD;

export default function StaticLandscape() {
  const half = BLOCK / 2;
  const blocks = PROJECTS.map((p) => {
    const at = placed[p.id];
    return { p, x: at.x, d: -at.z };
  }).sort((a, b) => b.d - a.d || a.x - b.x);

  return (
    <svg
      className={styles.landscape}
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      role="img"
      aria-label="Map of all projects. Four lanes by area: insurance systems, AI, mobile, web and product. Depth is the year, older toward the back; projects without a stated year sit in a front band. The full list follows below."
    >
      {lanes.map((lane, i) => {
        const { featured } = AREAS[i];
        return (
          <polygon
            key={lane.id}
            className={featured ? styles.plateFeatured : styles.plate}
            points={poly([
              pt(lane.x - LANE_W / 2, dFront, 0),
              pt(lane.x + LANE_W / 2, dFront, 0),
              pt(lane.x + LANE_W / 2, dBack, 0),
              pt(lane.x - LANE_W / 2, dBack, 0),
            ])}
          />
        );
      })}

      {years.map(({ year, z }) => {
        const left = pt(bounds.xMin - 0.5, -z, 0);
        const right = pt(bounds.xMax, -z, 0);
        return (
          <g key={year}>
            <line
              className={styles.yearLine}
              x1={left[0]}
              y1={left[1]}
              x2={right[0]}
              y2={right[1]}
            />
            <text
              className={styles.svgYear}
              x={left[0] - 8}
              y={left[1] + 4}
              textAnchor="end"
            >
              {year}
            </text>
          </g>
        );
      })}

      {(() => {
        const a = pt(bounds.xMin - 0.5, -undated.front + 0.5, 0);
        const b = pt(bounds.xMin - 0.5, -undated.back - 0.5, 0);
        return (
          <g>
            <line
              className={styles.bandLine}
              x1={a[0] - 6}
              y1={a[1]}
              x2={b[0] - 6}
              y2={b[1]}
            />
            <text
              className={styles.svgBand}
              x={a[0] - 14}
              y={(a[1] + b[1]) / 2 - 4}
              textAnchor="end"
            >
              Year not
            </text>
            <text
              className={styles.svgBand}
              x={a[0] - 14}
              y={(a[1] + b[1]) / 2 + 12}
              textAnchor="end"
            >
              stated
            </text>
          </g>
        );
      })()}

      {blocks.map(({ p, x, d }) => {
        const x0 = x - half;
        const x1 = x + half;
        const dn = d - half;
        const df = d + half;
        const feat = p.featured;
        return (
          <g key={p.id}>
            <polygon
              className={feat ? styles.faceFrontF : styles.faceFront}
              points={poly([
                pt(x0, dn, 0),
                pt(x1, dn, 0),
                pt(x1, dn, BLOCK_H),
                pt(x0, dn, BLOCK_H),
              ])}
            />
            <polygon
              className={feat ? styles.faceSideF : styles.faceSide}
              points={poly([
                pt(x1, dn, 0),
                pt(x1, df, 0),
                pt(x1, df, BLOCK_H),
                pt(x1, dn, BLOCK_H),
              ])}
            />
            <polygon
              className={feat ? styles.faceTopF : styles.faceTop}
              points={poly([
                pt(x0, dn, BLOCK_H),
                pt(x1, dn, BLOCK_H),
                pt(x1, df, BLOCK_H),
                pt(x0, df, BLOCK_H),
              ])}
            />
          </g>
        );
      })}

      {lanes.map((lane, i) => {
        const at = pt(lane.x, dFront - 0.7, 0);
        return (
          <g key={lane.id}>
            <text
              className={styles.svgLane}
              x={at[0]}
              y={at[1] + 18}
              textAnchor="middle"
            >
              {AREAS[i].name}
            </text>
            <text
              className={styles.svgCount}
              x={at[0]}
              y={at[1] + 36}
              textAnchor="middle"
            >
              {projectsByArea(lane.id).length}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
