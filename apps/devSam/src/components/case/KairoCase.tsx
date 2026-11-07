import Link from 'next/link';
import { useId, useRef, useState } from 'react';

import { ROLES } from '@/components/prototype/kairo/data';

import CaseShell from './CaseShell';
import CodeBlock from './CodeBlock';
import StepTrack from './StepTrack';
import { useJs } from './useCase';

import type { Step } from './StepTrack';

import shared from './case.module.css';
import styles from './kairoCase.module.css';

const REPO = 'https://github.com/Kal-elSam/harness';
const NPM = 'https://www.npmjs.com/package/@kal-elsam/kairo-runtime';

const SECTIONS = [
  { id: 'top', label: 'Overview' },
  { id: 'why', label: 'Why I built it' },
  { id: 'principles', label: 'Principles' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'team', label: 'How a team runs' },
  { id: 'discipline', label: 'Discipline' },
  { id: 'try', label: 'Try it' },
];

const AGENTS = ['Cursor', 'Codex', 'Claude', 'Gemini', 'Copilot'];
const CONFIGS = ['AGENTS.md', '.cursor/rules', '.codex/skills', 'CLAUDE.md'];

const PRINCIPLES = [
  {
    name: 'Agent-agnostic',
    text: 'Works across Cursor, Codex, Claude, Gemini, and Copilot instead of locking into one vendor.',
  },
  {
    name: 'Non-destructive',
    text: 'Writes managed, clearly-bounded sections into existing configs; every change is reversible (--dry-run, rollback).',
  },
  {
    name: 'SDD + TDD by default',
    text: 'Spec-driven development and test-driven workflows are built into the governance model, not bolted on.',
  },
  {
    name: 'Terminal-first',
    text: 'A full Ink/React control center (Overview, Governance, Activity, Orchestration, Usage, Settings) instead of a one-shot script.',
  },
  {
    name: 'Honest usage data',
    text: 'The Usage panel only reports measured token/budget data; it never invents totals or savings.',
  },
  {
    name: 'Continuous health',
    text: 'status, sync, doctor, and opt-in monitor keep the setup from silently drifting.',
  },
];

type Layer = {
  id: string;
  label: string;
  detail: string;
  items?: string[];
};

const LAYERS: Layer[] = [
  {
    id: 'cli',
    label: 'kairo CLI',
    detail: 'Terminal entry point — setup, status, sync, doctor, monitor.',
  },
  {
    id: 'detect',
    label: 'Agent detection',
    detail: 'Scans the machine for the AI coding agents already in use.',
    items: AGENTS,
  },
  {
    id: 'write',
    label: 'Managed config sections',
    detail: 'Writes bounded, reversible sections into each agent config.',
    items: CONFIGS,
  },
  {
    id: 'control-plane',
    label: '~/.harness control plane',
    detail:
      'Local state, governance store, and alert history shared across projects.',
  },
  {
    id: 'loop',
    label: 'Continuous governance loop',
    detail: 'status → sync → doctor → monitor keeps every project aligned.',
  },
];

// The team run, from the Kairo README. Roles are shown in the registry's
// spelling; their order here is illustrative.
const TEAM_STEPS: Step[] = [
  {
    title: 'Analyze',
    cmd: 'kairo team analyze',
    line: 'Reads the project, proposes a team.',
  },
  {
    title: 'Approve',
    cmd: 'kairo team approve',
    line: 'A human approves it first.',
  },
  { title: 'Assign', line: 'Each role gets a qualified model.' },
  { title: 'Distribute', line: 'Work follows remaining quota.' },
  { title: 'Fall back', line: 'Quota out: the next model steps in.' },
  {
    title: 'Learn',
    cmd: 'kairo team verdict --result pass|fail',
    line: "Verdicts feed each role's quality.",
  },
];

const PIPELINE: Step[] = [
  { title: 'Requirement' },
  { title: 'Spec' },
  { title: 'Plan' },
  { title: 'Tests' },
  { title: 'Implementation' },
  { title: 'Validation' },
  { title: 'Review' },
  { title: 'Human approval' },
];

const STACK = [
  'Node.js (ESM, >=20.12)',
  'TypeScript',
  'Ink + React (terminal UI)',
  '@clack/prompts',
];

const reveal = (ms = 0) => ({ '--rd': `${ms}ms` } as React.CSSProperties);

/** What the runtime touches, from the article: the agents it detects on the
 * left, the managed sections it writes on the right. */
function RuntimeMap() {
  return (
    <figure
      className={styles.map}
      aria-label="Kairo detects the AI coding agents on the machine and writes managed, reversible sections into their configs"
    >
      <div className={styles.mapCol}>
        <p className={`${styles.mapTag} ${shared.mono}`}>detects</p>
        <ul className={`${styles.mapList} ${styles.mapIn}`}>
          {AGENTS.map((a) => (
            <li key={a} className={shared.mono}>
              {a}
            </li>
          ))}
        </ul>
      </div>
      <span className={styles.wire} aria-hidden="true" />
      <div className={`${styles.core} ${shared.cut}`}>
        <span className={`${styles.coreName} ${shared.mono}`}>kairo</span>
        <span className={`${styles.coreSub} ${shared.mono}`}>
          setup · status · sync · doctor · monitor
        </span>
      </div>
      <span className={styles.wire} aria-hidden="true" />
      <div className={styles.mapCol}>
        <p className={`${styles.mapTag} ${shared.mono}`}>writes</p>
        <ul className={`${styles.mapList} ${styles.mapOut}`}>
          {CONFIGS.map((c) => (
            <li key={c} className={shared.mono}>
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className={`${styles.plane} ${shared.mono}`}>
        <span className={styles.planeName}>~/.harness</span>
        <span>local state · governance store · alert history</span>
      </div>
      <p className={`${styles.loop} ${shared.mono}`}>
        status → sync → doctor → monitor
      </p>
      <figcaption className={`${styles.mapNote} ${shared.mono}`}>
        managed · bounded · reversible · --dry-run · rollback
      </figcaption>
    </figure>
  );
}

/** Five layers as a tab list: pick one, read it. Without scripts every layer
 * is shown as its own card. */
function LayerStack() {
  const js = useJs();
  const base = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (event: React.KeyboardEvent, i: number) => {
    let next = i;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = (i + 1) % LAYERS.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = (i - 1 + LAYERS.length) % LAYERS.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = LAYERS.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className={styles.layers} data-js={js ? '1' : '0'}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Architecture layers"
        aria-orientation="vertical"
      >
        {LAYERS.map((layer, i) => (
          <button
            key={layer.id}
            ref={(node) => {
              tabs.current[i] = node;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${layer.id}`}
            aria-selected={active === i}
            aria-controls={`${base}-panel-${layer.id}`}
            tabIndex={active === i ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(i)}
            onKeyDown={(event) => move(event, i)}
          >
            <span className={`${styles.tabNo} ${shared.mono}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={styles.tabLabel}>{layer.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.panels}>
        {LAYERS.map((layer, i) => (
          <article
            key={layer.id}
            role={js ? 'tabpanel' : undefined}
            id={`${base}-panel-${layer.id}`}
            aria-labelledby={js ? `${base}-tab-${layer.id}` : undefined}
            hidden={js && active !== i}
            className={`${styles.panel} ${shared.cut}`}
          >
            <p className={`${styles.panelNo} ${shared.mono}`}>
              layer {String(i + 1).padStart(2, '0')} /{' '}
              {String(LAYERS.length).padStart(2, '0')}
            </p>
            <span
              className={`${styles.panelBig} ${shared.mono}`}
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.panelTitle}>{layer.label}</h3>
            <p className={styles.panelText}>{layer.detail}</p>
            {layer.items ? (
              <ul className={shared.chips}>
                {layer.items.map((item) => (
                  <li key={item} className={shared.chip}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

export default function KairoCase() {
  return (
    <CaseShell
      meta={{
        title: 'Kairo',
        description:
          'A published local agent operating system governing spec-driven and test-driven workflows across AI coding agents.',
        caption: 'Open Source',
      }}
      sections={SECTIONS}
      next={{
        href: '/work/how-i-built-ari',
        kicker: 'Next case · Architecture',
        title: 'How I built ARI',
        line: 'An AI business assistant connecting WhatsApp, LLMs, and calendar booking.',
      }}
    >
      {/* ---------- overview ---------- */}
      <section id="top" className={styles.hero} aria-labelledby="case-title">
        <div className={`${shared.wrap} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p
              className={`${styles.eyebrow} ${shared.mono} ${shared.rise}`}
              style={{ '--d': '0ms' } as React.CSSProperties}
            >
              Open Source · @kal-elsam/kairo-runtime
            </p>
            <h1
              id="case-title"
              className={`${styles.name} ${shared.rise}`}
              style={{ '--d': '80ms' } as React.CSSProperties}
            >
              Kairo
              <span className={styles.cursor} aria-hidden="true" />
            </h1>
            <p
              className={`${styles.heroLine} ${shared.rise}`}
              style={{ '--d': '180ms' } as React.CSSProperties}
            >
              A local agent operating system — not an installer that dumps
              templates.
            </p>
            <ul
              className={`${shared.chips} ${shared.rise}`}
              style={{ '--d': '260ms' } as React.CSSProperties}
              aria-label="Stack"
            >
              {['Node.js', 'TypeScript', 'Ink + React', '@clack/prompts'].map(
                (s) => (
                  <li key={s} className={shared.chip}>
                    {s}
                  </li>
                )
              )}
            </ul>
            <p
              className={`${shared.links} ${shared.rise}`}
              style={{ '--d': '340ms' } as React.CSSProperties}
            >
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer nofollow"
                className={shared.cta}
              >
                View on GitHub
              </a>
              <a
                href={NPM}
                target="_blank"
                rel="noreferrer nofollow"
                className={shared.ghost}
              >
                View on npm
              </a>
            </p>
          </div>
          <div
            className={shared.rise}
            style={{ '--d': '300ms' } as React.CSSProperties}
          >
            <RuntimeMap />
          </div>
        </div>
      </section>

      {/* ---------- why ---------- */}
      <section id="why" className={shared.section} aria-labelledby="why-title">
        <div className={shared.wrap}>
          <p className={shared.kicker}>01 · Why I built it</p>
          <h2 id="why-title" className={shared.srOnly}>
            Why I built it
          </h2>
          <p className={styles.statement} data-reveal="">
            <strong>Kairo</strong> (<code>@kal-elsam/kairo-runtime</code>) is a
            local agent operating system — not an installer that dumps
            templates. It <em>detects</em> the AI coding agents you already use,{' '}
            <em>writes</em> managed and reversible sections into their configs,
            and <em>keeps that ecosystem healthy</em> with status checks, sync,
            doctor diagnostics, and rollback.
          </p>
          <div
            className={`${shared.pair} ${shared.prose}`}
            style={reveal(80)}
            data-reveal=""
          >
            <div className={shared.pairSide} data-kind="problem">
              <p className={shared.pairTag}>Problem</p>
              <p>
                Every project I run with AI coding agents (Cursor, Codex,
                Claude, Gemini, Copilot) needs the same governance: consistent{' '}
                <code>AGENTS.md</code> rules, spec-driven development (SDD)
                before significant changes, test-driven development (TDD) for
                behavior changes, and a way to verify nothing drifted between
                agents or machines. Rebuilding that setup by hand for every repo
                doesn&apos;t scale, and copy-pasted config drifts the moment one
                project changes.
              </p>
            </div>
            <div className={shared.pairSide} data-kind="decision">
              <p className={shared.pairTag}>Decision</p>
              <p>
                Kairo abstracts that governance into a reusable, installable
                runtime — one CLI (<code>kairo</code>) that detects your agents,
                applies the same discipline everywhere, and reports on its own
                health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- principles ---------- */}
      <section
        id="principles"
        className={shared.section}
        aria-labelledby="principles-title"
      >
        <div className={shared.wrap}>
          <p className={shared.kicker}>02 · Core principles</p>
          <h2 id="principles-title" className={shared.h2}>
            Six rules it keeps
          </h2>
          <ul className={styles.principles}>
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.name}
                className={`${styles.principle} ${shared.cut}`}
                style={reveal((i % 3) * 70)}
                data-reveal=""
              >
                <span className={`${styles.pNo} ${shared.mono}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.pName}>{p.name}</h3>
                <p className={styles.pText}>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- architecture ---------- */}
      <section
        id="architecture"
        className={shared.section}
        aria-labelledby="architecture-title"
      >
        <div className={shared.wrap}>
          <p className={shared.kicker}>03 · Architecture</p>
          <h2 id="architecture-title" className={shared.h2}>
            Five layers, one local control plane
          </h2>
          <div style={reveal(60)} data-reveal="">
            <LayerStack />
          </div>
        </div>
      </section>

      {/* ---------- team ---------- */}
      <section
        id="team"
        className={shared.section}
        aria-labelledby="team-title"
      >
        <div className={shared.wrap}>
          <p className={shared.kicker}>04 · How a team runs</p>
          <h2 id="team-title" className={shared.h2}>
            Analyze, approve, assign, distribute, fall back, learn
          </h2>
          <div className={styles.trackWrap}>
            <StepTrack steps={TEAM_STEPS} label="Team run steps" />
          </div>
          <div className={styles.roles}>
            <p className={`${styles.rolesTag} ${shared.mono}`}>
              Roles, as the registry spells them · order illustrative
            </p>
            <ul className={shared.chips}>
              {ROLES.map((role) => (
                <li key={role} className={shared.chip}>
                  {role}
                </li>
              ))}
            </ul>
          </div>
          <p className={`${styles.source} ${shared.mono}`}>
            Steps follow the Kairo README.
          </p>
        </div>
      </section>

      {/* ---------- discipline ---------- */}
      <section
        id="discipline"
        className={shared.section}
        aria-labelledby="discipline-title"
      >
        <div className={shared.wrap}>
          <p className={shared.kicker}>05 · Built with this discipline</p>
          <h2 id="discipline-title" className={shared.h2}>
            It powers how I build, not what runs
          </h2>
          <div
            className={`${shared.prose} ${styles.discProse}`}
            style={reveal(40)}
            data-reveal=""
          >
            <p>
              This portfolio and <Link href="/#projects">Kairo Systems</Link>{' '}
              (ARI and MAYA) are both built using the same SDD/TDD workflow that
              Kairo governs — every significant change follows the pipeline
              below before it ships. The runtime doesn&apos;t power ARI or MAYA
              at execution time; it powers <strong>how I build them</strong>.
            </p>
          </div>
          <div className={styles.trackWrap}>
            <StepTrack steps={PIPELINE} label="Delivery pipeline" compact />
          </div>
        </div>
      </section>

      {/* ---------- try ---------- */}
      <section id="try" className={shared.section} aria-labelledby="try-title">
        <div className={shared.wrap}>
          <p className={shared.kicker}>06 · Try it</p>
          <h2 id="try-title" className={shared.h2}>
            One command
          </h2>
          <div className={styles.tryGrid}>
            <div style={reveal(40)} data-reveal="">
              <CodeBlock
                label="terminal"
                lines={[
                  'npx @kal-elsam/kairo-runtime',
                  '# preview only, writes nothing',
                  'npx @kal-elsam/kairo-runtime --dry-run',
                ]}
              />
              <p className={shared.links}>
                <a
                  href={REPO}
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={shared.cta}
                >
                  View on GitHub
                </a>
                <a
                  href={NPM}
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={shared.ghost}
                >
                  View on npm
                </a>
              </p>
            </div>
            <div style={reveal(120)} data-reveal="">
              <h3 className={styles.stackTitle}>Stack</h3>
              <ul className={shared.chips}>
                {STACK.map((s) => (
                  <li key={s} className={shared.chip}>
                    {s}
                  </li>
                ))}
              </ul>
              <p className={styles.stackNote}>
                Published via GitHub Actions with npm provenance/attestations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </CaseShell>
  );
}
