// Data for the home's personal hero and the Work section. Nothing here is
// invented: names, companies, roles, links and years come from PROJECTS
// (prototype/map/data.ts) and CAREER_ROWS (career.ts), and screens come from
// the SHOTS mapping in ringData.ts.

import { CONTACT_HREF, COPY, CV_HREF } from '@/components/prototype/kairo/data';
import { AREAS, PROJECTS } from '@/components/prototype/map/data';

import { AXIS_END, AXIS_START, CAREER_ROWS } from './career';
import { label } from './ringData';

import type {
  AreaId,
  MapProject,
  Platform,
  WorkGroup,
} from '@/components/prototype/map/data';

export { CONTACT_HREF, COPY, CV_HREF };

// ---- Hero ----

// Software employers only, from the career rows. Faurecia and Miga were not
// software roles, and Kairo is covered by its own section.
const SOFTWARE_ROWS: { id: string; name: string }[] = [
  { id: 'ensamble', name: 'Ensamble' },
  { id: 'kc', name: 'Grupo KC' },
  { id: 'lumston', name: 'Lumston' },
  { id: 'lemu', name: 'Lemu' },
];

export const WORKED_FOR = SOFTWARE_ROWS.filter((entry) =>
  CAREER_ROWS.some((row) => row.id === entry.id)
).map((entry) => entry.name);

// The first software role (Grupo KC row) gives the "since" year.
const firstSoftware = CAREER_ROWS.filter((row) =>
  SOFTWARE_ROWS.some((entry) => entry.id === row.id)
).reduce((a, b) => (a.from <= b.from ? a : b));

export const SOFTWARE_SINCE = Math.floor(
  AXIS_START + firstSoftware.from * (AXIS_END - AXIS_START) + 1e-6
);

export const PROJECT_COUNT = PROJECTS.length;

// ---- Work ----
//
// The section has three parts, all derived from PROJECTS:
//   1. The bench: a handful of projects with a large screen and the detail of
//      the chosen one.
//   2. The stack strip: every technology with its real count, used to light up
//      the projects that use it across the bench and the map.
//   3. The map: every other project as a node, grouped by who it was built for,
//      with an inspector for the chosen one.

const AREA_SHORT = new Map<AreaId, string>(AREAS.map((a) => [a.id, a.short]));

// ---- Screens ----

/**
 * How a screen is framed. `browser` and `phone` get a frame drawn in CSS from
 * the project's platform; `native` is a capture that already contains its own
 * device, so it is shown as it is.
 */
export type ShotKind = 'browser' | 'phone' | 'native';

export type WorkShot = {
  src: string;
  /** Small file for the map tiles. */
  thumb: string;
  /** Natural size of `src` and of `thumb`: a screen is never shown larger. */
  w: number;
  h: number;
  tw: number;
  th: number;
  kind: ShotKind;
};

const HOME = '/assets/images/home';

// WebP derivatives made for this section in public/assets/images/home, rebuilt
// from the best original of each screen: `work-<id>.webp` is the full file (up
// to 2000 px wide for web screens, the original size for phones) and
// `work-<id>-t.webp` the thumbnail (720 px wide for web, 400 px tall for
// phones). Originals are the owner's own captures (shared on 2026-11-06 and
// kept in public/assets/projects) plus one snapshot of a project's own public
// page; every screen is mock data, shown with his permission.
const shot = (
  file: string,
  w: number,
  h: number,
  kind: ShotKind = 'browser'
): WorkShot => {
  const web = kind === 'browser';
  const fw = web ? Math.min(2000, w) : w;
  const fh = Math.round((h * fw) / w);
  const tw = web ? Math.min(720, fw) : Math.round((w * Math.min(400, h)) / h);
  const th = web ? Math.round((fh * tw) / fw) : Math.min(400, h);
  return {
    src: `${HOME}/work-${file}.webp`,
    thumb: `${HOME}/work-${file}-t.webp`,
    w: fw,
    h: fh,
    tw,
    th,
    kind,
  };
};

const set = (
  id: string,
  kind: ShotKind,
  sizes: [number, number][]
): WorkShot[] =>
  sizes.map(([w, h], i) =>
    shot(sizes.length > 1 ? `${id}-${i + 1}` : `${id}-1`, w, h, kind)
  );

// Screens per project: a web screen is one; phone projects show up to three
// distinct real screens side by side. Login-only screens (Volaris, Acolyte, the
// NEXUS login) are out. Projects not listed here have no real image and get a
// schematic in the inspector.
export const WORK_SHOTS = new Map<string, WorkShot[]>([
  ['ari-maya-ai-business-platform', [shot('ari-maya', 1427, 1236)]],
  ['crm-comercial', [shot('crm-comercial', 1456, 920)]],
  ['atlas', [shot('atlas', 1805, 1217)]],
  ['segunnet', [shot('segunnet', 1360, 635)]],
  ['seguros-kc', [shot('seguros-kc', 1816, 1220)]],
  ['titan', [shot('titan', 2880, 1444)]],
  ['maximus', [shot('maximus', 1830, 1115)]],
  ['portal-bi', [shot('portal-bi', 1358, 634)]],
  ['nexus-riesgos-amparados', [shot('nexus', 1813, 1204)]],
  ['prometeo', [shot('prometeo', 1822, 1221)]],
  ['solcredito-autos', [shot('solcredito-autos', 1823, 1213)]],
  ['grupo-kc-corporate-site', [shot('grupo-kc-site', 1818, 1221)]],
  ['alianza-red-magisterial', [shot('alianza-red-magisterial', 1818, 1224)]],
  ['github-search', [shot('github-search', 2534, 1318)]],
  ['dashboard-next14', [shot('dashboard-next14', 2870, 1536)]],
  ['vacunas', [shot('vacunas', 1351, 621)]],
  ['admin-vacunas', [shot('admin-vacunas', 1360, 630)]],
  ['batalla-vs-thanos', [shot('batalla-vs-thanos', 2546, 1314)]],
  ['cva-church-page', [shot('cva', 2880, 1800)]],
  ['getmore-homepage-layout', [shot('getmore', 2880, 1800)]],
  ['portfolio-site', [shot('portafolio', 2880, 1800)]],
  ['volaris-analytics', [shot('volaris-analytics', 2878, 1450)]],
  ['acolyte-health', [shot('acolyte-health', 840, 700)]],
  [
    'red-medica',
    set('red-medica', 'phone', [
      [720, 1600],
      [720, 1600],
      [720, 1600],
    ]),
  ],
  [
    'eos-mobile',
    set('eos-mobile', 'native', [
      [672, 1316],
      [678, 1312],
      [662, 1304],
    ]),
  ],
  [
    'card-tu-agente',
    set('card-tu-agente', 'native', [
      [722, 1434],
      [363, 765],
    ]),
  ],
  ['crm-mobile', set('crm-mobile', 'native', [[451, 926]])],
  [
    'cinemapedia',
    set('cinemapedia', 'phone', [
      [288, 625],
      [286, 631],
      [290, 642],
    ]),
  ],
  [
    'atlas-de-la-biodiversidad',
    set('atlas-biodiversidad', 'phone', [
      [186, 373],
      [218, 451],
      [219, 442],
    ]),
  ],
]);

// ---- Schematics ----

/**
 * A schematic is a diagram of what a project does, drawn in SVG, for projects
 * with no screen. Every label is a stated fact (what the project is, what it
 * is built with, what it connects). Nothing imitates a product screen.
 *   flow: stages left to right, each a column of nodes; an optional rail of
 *         supporting nodes hangs below.
 *   hub:  one node with its parts around it.
 */
export type Schematic =
  | {
      variant: 'flow';
      stages: string[][];
      rail?: string[];
      railLabel?: string;
    }
  | { variant: 'hub'; hub: string; branches: string[] };

export const PLATFORM_LABEL: Record<Platform, string> = {
  mobile: 'Mobile app',
  web: 'Web app',
  api: 'API',
  cli: 'CLI tool',
  widget: 'Widget',
  desktop: 'Desktop app',
};

/** The short mark printed on a tile that has no screen. */
export const KIND_MARK: Record<Platform, string> = {
  mobile: 'MOBILE',
  web: 'WEB',
  api: 'API',
  cli: 'CLI',
  widget: 'WIDGET',
  desktop: 'DESKTOP',
};

// Facts per project, from the owner's descriptions and each project's own
// documentation and manifests (2026-11-06). Projects absent here get a hub of
// their platform and stack.
const SCHEMATICS: Record<string, Schematic> = {
  'kairo-runtime': {
    variant: 'flow',
    stages: [['Work'], ['Kairo'], ['Claude Code', 'Codex', 'OpenCode']],
    rail: ['Quota', 'Cost'],
    railLabel: 'routes by',
  },
  'maze-chase-2d-level-editor': {
    variant: 'flow',
    stages: [['Level editor', 'Game'], ['Vue'], ['Python'], ['JSON']],
  },
  'ai-talent-and-initiative-platform': {
    variant: 'flow',
    stages: [['Internal web'], ['React', 'Vite'], ['Supabase']],
  },
  'kc-coding-harness': {
    variant: 'flow',
    stages: [
      ['Claude plugin marketplace'],
      ['Team setup'],
      ['macOS', 'Linux', 'Windows'],
    ],
  },
  'digital-insurance-widget': {
    variant: 'flow',
    stages: [['Año'], ['Marca'], ['Modelo'], ['Versión'], ['Datos']],
    rail: ['HTML', 'React', 'Vue'],
    railLabel: 'embed via',
  },
  'reports-api': {
    variant: 'flow',
    stages: [['Client'], ['Fastify'], ['PDFMake', 'ExcelJS', 'QuickChart']],
    rail: ['Redis'],
    railLabel: 'rate limiting',
  },
  'notifications-api': {
    variant: 'flow',
    stages: [['Client'], ['Fastify'], ['WhatsApp', 'Email']],
    rail: ['PostgreSQL', 'Drizzle ORM'],
  },
  'single-sign-on': {
    variant: 'flow',
    stages: [['User'], ['Express'], ['Several systems']],
  },
  'testing-center': {
    variant: 'flow',
    stages: [['Web shell'], ['Testing modules']],
    rail: ['Vite', 'React'],
    railLabel: 'built with',
  },
};

// ---- Lines ----

// One-line descriptions where the facts say more than the shared blurb. Only
// stated facts; the rest use the blurb.
const WORK_LINES: Record<string, string> = {
  'maze-chase-2d-level-editor':
    'Level editor and game: a Vue frontend over a Python backend with JSON persistence.',
  'ai-talent-and-initiative-platform':
    'Internal web platform for talent and initiatives, built with React, Vite and Supabase.',
  'kc-coding-harness':
    'Command-line tooling: a Claude plugin marketplace for the team, with setup on macOS, Linux and Windows.',
  'digital-insurance-widget':
    'Embeddable widget for digital insurance: steps Año, Marca, Modelo, Versión and Datos, embedded via HTML, React or Vue.',
  'reports-api':
    'Fastify API that generates PDF and Excel reports and charts, with Redis rate limiting.',
  'notifications-api':
    'Fastify API for WhatsApp and email notifications, with PostgreSQL and Drizzle.',
  'crm-mobile': 'Offline PWA of the commercial CRM: opportunities and tasks.',
  cinemapedia:
    'Flutter movie and series directory on the TMDB API: favorites, and movie detail with cast and trailer.',
};

// ---- Items ----

export type WorkItem = {
  project: MapProject;
  name: string;
  /** Who it was built for, then its area: stated facts only. */
  meta: string;
  /** What it is. */
  line: string;
  /** Role as stated, else how the project relates to Sam; empty when neither. */
  role: string;
  /** Present only when proyects.ts states an impact. */
  impact?: string;
  area: string;
  platform: string;
  stack: string[];
  /** Commits by the owner on the default branch; absent when unknown. */
  commits?: number;
  /** Short mark for tiles with no screen: API, CLI, WEB... */
  mark: string;
  /** Real screens, up to three; empty when the project has none. */
  shots: WorkShot[];
  /** The first screen, for sizing and framing. */
  shot?: WorkShot;
  /** Platform and area in words a visitor reads, e.g. "Web app · Insurance". */
  tag: string;
  /** Plain one-liner for projects with no screen (about 8 words). */
  short: string;
  /** Always set when there is no screen. */
  schematic?: Schematic;
};

const COMPANY_LABEL: Record<string, string> = { KC: 'Grupo KC', LEMU: 'Lemu' };

const relationLabel = (p: MapProject) => {
  if (p.relation === 'own') return 'Own project';
  if (p.relation === 'contribution') return 'Contribution';
  return '';
};

// The line a project shows: a fact-based override where there is one, else its
// own blurb.
const lineOf = (p: MapProject) => WORK_LINES[p.id] ?? p.blurb;

const autoSchematic = (p: MapProject): Schematic => ({
  variant: 'hub',
  hub: PLATFORM_LABEL[p.platform ?? 'web'],
  branches: p.stack ?? [],
});

// The area adds nothing when it only repeats the platform.
const areaWords = (p: MapProject) => {
  const area = AREA_SHORT.get(p.area) ?? '';
  return area === 'Web' || area === 'Mobile' ? '' : area;
};

// One plain line for a project with no screen, from its own blurb and facts.
const SHORT_LINES: Record<string, string> = {
  'help-desk': 'Internal help desk web app',
  'desktop-ai-assistant': 'Desktop app for an AI assistant',
  'employee-benefits-app': 'Mobile app for employee benefits',
  'single-sign-on': 'One sign-in across several systems',
  'pizza-ordering-app': 'Pizza menu, discounts and orders',
  'repository-explorer': 'GitHub repositories, infinite scroll',
  'map-and-charts-spa': 'Map and charts, multi-page SPA',
  'portfolio-site': 'This portfolio, in the open',
  'kairo-runtime': 'Routes work between AI coding agents',
  'maze-chase-2d-level-editor': 'Level editor and game',
  'ai-talent-and-initiative-platform': 'AI platform for talent and initiatives',
  'kc-coding-harness': 'Coding harness for AI-assisted engineering',
  'digital-insurance-widget': 'Widget for digital insurance',
  'reports-api': 'API that generates PDF and Excel reports',
  'notifications-api': 'API for WhatsApp and email notifications',
  'testing-center': 'Web shell that embeds testing modules',
};

const toItem = (project: MapProject): WorkItem => {
  const company = project.company
    ? COMPANY_LABEL[project.company] ?? project.company
    : undefined;
  const shots = WORK_SHOTS.get(project.id) ?? [];
  const platform = PLATFORM_LABEL[project.platform ?? 'web'];
  return {
    project,
    name: label(project),
    meta: [company ?? project.group, areaWords(project)]
      .filter(Boolean)
      .join(' · '),
    line: lineOf(project),
    role: project.role ?? relationLabel(project),
    impact: project.impact,
    area: AREA_SHORT.get(project.area) ?? '',
    platform,
    commits: project.commits,
    mark: KIND_MARK[project.platform ?? 'web'],
    stack: project.stack ?? [],
    shots,
    shot: shots[0],
    tag: [platform, areaWords(project)].filter(Boolean).join(' · '),
    short: SHORT_LINES[project.id] ?? lineOf(project),
    schematic: shots.length
      ? undefined
      : SCHEMATICS[project.id] ?? autoSchematic(project),
  };
};

export function usesAny(project: MapProject, selected: string[]) {
  return (
    selected.length === 0 ||
    (project.stack ?? []).some((t) => selected.includes(t))
  );
}

const groupOf = (p: MapProject): WorkGroup => p.group ?? 'Grupo KC';

/** "221 commits" for a project that has a count; nothing otherwise. */
export const commitsLabel = (item: { commits?: number }) =>
  item.commits
    ? `${item.commits} ${item.commits === 1 ? 'commit' : 'commits'}`
    : '';

// Real contribution first: most commits, then those with no known count (they
// have no accessible repository), then more stack, then name.
export const byContribution = (a: WorkItem, b: WorkItem) =>
  (b.commits ?? 0) - (a.commits ?? 0) ||
  b.stack.length - a.stack.length ||
  a.name.localeCompare(b.name);

const ALL_ITEMS = PROJECTS.map(toItem);

// The bench: the eight projects with a real screen and the most commits,
// highest first. One backend exception, named by the owner: Kairo has no
// screen, yet it takes its place by commits, drawn as its schematic.
const BENCH_WITHOUT_SCREEN = new Set(['kairo-runtime']);
export const BENCH: WorkItem[] = ALL_ITEMS.filter(
  (i) => i.shots.length > 0 || BENCH_WITHOUT_SCREEN.has(i.project.id)
)
  .sort(byContribution)
  .slice(0, 8);

const onBench = new Set<string>(BENCH.map((i) => i.project.id));

export type ArchiveGroup = {
  group: WorkGroup;
  items: WorkItem[];
  /** Commits of the projects in this company, where known; 0 when none. */
  commits: number;
  /** The technologies most of its projects use. */
  techs: string[];
};

const topTechs = (items: WorkItem[]) => {
  const counts = new Map<string, number>();
  items.forEach((i) =>
    i.stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
  );
  return Array.from(counts, ([name, n]) => ({ name, n }))
    .sort((a, b) => b.n - a.n || a.name.localeCompare(b.name))
    .slice(0, 3)
    .map((t) => t.name);
};

const GROUPS: WorkGroup[] = [
  'Grupo KC',
  'Personal',
  'Ensamble',
  'Lumston',
  'Lemu',
];

// Every project not on the bench, by company (most commits first), and inside
// a company by commits.
export const ARCHIVE: ArchiveGroup[] = GROUPS.map((group) => ({
  group,
  items: ALL_ITEMS.filter(
    (i) => !onBench.has(i.project.id) && groupOf(i.project) === group
  ).sort(byContribution),
  commits: 0,
  techs: [] as string[],
}))
  .filter((entry) => entry.items.length > 0)
  .map((entry) => ({
    ...entry,
    commits: entry.items.reduce((n, i) => n + (i.commits ?? 0), 0),
    techs: topTechs(entry.items),
  }))
  // Companies by total commits (of what the panel holds), then project count.
  .sort((a, b) => b.commits - a.commits || b.items.length - a.items.length);

export const ARCHIVE_COUNT = ARCHIVE.reduce((n, g) => n + g.items.length, 0);

/**
 * Matches first: the projects that use a picked technology come before the
 * rest, each part keeping its own (contribution) order. With nothing picked
 * the list is returned as it is.
 */
export const orderBy = (items: WorkItem[], selected: string[]) => {
  if (selected.length === 0) return items;
  const hit = items.filter((i) => usesAny(i.project, selected));
  const rest = items.filter((i) => !usesAny(i.project, selected));
  return [...hit, ...rest];
};

// ---- Stack ----

export type Tech = { name: string; count: number };

/** Every technology, most used first, with the number of projects using it. */
export const TECHS: Tech[] = (() => {
  const counts = new Map<string, number>();
  PROJECTS.forEach((p) =>
    (p.stack ?? []).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
  );
  return Array.from(counts, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  );
})();

/** How many technologies the strip shows before the rest. */
export const TECH_HEAD = 12;

/** Joins display parts with a dot, dropping empty parts and repeats. */
export const dots = (...parts: (string | number | null | undefined)[]) => {
  const seen = new Set<string>();
  const out: string[] = [];
  parts
    .filter((p): p is string | number => p != null && p !== '')
    .flatMap((p) => String(p).split(' · '))
    .forEach((p) => {
      const key = p.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(p);
      }
    });
  return out.join(' · ');
};

// ---- Hero and GitHub ----

/** The hero statement. */
export const HERO_STATEMENT =
  'I build production software end to end: insurance platforms, mobile apps and tools that put AI agents to work.';

/** The core of a full-stack profile; each one is in the project data. */
export const CORE_STACK = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'PostgreSQL',
  'Flutter',
].filter((name) => TECHS.some((t) => t.name === name));

/**
 * Aggregates read from GitHub with `gh` (read-only) on 2026-11-06 and kept as
 * constants: no call happens at runtime and no token reaches the client. Only
 * counts and byte totals are kept; no repository name, URL or description.
 *  - contributions: the viewer's contribution calendar totals per calendar year
 *    (private contributions count as numbers); `lastYear` is the default
 *    12-month window, the one the career graph prints.
 *  - repositories: owned and organisation repositories reachable with that
 *    account, forks excluded (a fork of another author's project is never
 *    counted). Four that are not projects of their own are left out of the
 *    count and of the language totals: a backup copy of another repository,
 *    a copy of a single-sign-on repository, an empty vault and the profile
 *    readme.
 *  - languages: bytes by language across those repositories, from the
 *    languages API; `rest` is everything below the listed ones.
 */
export const GITHUB = {
  asOf: '2026-11-06',
  contributions: {
    2023: 241,
    2024: 263,
    2025: 376,
    2026: 5428,
    lastYear: 5476,
  },
  repositories: 39,
  languages: [
    { name: 'TypeScript', bytes: 16494375 },
    { name: 'JavaScript', bytes: 12804740 },
    { name: 'HTML', bytes: 1747533 },
    { name: 'Vue', bytes: 1236978 },
    { name: 'Astro', bytes: 950733 },
    { name: 'CSS', bytes: 635629 },
  ],
  total: 35210695,
};

export type LanguageShare = { name: string; percent: number };

/** Each language's share of the bytes, plus the rest. */
export const LANGUAGE_SHARES: LanguageShare[] = (() => {
  const listed = GITHUB.languages.reduce((n, l) => n + l.bytes, 0);
  return [
    ...GITHUB.languages.map((l) => ({
      name: l.name,
      percent: (100 * l.bytes) / GITHUB.total,
    })),
    { name: 'Other', percent: (100 * (GITHUB.total - listed)) / GITHUB.total },
  ];
})();

// ---- Contract with the hero ----

/** Every technology with its project count, most used first. */
export const STACK_COUNTS: { name: string; count: number }[] = TECHS;

/** Contributions in 2026, from the dated GitHub constants. */
export const CONTRIBUTIONS_2026: number = GITHUB.contributions[2026];
