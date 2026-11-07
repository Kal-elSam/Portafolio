// Career rows for the home. Dates come from the owner's resume and LinkedIn
// export (2026-11-06), with month precision. They live here, not in
// contents/work/careerTimeline.ts, because that file also feeds /work/experience
// and still carries older periods. Newest first.

export const AXIS_START = 2018;
export const AXIS_END = 2027;

/** A month as [year, month 1-12]. A period runs from the start of its first
 *  month to the end of its last. */
type Month = readonly [number, number];

type Period = {
  from: Month | number;
  /** `null` means still running. */
  to: Month | number | null;
};

export type CareerRow = {
  id: string;
  company: string;
  role: string;
  years: string;
  /** Position on the axis, 0 to 1. */
  from: number;
  to: number;
  current: boolean;
};

const MONTHS = [
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

// Today (2026-11-06) on the axis, for roles that are still running.
const NOW = 2026 + 10 / 12 + 6 / 365;

const toRatio = (year: number) => (year - AXIS_START) / (AXIS_END - AXIS_START);

const start = (m: Month | number) =>
  typeof m === 'number' ? m : m[0] + (m[1] - 1) / 12;
const end = (m: Month | number) =>
  typeof m === 'number' ? m + 1 : m[0] + m[1] / 12;
const label = (m: Month | number) =>
  typeof m === 'number' ? `${m}` : `${MONTHS[m[1] - 1]} ${m[0]}`;

const row = (
  id: string,
  company: string,
  role: string,
  { from, to }: Period
): CareerRow => ({
  id,
  company,
  role,
  years: `${label(from)} — ${to === null ? 'Present' : label(to)}`,
  from: toRatio(start(from)),
  to: toRatio(to === null ? NOW : end(to)),
  current: to === null,
});

export const CAREER_ROWS: CareerRow[] = [
  row('kairo', 'Kairo and ARI & MAYA', 'Creator', {
    from: 2026,
    to: null,
  }),
  row('lumston', 'Lumston', 'Software Engineer', {
    from: [2025, 1],
    to: [2025, 12],
  }),
  row('lemu', 'Lemu', 'Product Owner & Mobile Engineer', {
    from: [2022, 4],
    to: [2022, 9],
  }),
  row(
    'ensamble',
    'Ensamble Administrador de Riesgos y Sistemas',
    'Software Engineer / Frontend Lead',
    { from: [2021, 9], to: null }
  ),
  row('kc', 'Grupo KC Agente de Seguros', 'Frontend Engineer', {
    from: [2020, 12],
    to: [2022, 7],
  }),
  row('miga', 'Miga Ingeniería', 'Projects Engineer', {
    from: [2018, 9],
    to: [2020, 8],
  }),
  row('faurecia', 'Faurecia', 'Production Supervisor', {
    from: [2018, 1],
    to: [2018, 9],
  }),
];

export const AXIS_YEARS = Array.from(
  { length: AXIS_END - AXIS_START },
  (_, i) => AXIS_START + i
);
