import { CONTRIBUTIONS } from '@/contents/index/contributionSnapshot';

import styles from './career.module.css';
import home from './home.module.css';

const COLUMNS = 53;
const ROWS = 7;
const DAY = 86_400_000;
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const first = new Date(`${CONTRIBUTIONS.firstDay}T00:00:00Z`);
// GitHub's calendar starts weeks on Sunday; the first day sits at its weekday.
const offset = first.getUTCDay();

type Cell = { level: number; date: string; count: number } | null;

const CELLS: Cell[] = [
  ...Array.from({ length: offset }, () => null),
  ...CONTRIBUTIONS.levels.split('').map((level, i) => ({
    level: Number(level),
    date: new Date(first.getTime() + i * DAY).toISOString().slice(0, 10),
    count: CONTRIBUTIONS.counts[i],
  })),
];
const PADDED: Cell[] = [
  ...CELLS,
  ...Array.from({ length: COLUMNS * ROWS - CELLS.length }, () => null),
];

// One label per month, on the first week that starts in it, never crowded.
const MONTH_LABELS = (() => {
  const labels: { column: number; name: string }[] = [];
  let lastMonth = -1;
  let lastColumn = -4;
  for (let c = 0; c < COLUMNS; c += 1) {
    const sunday = new Date(first.getTime() + (c * ROWS - offset) * DAY);
    const month = sunday.getUTCMonth();
    if (month !== lastMonth) {
      if (c - lastColumn >= 3) {
        labels.push({ column: c + 1, name: MONTH_NAMES[month] });
        lastColumn = c;
      }
      lastMonth = month;
    }
  }
  return labels;
})();

export default function ContributionGraph() {
  const total = CONTRIBUTIONS.total.toLocaleString('en-US');
  return (
    <figure className={styles.graph}>
      <div data-graph-wrap>
        <div className={`${styles.months} ${home.mono}`} aria-hidden="true">
          {MONTH_LABELS.map((m) => (
            <span key={m.column} style={{ gridColumn: m.column }}>
              {m.name}
            </span>
          ))}
        </div>
        <div
          className={styles.cells}
          role="img"
          aria-label={`Public GitHub contribution graph for the last year, ${total} contributions.`}
          data-graph
        >
          {PADDED.map((cell, i) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={styles.cell}
              data-level={cell ? cell.level : 'none'}
              title={cell ? `${cell.date}: ${cell.count}` : undefined}
            />
          ))}
        </div>
      </div>
      <figcaption className={styles.graphNote}>
        <span>
          <span className={home.mono}>{total}</span> contributions in the last
          year, from{' '}
          <a
            href={CONTRIBUTIONS.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <span className={home.srOnly}> (opens in a new tab)</span>
          </a>
          , read <span className={home.mono}>{CONTRIBUTIONS.readOn}</span>.
        </span>
        <span className={styles.legend} aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={styles.cell} data-level={level} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}
