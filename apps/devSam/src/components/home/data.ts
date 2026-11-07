// Home page content that is not a project or a career fact. Every statement
// here is checked against the Kairo README (github.com/Kal-elSam/harness,
// read 2026-11-06), the ARI case study (pages/work/how-i-built-ari.mdx) or the
// CV. Anything illustrative says so on screen.

import { ROLES } from '@/components/prototype/kairo/data';

export const KAIRO_REPO = 'https://github.com/Kal-elSam/harness';
export const GENTLE_AI_REPO =
  'https://github.com/Gentleman-Programming/gentle-ai';
export const KAIRO_COMMAND = 'npx @kal-elsam/kairo-runtime';
export const KAIRO_CASE = '/work/kairo-runtime';
export const ARI_CASE = '/work/how-i-built-ari';

/** Real recorded Kairo pacing sample (quota left, percent). */
export const QUOTA_SAMPLE = {
  date: '2026-11-05',
  claude5h: 82,
  codex5h: 52,
} as const;

export type KairoStepId = 'plan' | 'assign' | 'distribute' | 'fallback';

export type KairoStep = {
  id: KairoStepId;
  title: string;
  /** A few words, condensed from the README. */
  line: string;
};

// Four steps, merged from the README's six: analyze and approve are one
// (a team is proposed, a human approves it), fall back and learn are one
// (quota runs out and work moves; verdicts feed each role's quality).
export const KAIRO_STEPS: KairoStep[] = [
  {
    id: 'plan',
    title: 'Analyze & approve',
    line: 'Reads the project, proposes a team. A human approves it first.',
  },
  { id: 'assign', title: 'Assign', line: 'Each role gets a qualified model.' },
  {
    id: 'distribute',
    title: 'Distribute',
    line: 'Work follows remaining quota.',
  },
  {
    id: 'fallback',
    title: 'Fall back & learn',
    line: "Quota out: the next model steps in. Verdicts feed each role's quality.",
  },
];

export const KAIRO_COMMANDS = {
  analyze: 'kairo team analyze',
  approve: 'kairo team approve',
  learn: 'kairo team verdict --result pass|fail',
} as const;

// ---- AI in action ----

export type ChatLine = {
  id: string;
  from: 'customer' | 'ari';
  text: string;
  /** Stage this line belongs to; shown only on ARI lines. */
  stage?: 'Schedule' | 'Book';
};

/** Illustrative conversation. No real customer, business or result. */
export const CHAT: ChatLine[] = [
  { id: 'c1', from: 'customer', text: 'Hi, are you open Thursday afternoon?' },
  {
    id: 'a1',
    from: 'ari',
    text: 'Yes. 4:00 pm or 5:30 pm is free.',
    stage: 'Schedule',
  },
  { id: 'c2', from: 'customer', text: '4:00 pm.' },
  {
    id: 'a2',
    from: 'ari',
    text: 'Booked for Thursday, 4:00 pm.',
    stage: 'Book',
  },
];

/** Hops of the ARI architecture, from the case study. */
export const ARI_PATH = [
  'WhatsApp',
  'LLM decides',
  'Service layer acts',
  'Google Calendar',
] as const;

/** Role names exactly as the Kairo role registry spells them. Illustrative order. */
export const ROLE_FLOW = ROLES;

// ---- Contact ----

export const CONTACT_LINKS = [
  { label: 'Email', href: 'mailto:samgomezs7@hotmail.com' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/samuel-gomez-serrano/',
  },
  { label: 'GitHub', href: 'https://github.com/Kal-elSam' },
] as const;
