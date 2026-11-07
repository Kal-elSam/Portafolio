import { useRef } from 'react';

import { gsap, useGSAP } from '@/components/prototype/gsap';
import { CV_HREF } from '@/components/prototype/map/data';

import { AXIS_YEARS, CAREER_ROWS } from './career';
import ContributionGraph from './ContributionGraph';
import { CONTACT_LINKS } from './data';
import { MQ_ANY } from './motion';

import styles from './career.module.css';
import home from './home.module.css';

export default function CareerContact() {
  const rootRef = useRef<HTMLDivElement>(null);

  // One idea: time is drawn in. Bars grow from their start month and the
  // contribution graph is uncovered from the oldest day. Both finish before
  // their block reaches mid-screen, so the final state is always complete.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return undefined;
      const mm = gsap.matchMedia();
      mm.add(MQ_ANY, () => {
        const bars = root.querySelectorAll('[data-bar]');
        const graph = root.querySelector('[data-graph-wrap]');
        gsap.fromTo(
          bars,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: {
              trigger: root.querySelector('[data-gantt]'),
              start: 'top 85%',
              end: 'bottom 60%',
              scrub: 0.5,
              refreshPriority: -1,
            },
          }
        );
        gsap.fromTo(
          graph,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: graph,
              start: 'top 98%',
              end: 'top 72%',
              scrub: 0.5,
              refreshPriority: -1,
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className={styles.root}>
      <section
        id="career"
        className={`${home.section} ${styles.career}`}
        aria-labelledby="career-title"
      >
        <h2 id="career-title" className={home.h2}>
          Career
        </h2>

        <div className={styles.gantt} data-gantt>
          <ol className={styles.rows}>
            {CAREER_ROWS.map((row) => (
              <li key={row.id} className={styles.row}>
                <p className={styles.who}>
                  <span className={styles.company}>{row.company}</span>
                  <span className={styles.meta}>
                    <span className={styles.role}>{row.role}</span>
                    <span className={`${styles.years} ${home.mono}`}>
                      {row.years}
                    </span>
                  </span>
                </p>
                <div className={styles.lane}>
                  <span
                    className={styles.bar}
                    data-bar
                    data-current={row.current ? '1' : '0'}
                    style={{
                      left: `${row.from * 100}%`,
                      width: `${(row.to - row.from) * 100}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>
          <ul className={styles.axis} aria-hidden="true">
            {AXIS_YEARS.map((year) => (
              <li key={year} className={home.mono}>
                {year}
              </li>
            ))}
          </ul>
        </div>

        <ContributionGraph />
      </section>

      <section
        id="contact"
        className={`${home.section} ${styles.contact}`}
        aria-labelledby="contact-title"
      >
        <h2 id="contact-title" className={styles.contactTitle}>
          Contact
        </h2>
        <ul className={styles.contactLinks}>
          {CONTACT_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href={CV_HREF} download>
              CV
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
