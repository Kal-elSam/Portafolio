import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import { CHAT } from '@/components/home/data';
import { MQ_ANY } from '@/components/home/motion';
import { gsap, useGSAP } from '@/components/prototype/gsap';

import CaseShell from './CaseShell';
import { useJs } from './useCase';

import styles from './ariCase.module.css';
import shared from './case.module.css';

const LIVE = 'https://www.kairosystems.dev/';

const SECTIONS = [
  { id: 'top', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'tradeoffs', label: 'Tradeoffs' },
  { id: 'lessons', label: 'Challenges and lessons' },
  { id: 'next', label: 'Stack and next steps' },
];

const NEEDS = [
  'Qualify inbound WhatsApp conversations with natural language.',
  'Book appointments against a real Google Calendar via OAuth.',
  'Give operators a dashboard to monitor conversations and intervene.',
  'Stay production-ready — auth, retries, observability, and deployable infrastructure.',
];

type Layer = {
  id: string;
  /** Short name used on the diagram. */
  short: string;
  label: string;
  detail: string;
  items?: string[];
};

// The six layers of the article. The first four sit on the main path, in the
// order the diagram draws them; the last two are the state and the operator
// view that hang off the service layer.
const LAYERS: Layer[] = [
  {
    id: 'channel',
    short: 'WhatsApp',
    label: 'WhatsApp Cloud API',
    detail:
      'Inbound customer messages and outbound replies for local businesses.',
    items: ['Webhooks', 'Message templates', 'Media'],
  },
  {
    id: 'llm',
    short: 'LLM decides',
    label: 'LLM orchestration',
    detail: 'Prompted workflows with function calling to decide next actions.',
    items: ['Groq', 'Gemini', 'Function calling'],
  },
  {
    id: 'api',
    short: 'Service layer acts',
    label: 'Node.js / Express API',
    detail:
      'Service layer for conversations, booking, auth, and external integrations.',
    items: ['REST', 'OAuth', 'Webhooks'],
  },
  {
    id: 'booking',
    short: 'Google Calendar',
    label: 'Google Calendar OAuth',
    detail:
      'Availability checks and confirmed appointments from natural-language intent.',
    items: ['OAuth', 'Events API'],
  },
  {
    id: 'data',
    short: 'Persistent state',
    label: 'PostgreSQL',
    detail:
      'Conversations, leads, bookings, and operational state for the dashboard.',
  },
  {
    id: 'ui',
    short: 'Operator visibility',
    label: 'Next.js dashboard',
    detail:
      'Operator UI for monitoring, intervention, and day-to-day business ops.',
    items: ['React', 'TypeScript', 'TailwindCSS'],
  },
];

const MAIN = LAYERS.slice(0, 4);
const STATE = LAYERS.slice(4);

// Each chat line belongs to a hop of the main path (illustrative, as on the
// home): the customer writes, the LLM decides, the service layer acts, the
// calendar holds the booking.
const HOP_OF_LINE = [0, 1, 2, 3];

type Tradeoff = { title: string; rows: { tag: string; text: string }[] };

const TRADEOFFS: Tradeoff[] = [
  {
    title: 'Managed LLMs over self-hosted models',
    rows: [
      { tag: 'Gain', text: 'Faster to ship and iterate on prompts.' },
      { tag: 'Cost', text: 'Less control over latency and cost at scale.' },
    ],
  },
  {
    title: 'WhatsApp Cloud API over a generic chat widget',
    rows: [
      {
        tag: 'Gain',
        text: 'Matches how Mexican SMBs already talk to customers.',
      },
      { tag: 'Cost', text: 'More webhook and template complexity.' },
    ],
  },
  {
    title: 'Monolithic API first',
    rows: [
      {
        tag: 'Why',
        text: 'One Express service instead of microservices, so a solo founder can ship and debug without distributed overhead.',
      },
    ],
  },
  {
    title: 'Operator dashboard early',
    rows: [
      { tag: 'Reality', text: 'Some automation opacity is inevitable.' },
      {
        tag: 'Answer',
        text: 'A human override path was non-negotiable for trust.',
      },
    ],
  },
];

const FUTURE = [
  'Stronger conversation state machine with explicit transitions and audit logs.',
  'Multi-tenant isolation and role-based operator access.',
  'Evaluation harness for prompt regressions (golden conversations).',
  'Deeper CRM handoffs beyond the current operational dashboard.',
];

const STACK = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'Express',
  'PostgreSQL',
  'TailwindCSS',
  'Groq',
  'Gemini',
  'WhatsApp Cloud API',
  'Google Calendar API',
  'Cloudinary',
  'Sentry',
  'Docker',
  'Railway',
  'Vercel',
];

const HERO_STACK = ['Next.js', 'Node.js', 'PostgreSQL', 'Groq', 'Gemini'];

const rd = (ms: number) => ({ '--rd': `${ms}ms` } as React.CSSProperties);
const rise = (ms: number) => ({ '--d': `${ms}ms` } as React.CSSProperties);

/** The path of a message, node by node. Pick a node to read its layer, or
 * trace an illustrative message through the four hops. */
function AriFlow() {
  const js = useJs();
  const base = useId();
  const [active, setActive] = useState(2);
  const [trace, setTrace] = useState(-1);
  const timer = useRef(0);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const run = () => {
    window.clearInterval(timer.current);
    let hop = 0;
    setTrace(0);
    setActive(0);
    timer.current = window.setInterval(() => {
      hop += 1;
      if (hop >= MAIN.length) {
        window.clearInterval(timer.current);
        return;
      }
      setTrace(hop);
      setActive(hop);
    }, 1100);
  };

  const select = (i: number) => {
    window.clearInterval(timer.current);
    setTrace(-1);
    setActive(i);
  };

  const node = (layer: Layer, i: number, extra = '') => {
    const lit = trace >= 0 && i <= trace && i < MAIN.length;
    const cls = `${styles.node} ${shared.cut} ${extra}`;
    const inner = (
      <>
        <span className={`${styles.nodeNo} ${shared.mono}`}>
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className={styles.nodeShort}>{layer.short}</span>
        <span className={`${styles.nodeLabel} ${shared.mono}`}>
          {layer.label}
        </span>
      </>
    );
    return js ? (
      <button
        key={layer.id}
        type="button"
        className={cls}
        data-lit={lit ? '1' : '0'}
        aria-pressed={active === i}
        aria-controls={`${base}-detail`}
        onClick={() => select(i)}
      >
        {inner}
      </button>
    ) : (
      <div key={layer.id} className={cls} data-lit="0">
        {inner}
      </div>
    );
  };

  const shown = LAYERS[active];
  const tracing = trace >= 0;
  const lines = CHAT.filter((_, i) => !tracing || HOP_OF_LINE[i] <= trace);

  return (
    <div className={styles.flow} data-js={js ? '1' : '0'}>
      <div className={styles.flowTop}>
        <p className={styles.gate}>
          LLMs never write directly to Calendar or WhatsApp; the service layer
          owns side effects.
        </p>
        <div className={styles.row} data-trace={tracing ? '1' : '0'}>
          {MAIN.map((layer, i) => (
            <div key={layer.id} className={styles.cell}>
              {node(layer, i)}
            </div>
          ))}
        </div>
        <div className={styles.state}>
          {STATE.map((layer, i) =>
            node(layer, MAIN.length + i, styles.stateNode)
          )}
        </div>
      </div>

      {js ? (
        <div className={styles.toolbar}>
          <button
            type="button"
            className={`${styles.run} ${shared.cut}`}
            onClick={run}
          >
            Trace a message
          </button>
          <span className={`${styles.hint} ${shared.mono}`}>
            or pick any node
          </span>
        </div>
      ) : null}

      <div className={styles.lower}>
        <div
          id={`${base}-detail`}
          className={`${styles.detail} ${shared.cut}`}
          aria-live="polite"
        >
          {js ? (
            <>
              <p className={`${styles.detailNo} ${shared.mono}`}>
                {String(active + 1).padStart(2, '0')} · {shown.short}
              </p>
              <h3 className={styles.detailTitle}>{shown.label}</h3>
              <p className={styles.detailText}>{shown.detail}</p>
              {shown.items ? (
                <ul className={shared.chips}>
                  {shown.items.map((item) => (
                    <li key={item} className={shared.chip}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <ul className={styles.allDetails}>
              {LAYERS.map((layer) => (
                <li key={layer.id}>
                  <h3 className={styles.detailTitle}>{layer.label}</h3>
                  <p className={styles.detailText}>{layer.detail}</p>
                  {layer.items ? (
                    <p className={`${styles.itemsLine} ${shared.mono}`}>
                      {layer.items.join(' · ')}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <figure className={styles.chat}>
          <figcaption className={`${styles.chatCap} ${shared.mono}`}>
            Illustrative conversation. No real customer, business or result.
          </figcaption>
          <ol className={styles.chatList}>
            {lines.map((line) => (
              <li key={line.id} className={styles.bubble} data-from={line.from}>
                {line.text}
              </li>
            ))}
          </ol>
        </figure>
      </div>
    </div>
  );
}

export default function AriCase() {
  const shotRef = useRef<HTMLDivElement>(null);

  // The product screen drifts up a little while the hero leaves.
  useGSAP(
    () => {
      const shot = shotRef.current;
      if (!shot) return undefined;
      const mm = gsap.matchMedia();
      mm.add(MQ_ANY, () => {
        gsap.to(shot, {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: shot,
            start: 'top 30%',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: shotRef }
  );

  return (
    <CaseShell
      meta={{
        title: 'How I Built ARI',
        description:
          'Architecture case study of ARI — an AI business assistant connecting WhatsApp, LLMs, and calendar booking.',
        caption: 'Architecture',
      }}
      sections={SECTIONS}
      next={{
        href: '/work/kairo-runtime',
        kicker: 'Next case · Open Source',
        title: 'Kairo',
        line: 'A local agent operating system — not an installer that dumps templates.',
      }}
    >
      {/* ---------- overview ---------- */}
      <section id="top" className={styles.hero} aria-labelledby="case-title">
        <div className={`${shared.wrap} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p
              className={`${styles.eyebrow} ${shared.mono} ${shared.rise}`}
              style={rise(0)}
            >
              Architecture · Case study
            </p>
            <h1
              id="case-title"
              className={`${styles.name} ${shared.rise}`}
              style={rise(80)}
            >
              <span className={styles.nameSr}>How I Built </span>ARI
              <span className={styles.dot} aria-hidden="true">
                .
              </span>
            </h1>
            <p
              className={`${styles.heroLine} ${shared.rise}`}
              style={rise(180)}
            >
              <strong>ARI</strong> is the AI business assistant inside{' '}
              <a href={LIVE} target="_blank" rel="noreferrer nofollow">
                Kairo Systems
              </a>{' '}
              — a founder-led SaaS platform for local businesses in Mexico.
            </p>
            <ul
              className={`${shared.chips} ${shared.rise}`}
              style={rise(250)}
              aria-label="Stack"
            >
              {HERO_STACK.map((s) => (
                <li key={s} className={shared.chip}>
                  {s}
                </li>
              ))}
            </ul>
            <p className={`${shared.links} ${shared.rise}`} style={rise(320)}>
              <a
                href={LIVE}
                target="_blank"
                rel="noreferrer nofollow"
                className={shared.cta}
              >
                View live product
              </a>
            </p>
          </div>
          <div className={shared.rise} style={rise(260)}>
            <div ref={shotRef} className={styles.shot}>
              <div className={`${styles.frame} ${shared.cut}`}>
                <span className={styles.chrome} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <b />
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/images/case/ari-product.webp"
                  width={1427}
                  height={1236}
                  alt="The Kairo Systems product site: a landing page with an ARI chat on a phone-style card booking a Thursday 4:00 PM appointment. Mock data, shown with permission."
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- problem ---------- */}
      <section
        id="problem"
        className={shared.section}
        aria-labelledby="problem-title"
      >
        <div className={shared.wrap}>
          <p className={shared.kicker}>01 · Problem</p>
          <h2 id="problem-title" className={shared.srOnly}>
            Problem
          </h2>
          <div className={styles.problem} data-reveal="">
            <p className={styles.bigLine}>
              Local businesses lose leads when nobody answers WhatsApp after
              hours.
            </p>
            <div className={shared.prose}>
              <p>
                Manual qualification is slow, inconsistent, and hard to connect
                to a real calendar. Existing chatbots either dump a scripted FAQ
                or hand everything to a human with no context.
              </p>
            </div>
          </div>
          <h3 className={styles.needsTitle}>ARI needed to:</h3>
          <ol className={styles.needs}>
            {NEEDS.map((need, i) => (
              <li
                key={need}
                className={`${styles.need} ${shared.cut}`}
                style={rd(i * 70)}
                data-reveal=""
              >
                <span className={`${styles.needNo} ${shared.mono}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{need}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- architecture ---------- */}
      <section
        id="architecture"
        className={shared.section}
        aria-labelledby="architecture-title"
      >
        <div className={shared.wrap}>
          <p className={shared.kicker}>02 · Architecture</p>
          <h2 id="architecture-title" className={shared.h2}>
            WhatsApp, LLM decides, service layer acts, Google Calendar
          </h2>
          <div className={styles.flowWrap} data-reveal="">
            <AriFlow />
          </div>
          <div className={`${shared.prose} ${styles.flowNote}`}>
            <p>
              The flow is intentional: channel → API → LLM decisions →
              real-world tools → persistent state → operator visibility. LLMs
              never write directly to Calendar or WhatsApp; the service layer
              owns side effects.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- tradeoffs ---------- */}
      <section
        id="tradeoffs"
        className={shared.section}
        aria-labelledby="tradeoffs-title"
      >
        <div className={shared.wrap}>
          <p className={shared.kicker}>03 · Tradeoffs</p>
          <h2 id="tradeoffs-title" className={shared.h2}>
            What I chose, and what it cost
          </h2>
          <ul className={styles.tradeoffs}>
            {TRADEOFFS.map((t, i) => (
              <li
                key={t.title}
                className={`${styles.trade} ${shared.cut}`}
                style={rd((i % 2) * 80)}
                data-reveal=""
              >
                <h3 className={styles.tradeTitle}>{t.title}</h3>
                <dl className={styles.tradeRows}>
                  {t.rows.map((row) => (
                    <div key={row.tag} className={styles.tradeRow}>
                      <dt className={shared.mono}>{row.tag}</dt>
                      <dd>{row.text}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- challenges and lessons ---------- */}
      <section
        id="lessons"
        className={shared.section}
        aria-labelledby="lessons-title"
      >
        <div className={shared.wrap}>
          <p className={shared.kicker}>04 · Challenges · Lessons learned</p>
          <h2 id="lessons-title" className={shared.h2}>
            What was hard, what I kept
          </h2>
          <div className={`${shared.pair} ${styles.pairLists}`} data-reveal="">
            <div className={shared.pairSide} data-kind="problem">
              <h3 className={shared.pairTag}>Challenges</h3>
              <ul className={styles.list}>
                <li>
                  Connecting natural-language intent to{' '}
                  <strong>idempotent</strong> booking operations without
                  double-booking.
                </li>
                <li>
                  Keeping WhatsApp conversation state consistent across async
                  webhooks and retries.
                </li>
                <li>
                  Separating prompt experimentation from production side effects
                  (function calling must be gated by the service layer).
                </li>
                <li>
                  Owning the full stack alone: product, architecture, frontend,
                  backend, AI, and deploy.
                </li>
              </ul>
            </div>
            <div className={shared.pairSide} data-kind="decision">
              <h3 className={shared.pairTag}>Lessons learned</h3>
              <ul className={styles.list}>
                <li>
                  Treat the LLM as a <strong>decision engine</strong>, not a
                  system of record.
                </li>
                <li>
                  Spec the conversation states before writing prompts —
                  otherwise every edge case becomes a prompt patch.
                </li>
                <li>
                  OAuth and calendar constraints force honesty about what
                  &quot;AI booking&quot; can and cannot do.
                </li>
                <li>
                  The same SDD/TDD discipline governed by{' '}
                  <Link href="/work/kairo-runtime">Kairo</Link> kept this
                  codebase from drifting as the product expanded into MAYA.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- stack and next steps ---------- */}
      <section
        id="next"
        className={shared.section}
        aria-labelledby="next-title"
      >
        <div className={shared.wrap}>
          <p className={shared.kicker}>05 · Stack · Future improvements</p>
          <h2 id="next-title" className={shared.h2}>
            Built alone, end to end
          </h2>
          <div className={styles.nextGrid}>
            <div data-reveal="">
              <h3 className={styles.subTitle}>Stack</h3>
              <ul className={shared.chips}>
                {STACK.map((s) => (
                  <li key={s} className={shared.chip}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div style={rd(100)} data-reveal="">
              <h3 className={styles.subTitle}>Future improvements</h3>
              <ul className={styles.future}>
                {FUTURE.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className={shared.links}>
            <a
              href={LIVE}
              target="_blank"
              rel="noreferrer nofollow"
              className={shared.cta}
            >
              View live product
            </a>
          </p>
        </div>
      </section>
    </CaseShell>
  );
}
