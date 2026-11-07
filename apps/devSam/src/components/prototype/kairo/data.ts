import { CV_HREF } from '@/contents/index/roleProfiles';

export { CV_HREF };

export const COPY = {
  // Framing of the Kairo section on the home: Kairo is what he is building,
  // after the personal hero and the work.
  building: "What I'm building",
  // The slogan the Kairo section and the README use.
  slogan: 'The right agent for every task.',
  name: 'Samuel Gomez Serrano',
  title: 'Senior Software Engineer | System Architecture & AI Engineering',
  headline: 'I design systems teams can understand, operate, and evolve.',
  // Matches the repository README: Kairo chooses who handles each task, with
  // which model and provider, while keeping available quota in view.
  line: 'Kairo chooses who handles each task and which model, keeping quota in view.',
} as const;

export const REPO_HREF = 'https://github.com/Kal-elSam/harness';
export const CONTACT_HREF = '/work/contact';

/**
 * The one real recorded sample (Kairo pacing, 2026-11-05). Percentages are the
 * quota left in each window. Nothing else in the scene is a measurement.
 */
export const SAMPLE = {
  date: '2026-11-05',
  claude: { h5: 82, week: 92 },
  codex: { h5: 52, week: 47 },
  codexIdleHours: 93,
} as const;

// The two providers that carry work today. Model names are the ones the
// recorded sample and the repository show.
export const CHANNELS = {
  claude: { provider: 'Claude', model: 'claude-sonnet-5-5' },
  codex: { provider: 'Codex', model: 'gpt-6.1-sol' },
} as const;

// Role names from Kairo's role catalog (src/global/intelligence/role-registry.js
// in the harness repo): Explorer, Builder, Test Runner, Reviewer.
export const ROLES = [
  'Explorer',
  'Builder',
  'Test Runner',
  'Reviewer',
] as const;

// Illustrative work items. The role comes WITH the task: Kairo's project router
// never classifies a task into a role (project-router.js), the orchestrator
// hands it in. Kairo then picks the model and provider for that role.
export const TASKS = [
  ['map auth module', 'trace failing call'],
  ['add export endpoint', 'fix date parser'],
  ['run unit suite', 'repro flaky test'],
  ['review diff', 'check migration'],
] as const;

/** Phases of the event, as positions along it (the loop plays it on a timer). */
export const PHASE = {
  /** The loop plays on its own with the sample values. */
  drainStart: 0.1,
  /** Claude 5h quota reaches 0. */
  drainEnd: 0.4,
  /** The diverter swings and new work goes to the fallback. */
  switchStart: 0.42,
  switchEnd: 0.54,
} as const;

/** Where the reduced-motion still and the static drawing sit (after the switch). */
export const STILL_PROGRESS = 0.58;

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Claude 5h quota left, 0..1. Real sample at rest, then an illustrative drain. */
export const claudeQuota = (p: number) =>
  (SAMPLE.claude.h5 / 100) *
  (1 - smoothstep(PHASE.drainStart, PHASE.drainEnd, p));

export const codexQuota = () => SAMPLE.codex.h5 / 100;

/** 0 while the first channel carries the work, 1 once the fallback does. */
export const routeAt = (p: number) =>
  smoothstep(PHASE.switchStart, PHASE.switchEnd, p);

export const LABEL_KEYS = [
  'kairo',
  'role0',
  'role1',
  'role2',
  'role3',
  'claude',
  'codex',
  'deny',
  't0',
  't1',
  't2',
] as const;
export type LabelKey = (typeof LABEL_KEYS)[number];

/** Share of work that goes to Claude, from each provider's remaining 5h quota. */
export const claudeShare = (p: number) => {
  const c = claudeQuota(p);
  const x = codexQuota();
  return c + x > 0 ? c / (c + x) : 0;
};

export const CAPTION = {
  sample: 'Pacing sample, 2026-11-05 · routing is illustrative',
  illustrative:
    'Illustrative: Claude 5h quota runs out · Codex: pacing sample, 2026-11-05',
} as const;

export const ROLE_NOTE = {
  approved: 'approved team',
  rerouted: 'same roles, Codex takes over',
} as const;

export const DENY = {
  title: 'Denied',
  detail: 'unlisted agent · kairo team check-agent',
} as const;

export const SVG_LABEL =
  'Kairo receives work items, each with a role: Explorer, Builder, Test Runner or Reviewer. It splits the work across two AI providers, Claude and Codex, by remaining quota, and denies an agent that is not in the approved team. When Claude quota runs out, the same roles continue on Codex. Illustrative, with the quota values from a pacing sample of 2026-11-05.';
