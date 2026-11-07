import {
  CAPTION,
  CHANNELS,
  claudeQuota,
  codexQuota,
  DENY,
  ROLE_NOTE,
  ROLES,
  STILL_PROGRESS,
  SVG_LABEL,
  TASKS,
} from './data';

import styles from './kairo.module.css';

// The same system as the 3D scene, drawn once: the state after the re-route.
// Server-rendered, so it is what no-JS, no-WebGL and narrow screens get.

const claudePct = Math.round(claudeQuota(STILL_PROGRESS) * 100);
const codexPct = Math.round(codexQuota() * 100);
const TICK_COUNT = 21;

type Props = { hidden: boolean };

function Core({ x, y, r }: { x: number; y: number; r: number }) {
  const s = r / 105;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none">
      <circle r="105" className={styles.svgSteel} strokeWidth="9" opacity="0.55" />
      <circle r="94" className={styles.svgDim} strokeWidth="2" />
      <circle r="78" className={styles.svgAcid} strokeWidth="3" strokeDasharray="330 160" transform="rotate(20)" />
      <circle r="62" className={styles.svgSteel} strokeWidth="2.5" strokeDasharray="230 160" transform="rotate(130)" />
      <circle r="46" className={styles.svgAcidFill} opacity="0.1" stroke="none" />
      <polygon points="0,-34 30,-14 30,18 0,36 -30,18 -30,-14" className={styles.svgGlass} strokeWidth="2.5" />
      <polygon points="0,-34 30,-14 30,18 0,36 -30,18 -30,-14" className={styles.svgAcid} strokeWidth="2" />
      <circle r="10" className={styles.svgAcidFill} stroke="none" />
    </g>
  );
}

type ChipProps = { x: number; y: number; w: number; h: number; name: string; role: string };

function Chip({ x, y, w, h, name, role }: ChipProps) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" className={styles.svgChip} />
      <text x={x + 12} y={y + h * 0.44} className={styles.svgMonoSmall}>{name}</text>
      <text x={x + 12} y={y + h * 0.82} className={styles.svgRole}>{role}</text>
    </g>
  );
}

function RolePill({ x, y, w, h, name, lit }: { x: number; y: number; w: number; h: number; name: string; lit: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" className={styles.svgGlass} />
      <rect x={x} y={y} width={w} height={h} rx="3" fill="none" className={lit ? styles.svgAcid : styles.svgSteel} strokeWidth="2" />
      <text x={x + w / 2} y={y + h * 0.66} textAnchor="middle" className={styles.svgRole}>{name}</text>
    </g>
  );
}

type PillProps = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  pct: number;
  /** 'lit' carries the work, 'idle' is steel. */
  state: 'lit' | 'idle';
  /** Round tube or hexagonal prism. */
  shape: 'round' | 'hex';
};

const hexPoints = (x: number, y: number, w: number, h: number) =>
  [
    [x + h / 2, y],
    [x + w - h / 2, y],
    [x + w, y + h / 2],
    [x + w - h / 2, y + h],
    [x + h / 2, y + h],
    [x, y + h / 2],
  ]
    .map((p) => p.join(','))
    .join(' ');

// One provider: glass body, light up to the quota level, gauge ticks.
function Pill({ id, x, y, w, h, pct, state, shape }: PillProps) {
  const lit = state === 'lit';
  const fill = (pct / 100) * w;
  const body =
    shape === 'round' ? (
      <rect x={x} y={y} width={w} height={h} rx={h / 2} />
    ) : (
      <polygon points={hexPoints(x, y, w, h)} />
    );
  const outline =
    shape === 'round' ? (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={h / 2}
        fill="none"
        className={lit ? styles.svgAcid : styles.svgSteel}
        strokeWidth={lit ? 2.5 : 2}
      />
    ) : (
      <polygon
        points={hexPoints(x, y, w, h)}
        fill="none"
        className={lit ? styles.svgAcid : styles.svgSteel}
        strokeWidth={lit ? 2.5 : 2}
      />
    );
  return (
    <g>
      <clipPath id={`clip-${id}`}>{body}</clipPath>
      <g className={styles.svgGlass}>{body}</g>
      {fill > 0 && (
        <g clipPath={`url(#clip-${id})`}>
          <rect
            x={x}
            y={y + h * 0.18}
            width={fill}
            height={h * 0.64}
            className={lit ? styles.svgAcidSoft : styles.svgSteelFill}
          />
          {lit && <rect x={x} y={y + h / 2 - 2} width={fill} height="4" className={styles.svgAcidFill} />}
          <rect x={x + fill - 3} y={y} width="3" height={h} className={lit ? styles.svgAcidFill : styles.svgSteelFill} />
        </g>
      )}
      {outline}
      {Array.from({ length: TICK_COUNT }, (_, i) => {
        const tx = x + h / 2 + (i / (TICK_COUNT - 1)) * (w - h);
        const on = lit && i / (TICK_COUNT - 1) <= pct / 100 + 0.001;
        const len = i % 5 === 0 ? 10 : 5;
        return (
          <line
            key={i}
            x1={tx}
            x2={tx}
            y1={y + h - 4}
            y2={y + h - 4 - len}
            className={on ? styles.svgAcid : styles.svgDim}
            strokeWidth={i % 5 === 0 ? 2 : 1.2}
          />
        );
      })}
    </g>
  );
}

function Denied({ x, y, small }: { x: number; y: number; small: boolean }) {
  return (
    <g>
      <g transform={`translate(${x + 14} ${y - 10})`}>
        <path d="M-9 -9 L9 9 M9 -9 L-9 9" className={styles.svgPale} strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
      <text x={x + 38} y={y} className={styles.svgRole}>{DENY.title}</text>
      <text x={x + 38} y={y + (small ? 20 : 24)} className={small ? styles.svgMonoSmall : styles.svgMonoDim}>{DENY.detail}</text>
    </g>
  );
}

const SAMPLE_TASKS = [
  { name: TASKS[0][0], role: ROLES[0] },
  { name: TASKS[1][0], role: ROLES[1] },
  { name: TASKS[2][0], role: ROLES[2] },
] as const;

function Landscape() {
  const cx = 372;
  const cy = 232;
  const roleY = [112, 192, 272, 352];
  const roleX = 540;
  const roleW = 150;
  const roleH = 44;
  const provX = 770;
  const claudeY = 124;
  const codexY = 326;
  const provH = 66;
  return (
    <svg
      className={styles.svgWide}
      viewBox="0 0 1000 520"
      role="img"
      aria-label={SVG_LABEL}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{SVG_LABEL}</title>
      {/* work in */}
      {[132, 212, 292].map((y) => (
        <path key={y} d={`M236 ${y + 26} C 280 ${y + 26}, 280 ${cy}, ${cx - 108} ${cy}`} className={styles.svgDim} strokeWidth="2" fill="none" />
      ))}
      <path d={`M236 ${212 + 26} C 290 ${212 + 26}, 290 ${cy}, ${cx - 108} ${cy}`} className={styles.svgAcid} strokeWidth="3" fill="none" />
      {/* Kairo to roles, roles to providers */}
      {roleY.map((y, i) => (
        <path key={`c${y}`} d={`M${cx + 108} ${cy} C 470 ${cy}, 480 ${y + roleH / 2}, ${roleX} ${y + roleH / 2}`} className={i === 1 ? styles.svgAcid : styles.svgDim} strokeWidth={i === 1 ? 3 : 2} fill="none" />
      ))}
      {roleY.map((y) => (
        <g key={`p${y}`}>
          <path d={`M${roleX + roleW} ${y + roleH / 2} C 730 ${y + roleH / 2}, 730 ${claudeY + provH / 2}, ${provX} ${claudeY + provH / 2}`} className={styles.svgDim} strokeWidth="1.6" strokeDasharray="5 7" fill="none" />
          <path d={`M${roleX + roleW} ${y + roleH / 2} C 730 ${y + roleH / 2}, 730 ${codexY + provH / 2}, ${provX} ${codexY + provH / 2}`} className={styles.svgAcid} strokeWidth="2.4" fill="none" />
        </g>
      ))}

      {SAMPLE_TASKS.map((t, i) => (
        <Chip key={t.name} x={40} y={[132, 212, 292][i]} w={196} h={52} name={t.name} role={t.role} />
      ))}
      <Core x={cx} y={cy} r={105} />
      <text x={cx} y="88" textAnchor="middle" className={styles.svgKairo}>Kairo</text>
      <text x={cx} y="362" textAnchor="middle" className={styles.svgMonoAcid}>{ROLE_NOTE.approved}</text>
      <text x={cx} y="384" textAnchor="middle" className={styles.svgMonoSmall}>{ROLE_NOTE.rerouted}</text>

      {ROLES.map((r, i) => (
        <RolePill key={r} x={roleX} y={roleY[i]} w={roleW} h={roleH} name={r} lit />
      ))}

      <Pill id="c" x={provX} y={claudeY} w={210} h={provH} pct={claudePct} state="idle" shape="round" />
      <Pill id="x" x={provX} y={codexY} w={210} h={provH} pct={codexPct} state="lit" shape="hex" />
      <text x={provX} y={claudeY - 14} className={styles.svgName}>{CHANNELS.claude.provider}</text>
      <text x={provX + 210} y={claudeY - 14} textAnchor="end" className={styles.svgMonoDim}>{`5h ${claudePct}%`}</text>
      <text x={provX} y={claudeY + provH + 24} className={styles.svgMonoDim}>{CHANNELS.claude.model}</text>
      <text x={provX} y={claudeY + provH + 46} className={styles.svgMonoDim}>quota out</text>
      <text x={provX} y={codexY - 14} className={styles.svgName}>{CHANNELS.codex.provider}</text>
      <text x={provX + 210} y={codexY - 14} textAnchor="end" className={styles.svgMonoAcid}>{`5h ${codexPct}%`}</text>
      <text x={provX} y={codexY + provH + 24} className={styles.svgMono}>{CHANNELS.codex.model}</text>
      <text x={provX} y={codexY + provH + 46} className={styles.svgMonoAcid}>takes over</text>

      <Denied x={40} y={436} small={false} />
      <text x="40" y="498" className={styles.svgMonoDim}>{CAPTION.illustrative}</text>
    </svg>
  );
}

function Portrait() {
  const cx = 130;
  const cy = 250;
  return (
    <svg
      className={styles.svgTall}
      viewBox="0 0 460 760"
      role="img"
      aria-label={SVG_LABEL}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{SVG_LABEL}</title>
      {SAMPLE_TASKS.map((t, i) => (
        <Chip key={t.name} x={34} y={14 + i * 58} w={392} h={50} name={t.name} role={t.role} />
      ))}
      <path d={`M${cx} 188 V ${cy - 72}`} className={styles.svgAcid} strokeWidth="3" fill="none" />
      <Core x={cx} y={cy} r={68} />
      <text x="228" y="244" className={styles.svgKairoSmall}>Kairo</text>
      <text x="228" y="272" className={styles.svgMonoAcid}>{ROLE_NOTE.approved}</text>
      <text x="228" y="294" className={styles.svgMonoSmall}>same roles,</text>
      <text x="228" y="312" className={styles.svgMonoSmall}>Codex takes over</text>

      {ROLES.map((r, i) => (
        <RolePill key={r} x={34 + (i % 2) * 208} y={344 + Math.floor(i / 2) * 52} w={184} h={42} name={r} lit />
      ))}
      <path d="M130 328 V 344 M334 328 V 344" className={styles.svgAcid} strokeWidth="2.4" fill="none" />
      <path d="M130 438 V 452 M334 438 V 452" className={styles.svgAcid} strokeWidth="2.4" fill="none" />

      <Pill id="pc" x={34} y={478} w={392} h={50} pct={claudePct} state="idle" shape="round" />
      <Pill id="px" x={34} y={586} w={392} h={50} pct={codexPct} state="lit" shape="hex" />
      <text x="34" y="468" className={styles.svgName}>{CHANNELS.claude.provider}</text>
      <text x="426" y="468" textAnchor="end" className={styles.svgMonoSmall}>{`5h ${claudePct}% · quota out`}</text>
      <text x="34" y="576" className={styles.svgName}>{CHANNELS.codex.provider}</text>
      <text x="426" y="576" textAnchor="end" className={styles.svgMonoAcid}>{`5h ${codexPct}% · takes over`}</text>

      <Denied x={34} y={676} small />
      <text x="34" y="724" className={styles.svgMonoSmall}>Illustrative: Claude 5h quota runs out.</text>
      <text x="34" y="744" className={styles.svgMonoSmall}>Codex: pacing sample, 2026-11-05</text>
    </svg>
  );
}

export default function StaticSystem({ hidden }: Props) {
  return (
    <div className={styles.staticWrap} aria-hidden={hidden || undefined}>
      <Landscape />
      <Portrait />
    </div>
  );
}
