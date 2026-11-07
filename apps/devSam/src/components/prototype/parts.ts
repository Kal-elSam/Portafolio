// Every label below was checked against the public repo
// github.com/Kal-elSam/harness (default branch main, MIT).
// `evidence` is the repository path or README passage backing each claim.

export const COPY = {
  name: 'Samuel Gomez Serrano',
  title: 'Senior Software Engineer | System Architecture & AI Engineering',
  headline: 'I design systems teams can understand, operate, and evolve.',
  subheadline:
    'Enterprise insurance platforms at work. In the open, Kairo Runtime: a control plane that routes AI engineering agents by capability, quota, and cost.',
  closing:
    'Before software, I supervised a production line building exhaust systems for BMW, VW and Toyota. That is why this site draws software as assemblies.',
} as const;

export const HUD = [
  { label: 'npm', value: '@kal-elsam/kairo-runtime' },
  { label: 'source', value: 'github.com/Kal-elSam/harness' },
  { label: 'license', value: 'MIT' },
  { label: 'requires', value: 'Node.js 22.19 or newer' },
] as const;

export type PartKind =
  | 'plugin'
  | 'router'
  | 'capability'
  | 'quota'
  | 'fallback'
  | 'adapters';

export type Fact = { label: string; value: string; code?: boolean };

export type Part = {
  id: PartKind;
  name: string;
  role: string;
  source: string;
  facts: Fact[];
  evidence: string;
};

export const PARTS: Part[] = [
  {
    id: 'plugin',
    name: 'kairo-router plugin',
    role: 'Claude Code plugin: denies non-role agent launches, injects dispatch instructions, adds CodeGraph context.',
    source: 'integrations/claude-code/kairo-router',
    facts: [{ label: 'check', value: 'kairo team check-agent', code: true }],
    evidence:
      'README "Absorbs the hand-built Claude Code hooks"; dir integrations/claude-code/kairo-router',
  },
  {
    id: 'router',
    name: 'Project router',
    role: 'Resolves each role to a real model, checking strategy, model entitlement and provider eligibility.',
    source: 'src/global/team/project-router.js',
    facts: [{ label: 'input', value: 'approved team and provider capacity' }],
    evidence:
      'README "Routes approved project assignments"; header comment of project-router.js',
  },
  {
    id: 'capability',
    name: 'Capability scoring',
    role: 'Scores models per role from percentile-normalized evidence. Missing evidence is never turned into a zero.',
    source: 'src/global/intelligence/capability-scoring.js',
    facts: [
      {
        label: 'outcomes',
        value:
          'after five attributed results, measured success replaces public role fit',
      },
    ],
    evidence:
      'header comment of capability-scoring.js; README "Learns role quality from task outcomes"',
  },
  {
    id: 'quota',
    name: 'Quota pacing',
    role: 'Paces remaining quota against the time left in each reset window. Missing signals stay unknown.',
    source: 'src/global/intelligence/quota-pacing.js',
    facts: [
      {
        label: 'pace',
        value: 'remaining quota / remaining window time',
        code: true,
      },
    ],
    evidence:
      'header comment of quota-pacing.js; README "Tracks provider capacity"',
  },
  {
    id: 'fallback',
    name: 'Fallback',
    role: 'Under quota pressure an eligible fallback is selected, and a role’s fallback stays in that role.',
    source: 'src/global/team/exhaustion.js',
    facts: [
      {
        label: 'detection',
        value:
          'pure classification of provider failure output: no probes, writes or retries',
      },
    ],
    evidence:
      'README "Routes approved project assignments" and "No model hoards project roles"; header comment of exhaustion.js',
  },
  {
    id: 'adapters',
    name: 'Provider adapters',
    role: 'Adapter modules for the agent hosts Kairo works with.',
    source: 'src/global/adapters/',
    facts: [
      {
        label: 'files',
        value: 'claude.js codex.js cursor.js opencode.js pi.js',
        code: true,
      },
    ],
    evidence: 'GitHub contents API listing of src/global/adapters (5 files)',
  },
];

// Outer layers peel away first; inner ones follow.
export const SEPARATION_ORDER = [0, 5, 1, 4, 2, 3];
