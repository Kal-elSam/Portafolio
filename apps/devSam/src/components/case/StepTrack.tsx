import { useRef } from 'react';

import { MQ_ANY } from '@/components/home/motion';
import { gsap, useGSAP } from '@/components/prototype/gsap';

import styles from './stepTrack.module.css';

export type Step = {
  title: string;
  /** A command shown in mono under the title. */
  cmd?: string;
  line?: string;
};

/**
 * Numbered steps on one trace. Without motion every step is lit; with it the
 * trace fills as the track crosses the viewport and each node lights in turn.
 */
export default function StepTrack({
  steps,
  label,
  compact = false,
}: {
  steps: Step[];
  label: string;
  compact?: boolean;
}) {
  const trackRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return undefined;
      const mm = gsap.matchMedia();
      mm.add(MQ_ANY, () => {
        const q = gsap.utils.selector(track);
        const nodes = q('[data-node]');
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: track,
            start: 'top 78%',
            end: 'bottom 52%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(track, { '--prog': 0 }, { '--prog': 1, duration: 1 }, 0);
        const step = 1 / nodes.length;
        nodes.forEach((node, i) => {
          tl.fromTo(
            node,
            { '--on': 0 },
            { '--on': 1, duration: step * 0.4 },
            i * step * 0.92
          );
        });
      });
      return () => mm.revert();
    },
    { scope: trackRef }
  );

  return (
    <ol
      ref={trackRef}
      className={styles.track}
      data-compact={compact ? '1' : '0'}
      aria-label={label}
      style={{ '--n': steps.length } as React.CSSProperties}
    >
      <li className={styles.rail} aria-hidden="true">
        <span className={styles.fill} />
      </li>
      {steps.map((step, i) => (
        <li key={step.title} className={styles.step}>
          <span className={styles.node} data-node="">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className={styles.title}>{step.title}</h3>
          {step.cmd ? <code className={styles.cmd}>{step.cmd}</code> : null}
          {step.line ? <p className={styles.line}>{step.line}</p> : null}
        </li>
      ))}
    </ol>
  );
}
