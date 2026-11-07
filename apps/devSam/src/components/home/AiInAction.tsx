import Link from 'next/link';
import { useRef } from 'react';

import { gsap, useGSAP } from '@/components/prototype/gsap';

import { ARI_CASE, ARI_PATH, CHAT, ROLE_FLOW } from './data';
import { MQ_NARROW, MQ_WIDE } from './motion';

import styles from './aiInAction.module.css';
import home from './home.module.css';

// Hop of ARI_PATH that lights with each chat line (index into CHAT).
const HOP_AT_LINE: Record<number, number> = { 0: 0, 1: 1, 2: 2, 3: 3 };

export default function AiInAction() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      // The story runs from the section entering the screen to the end of its
      // sticky travel, then holds its finished state.
      const build = (trigger: Element, start: string, end: string) => {
        const lines = q('[data-line]');
        const hops = q('[data-hop]');
        const roles = q('[data-role]');
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger,
            start,
            end,
            // The picture follows the wheel with no easing lag.
            scrub: true,
            invalidateOnRefresh: true,
            // Lazy sections and the sticky height settle after hydration:
            // measure after them.
            refreshPriority: -1,
          },
        });
        const chatEnd = 0.5;
        const step = chatEnd / lines.length;
        lines.forEach((line, i) => {
          tl.fromTo(
            line,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: step * 0.7, ease: 'power2.out' },
            i * step
          );
          const hop = HOP_AT_LINE[i];
          if (hop !== undefined) {
            tl.fromTo(
              hops[hop],
              { opacity: 0.2 },
              { opacity: 1, duration: step * 0.7, ease: 'power2.out' },
              i * step
            );
          }
        });
        const rail = q('[data-hop-rail]')[0] as HTMLElement;
        const hopLines = Object.keys(HOP_AT_LINE).map(Number);
        tl.set(q('[data-hop-fill]'), { scaleY: 0 }, 0);
        tl.set(q('[data-hop-pulse]'), { y: 0 }, 0);
        hopLines.slice(1).forEach((lineIx, k) => {
          const from = hopLines[k] * step;
          const to = lineIx * step;
          const share = (k + 1) / (hopLines.length - 1);
          tl.to(
            q('[data-hop-fill]'),
            { scaleY: share, duration: to - from },
            from
          );
          tl.to(
            q('[data-hop-pulse]'),
            { y: () => rail.offsetHeight * share, duration: to - from },
            from
          );
        });
        const laneAt = 0.54;
        const laneStep = 0.24 / roles.length;
        tl.fromTo(
          q('[data-lane-fill]'),
          { scaleX: 0 },
          { scaleX: 1, duration: laneStep * (roles.length - 1) + 0.04 },
          laneAt
        );
        roles.forEach((role, i) => {
          tl.fromTo(
            role,
            { opacity: 0.2 },
            { opacity: 1, duration: 0.05, ease: 'power2.out' },
            laneAt + i * laneStep
          );
        });
        // Hold the finished state for the last fifth of the travel.
        tl.to({}, { duration: 0.2 }, 0.8);
      };

      mm.add(MQ_WIDE, () => {
        section.dataset.motion = 'on';
        build(section, 'top 35%', 'bottom bottom');
        return () => {
          delete section.dataset.motion;
        };
      });
      mm.add(MQ_NARROW, () => {
        build(q('[data-board]')[0], 'top 78%', 'bottom 60%');
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="ai"
      ref={sectionRef}
      className={`${home.section} ${styles.section}`}
      aria-labelledby="ai-title"
    >
      <div className={styles.stage}>
        <header className={styles.copy}>
          <h2 id="ai-title" className={home.h2}>
            AI in action
          </h2>
          <p className={home.lede}>
            ARI answers WhatsApp, qualifies, schedules and books on a real
            calendar.
          </p>
          <div className={home.links}>
            <Link href={ARI_CASE} className={home.cta}>
              How I built ARI
            </Link>
          </div>
        </header>

        <div className={styles.board} data-board>
          <div className={styles.flow}>
            <ol
              className={styles.chat}
              aria-label="Illustrative WhatsApp conversation"
            >
              {CHAT.map((line) => (
                <li
                  key={line.id}
                  className={styles.line}
                  data-from={line.from}
                  data-line
                >
                  <p className={styles.bubble}>{line.text}</p>
                  {line.stage && (
                    <span className={`${styles.stageTag} ${home.mono}`}>
                      {line.stage}
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <div className={styles.path}>
              <span
                className={styles.pathRail}
                data-hop-rail
                aria-hidden="true"
              >
                <span className={styles.pathFill} data-hop-fill />
                <span className={styles.pathPulse} data-hop-pulse />
              </span>
              <ol
                className={styles.hops}
                aria-label="Path of a message through ARI"
              >
                {ARI_PATH.map((hop) => (
                  <li key={hop} className={styles.hop} data-hop>
                    {hop}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className={styles.lane}>
            <p className={styles.laneCaption}>
              The same idea for engineering work. Illustrative, with the roles
              of the Kairo kit.
            </p>
            <div className={styles.laneRail}>
              <span className={styles.laneTrack} aria-hidden="true">
                <span className={styles.laneFill} data-lane-fill />
              </span>
              <ol className={styles.roles}>
                {ROLE_FLOW.map((role) => (
                  <li key={role} className={styles.role} data-role>
                    <span className={styles.roleDot} aria-hidden="true" />
                    {role}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <p className={styles.caption}>
          Illustrative conversation. Architecture from the ARI case study.
        </p>
      </div>
    </section>
  );
}
