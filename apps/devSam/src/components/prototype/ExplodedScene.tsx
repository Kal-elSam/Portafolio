import clsx from 'clsx';
import { useRef } from 'react';

import { gsap, ScrollTrigger, useGSAP } from './gsap';
import { PARTS, SEPARATION_ORDER } from './parts';
import Slab from './Slab';
import { stage as sceneStage } from './stage';

import styles from './prototype.module.css';

const TIGHT = 14; // visible plate thickness when the assembly is closed

function Facts({ facts }: { facts: (typeof PARTS)[number]['facts'] }) {
  return (
    <>
      {facts.map((fact) => (
        <div key={fact.label} className="mt-1.5">
          <dt className="text-xs text-[color:var(--muted)]">{fact.label}</dt>
          <dd
            className={clsx(
              'text-[0.8125rem] leading-snug [overflow-wrap:anywhere]',
              fact.code && styles.data
            )}
          >
            {fact.value}
          </dd>
        </div>
      ))}
    </>
  );
}

export default function ExplodedScene({ mode }: { mode: '3d' | 'svg' }) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return undefined;

      const mm = gsap.matchMedia();

      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          if (mode === '3d') {
            // The WebGL scene reads these two numbers; nothing here touches the DOM.
            const sync =
              (key: 'glide' | 'progress') => (self: ScrollTrigger) => {
                sceneStage[key] = self.progress;
                sceneStage.invalidate();
              };
            ScrollTrigger.create({
              trigger: stage,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
              onUpdate: sync('glide'),
              onRefresh: sync('glide'),
            });
            ScrollTrigger.create({
              trigger: stage,
              start: 'top top',
              end: '+=320%',
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: sync('progress'),
              onRefresh: sync('progress'),
            });
            return () => {
              sceneStage.glide = 0;
              sceneStage.progress = 0;
            };
          }

          const items = gsap.utils.toArray<HTMLElement>('[data-part]', stage);
          const axis = stage.querySelector<HTMLElement>('[data-axis]');
          const bar = stage.querySelector<HTMLElement>('[data-progress]');
          const total = items.length;

          // Closed position of each part, relative to its exploded layout slot.
          const closedOffset = (el: HTMLElement, index: number) =>
            stage.clientHeight / 2 +
            (index - (total - 1) / 2) * TIGHT -
            (el.offsetTop + el.offsetHeight / 2);

          try {
            const tl = gsap.timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: {
                trigger: stage,
                start: 'top top',
                end: '+=320%',
                pin: true,
                scrub: 0.7,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            SEPARATION_ORDER.forEach((index, step) => {
              const el = items[index];
              const at = step * 0.5;
              tl.fromTo(
                el,
                { y: () => closedOffset(el, index) },
                { y: 0, duration: 1 },
                at
              );
              tl.fromTo(
                el.querySelectorAll('[data-lit]'),
                { opacity: 0.12 },
                { opacity: 1, duration: 0.6, ease: 'power1.out' },
                at + 0.3
              );
              tl.fromTo(
                el.querySelectorAll('[data-annot]'),
                { opacity: 0 },
                { opacity: 1, duration: 0.45, ease: 'power1.out' },
                at + 0.55
              );
            });

            tl.to({}, { duration: 0.7 });

            if (axis) {
              tl.fromTo(
                axis,
                { scaleY: 0.3 },
                { scaleY: 1, duration: tl.duration(), ease: 'none' },
                0
              );
            }
            if (bar) {
              tl.fromTo(
                bar,
                { scaleX: 0 },
                { scaleX: 1, duration: tl.duration(), ease: 'none' },
                0
              );
            }

            if (document.fonts?.ready) {
              document.fonts.ready.then(() => ScrollTrigger.refresh());
            }
          } catch {
            // Any failure leaves the static, fully exploded drawing in place.
            gsap.set(
              stage.querySelectorAll(
                '[data-part], [data-lit], [data-annot], [data-axis], [data-progress]'
              ),
              {
                clearProps: 'all',
              }
            );
          }
          return undefined;
        }
      );

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [mode], revertOnUpdate: true }
  );

  return (
    <section
      ref={rootRef}
      id="kairo-scene"
      aria-labelledby="scene-title"
      className={styles.content}
    >
      <div
        ref={stageRef}
        data-stage=""
        className={clsx(
          'relative px-5 pb-20 pt-20 sm:px-8',
          'lg:flex lg:h-screen lg:min-h-[760px] lg:flex-col lg:pb-8 lg:pt-[7.5rem]'
        )}
      >
        <div
          data-title=""
          className="relative z-10 mb-12 max-w-[44ch] lg:absolute lg:left-8 lg:top-8 lg:mb-0 lg:max-w-[36ch]"
        >
          <h2
            id="scene-title"
            className={clsx(
              styles.display,
              'text-2xl leading-tight lg:text-[1.75rem]'
            )}
          >
            Kairo Runtime, exploded
          </h2>
          <p className="mt-2 text-sm leading-snug text-[color:var(--muted)]">
            Six modules, read from the public repository. Scroll to take the
            assembly apart.
          </p>
        </div>

        <svg aria-hidden="true" focusable="false" className={styles.leaders}>
          {PARTS.flatMap((part) =>
            [0, 1].map((n) => (
              <g key={`${part.id}-${n}`}>
                <path data-leader="" className={styles.leaderPath} />
                <rect
                  data-leader-end=""
                  width="6"
                  height="6"
                  className={styles.leaderEnd}
                />
              </g>
            ))
          )}
        </svg>

        <div
          data-axis=""
          aria-hidden="true"
          className={clsx(
            styles.axis,
            'absolute bottom-6 left-5 top-40 w-px lg:bottom-6 lg:left-1/2 lg:top-24'
          )}
        />

        <ol
          className={clsx(
            styles.sceneList,
            'relative z-[1] pl-8 lg:my-auto lg:pl-0'
          )}
        >
          {PARTS.map((part, i) => (
            <li
              key={part.id}
              data-part=""
              style={{ zIndex: PARTS.length - i }}
              className={clsx(
                styles.part,
                'relative mb-14 flex flex-col gap-3 last:mb-0',
                'lg:mb-1 lg:grid lg:min-h-[96px] lg:grid-cols-[minmax(0,1fr)_240px_minmax(0,1fr)] lg:items-center lg:gap-4'
              )}
            >
              <div
                data-annot="left"
                className={clsx(
                  styles.annot3d,
                  'order-2 lg:order-none lg:flex lg:items-center lg:justify-end lg:gap-3'
                )}
              >
                <div className="max-w-[44ch] lg:w-[300px] lg:text-right">
                  <h3 className={clsx(styles.display, 'text-lg leading-tight')}>
                    {part.name}
                  </h3>
                  <p className="mt-1 text-sm leading-snug text-[color:var(--muted)]">
                    {part.role}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className={clsx(
                    styles.leader,
                    styles.leaderLeft,
                    'hidden min-w-[20px] flex-1 lg:block'
                  )}
                />
              </div>

              <Slab
                kind={part.id}
                tone={i % 2 === 0 ? 'primary' : 'secondary'}
                className={clsx(
                  styles.sceneSlab,
                  'order-1 w-48 lg:order-none lg:w-[240px]'
                )}
              />

              <div
                data-annot="right"
                className={clsx(
                  styles.annot3d,
                  'order-3 lg:order-none lg:flex lg:items-center lg:gap-3'
                )}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    styles.leader,
                    styles.leaderRight,
                    'hidden min-w-[20px] flex-1 lg:block'
                  )}
                />
                <dl className="max-w-[44ch] lg:w-[300px]">
                  <div>
                    <dt className="text-xs text-[color:var(--muted)]">
                      source
                    </dt>
                    <dd
                      className={clsx(
                        styles.data,
                        'text-[0.8125rem] leading-snug text-[color:var(--accent)] [overflow-wrap:anywhere]'
                      )}
                    >
                      {part.source}
                    </dd>
                  </div>
                  <Facts facts={part.facts} />
                </dl>
              </div>
            </li>
          ))}
        </ol>

        <div
          aria-hidden="true"
          className={clsx(
            styles.progressWrap,
            'absolute bottom-6 right-8 hidden w-40 lg:block'
          )}
        >
          <p className="mb-1.5 text-right text-xs text-[color:var(--muted)]">
            Separation
          </p>
          <div className="h-[3px] bg-[color:var(--line)]">
            <div data-progress="" className={clsx(styles.progress, 'h-full')} />
          </div>
        </div>
      </div>
    </section>
  );
}
