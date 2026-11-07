import Link from 'next/link';
import { useRef, useState } from 'react';

import { gsap, ScrollTrigger, useGSAP } from '@/components/prototype/gsap';
import { ROLES } from '@/components/prototype/kairo/data';

import {
  GENTLE_AI_REPO,
  KAIRO_CASE,
  KAIRO_COMMAND,
  KAIRO_COMMANDS,
  KAIRO_REPO,
  KAIRO_STEPS,
  QUOTA_SAMPLE,
} from './data';
import { MQ_NARROW, MQ_WIDE } from './motion';

import home from './home.module.css';
import styles from './kairoRuntime.module.css';

type BarProps = {
  name: string;
  /** Final fill, 0 to 1. */
  value: number;
  /** Fill before the step is active, 0 to 1. */
  from?: number;
  tone: 'ink' | 'accent';
  note: string;
};

function Bar({ name, value, from = 0, tone, note }: BarProps) {
  return (
    <div className={styles.bar}>
      <p className={styles.barHead}>
        <span>{name}</span>
        <span className={home.mono}>{note}</span>
      </p>
      <span className={styles.barTrack}>
        <span
          data-fill-bar
          data-v={value}
          data-from={from}
          data-drain={from > 0 ? '1' : '0'}
          className={styles.barFill}
          data-tone={tone}
          style={
            {
              '--v': value,
              '--from': from,
            } as React.CSSProperties
          }
        />
      </span>
    </div>
  );
}

function Chips() {
  return (
    <ul className={styles.chips}>
      {ROLES.map((role) => (
        <li key={role} className={styles.chip}>
          {role}
        </li>
      ))}
    </ul>
  );
}

function StepVisual({ id }: { id: (typeof KAIRO_STEPS)[number]['id'] }) {
  switch (id) {
    case 'plan':
      return (
        <div className={styles.viz}>
          <p className={`${styles.cmd} ${home.mono}`}>
            {KAIRO_COMMANDS.analyze}
          </p>
          <p className={`${styles.cmd} ${home.mono}`}>
            {KAIRO_COMMANDS.approve}
          </p>
          <Chips />
        </div>
      );
    case 'assign':
      return (
        <ul className={styles.viz} data-assign>
          {ROLES.map((role) => (
            <li key={role} className={styles.assignRow}>
              <span>{role}</span>
              <span className={styles.wire} aria-hidden="true" />
              <span className={`${styles.model} ${home.mono}`}>
                above floor
              </span>
            </li>
          ))}
        </ul>
      );
    case 'distribute':
      return (
        <div className={`${styles.viz} ${styles.bars}`}>
          <Bar
            name="Claude"
            value={QUOTA_SAMPLE.claude5h / 100}
            tone="ink"
            note={`5h ${QUOTA_SAMPLE.claude5h}%`}
          />
          <Bar
            name="Codex"
            value={QUOTA_SAMPLE.codex5h / 100}
            tone="ink"
            note={`5h ${QUOTA_SAMPLE.codex5h}%`}
          />
          <p className={`${styles.note} ${home.mono}`}>
            Recorded sample, {QUOTA_SAMPLE.date}
          </p>
        </div>
      );
    default:
      return (
        <div className={`${styles.viz} ${styles.bars}`}>
          <Bar
            name="Claude"
            value={0}
            from={QUOTA_SAMPLE.claude5h / 100}
            tone="ink"
            note="5h 0%"
          />
          <Bar
            name="Codex"
            value={QUOTA_SAMPLE.codex5h / 100}
            tone="accent"
            note="takes over"
          />
          <p className={`${styles.cmd} ${home.mono}`}>{KAIRO_COMMANDS.learn}</p>
          <p className={`${styles.note} ${home.mono}`}>Illustrative</p>
        </div>
      );
  }
}

const LAST = KAIRO_STEPS.length - 1;

// Scroll progress (0 to 1 across the sticky stage) at which each step takes
// over. The last step gets the longest share, so the finished state holds.
const STARTS = [0, 0.22, 0.46, 0.7];

/** Continuous step position: whole numbers at each step start. */
const positionAt = (p: number) => {
  let i = LAST;
  while (i > 0 && p < STARTS[i]) i -= 1;
  if (i === LAST) return LAST;
  return i + (p - STARTS[i]) / (STARTS[i + 1] - STARTS[i]);
};

export default function KairoRuntime() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      // Wide: the stage sticks and shows one step at a time, large. The step
      // follows scroll; its bars and wires animate by themselves (CSS) once it
      // is active, so a value is never caught half drawn.
      mm.add(MQ_WIDE, () => {
        section.dataset.motion = 'on';
        const fill = q('[data-fill]')[0];
        const head = q('[data-head]')[0];
        const track = q('[data-track]')[0] as HTMLElement;
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          // Lazy sections and the sticky height settle after hydration:
          // measure after them.
          refreshPriority: -1,
          onUpdate: (self) => {
            const at = positionAt(self.progress);
            const next = Math.min(LAST, Math.floor(at + 1e-6));
            setActive((prev) => (prev === next ? prev : next));
            const ratio = at / LAST;
            gsap.set(fill, { scaleX: ratio });
            gsap.set(head, { x: ratio * track.offsetWidth });
          },
        });
        return () => {
          trigger.kill();
          delete section.dataset.motion;
        };
      });

      // Narrow: the list stays in flow; each step's bars draw as it arrives.
      mm.add(MQ_NARROW, () => {
        const triggers: ScrollTrigger[] = [];
        q('[data-step]').forEach((step) => {
          const bars = step.querySelectorAll<HTMLElement>('[data-fill-bar]');
          if (bars.length === 0) return;
          bars.forEach((bar) =>
            gsap.set(bar, { scaleX: Number(bar.dataset.from) })
          );
          triggers.push(
            ScrollTrigger.create({
              trigger: step,
              start: 'top 85%',
              once: true,
              onEnter: () =>
                bars.forEach((bar) =>
                  gsap.to(bar, {
                    scaleX: Number(bar.dataset.v),
                    duration: 0.9,
                    delay: 0.15,
                    ease: 'power3.out',
                  })
                ),
            })
          );
        });
        return () => triggers.forEach((t) => t.kill());
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="kairo"
      ref={sectionRef}
      className={`${home.section} ${styles.section}`}
      aria-labelledby="kairo-title"
    >
      <div className={styles.stage}>
        <header className={styles.head}>
          <div>
            <h2 id="kairo-title" className={home.h2}>
              Kairo
            </h2>
            <p className={styles.slogan}>The right agent for every task.</p>
            <p className={home.lede}>
              Who does each task, with which model, quota in view.
            </p>
          </div>
          <div className={styles.actions}>
            <code className={`${styles.install} ${home.mono}`}>
              {KAIRO_COMMAND}
            </code>
            <Link href={KAIRO_CASE} className={home.ghost}>
              Read the case
            </Link>
            <a
              href={KAIRO_REPO}
              className={home.ghost}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source on GitHub
              <span className={home.srOnly}> (opens in a new tab)</span>
            </a>
          </div>
        </header>

        <ol className={styles.steps}>
          {KAIRO_STEPS.map((step, i) => (
            <li
              key={step.id}
              className={styles.step}
              data-step={step.id}
              data-on={active === i ? '1' : '0'}
            >
              <div className={styles.copy}>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.line}>{step.line}</p>
              </div>
              <StepVisual id={step.id} />
            </li>
          ))}
        </ol>

        <div className={styles.rail} aria-hidden="true">
          <span className={styles.track} data-track>
            <span className={styles.fill} data-fill />
            <span className={styles.pulse} data-head />
          </span>
          <ol className={styles.names}>
            {KAIRO_STEPS.map((step, i) => (
              <li
                key={step.id}
                className={styles.name}
                data-reached={i <= active ? '1' : '0'}
                data-current={i === active ? '1' : '0'}
              >
                <span className={styles.dot} />
                {step.title}
              </li>
            ))}
          </ol>
        </div>

        <p className={styles.credit}>
          Built on top of{' '}
          <a href={GENTLE_AI_REPO} target="_blank" rel="noopener noreferrer">
            gentle-ai
            <span className={home.srOnly}> (opens in a new tab)</span>
          </a>
          , which owns workflow, review, skills and memory.
        </p>
      </div>
    </section>
  );
}
