import clsx from 'clsx';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';

import ExplodedScene from './ExplodedScene';
import Hero from './Hero';
import { COPY } from './parts';
import SceneLayer from './SceneLayer';

import styles from './prototype.module.css';

type PrototypePageProps = {
  /** next/font variable classes for this route only. */
  fontClassName: string;
};

export default function PrototypePage({ fontClassName }: PrototypePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // True only after the WebGL canvas has drawn its first frame. Until then,
  // and whenever WebGL, width or motion preference rule it out, the
  // server-rendered SVG drawing is what the visitor sees.
  const [webglReady, setWebglReady] = useState(false);
  const handleReady = useCallback(() => setWebglReady(true), []);
  const handleFail = useCallback(() => setWebglReady(false), []);

  // Paint the document with the theme field so overscroll never shows white.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const html = document.documentElement;
    const previous = html.style.backgroundColor;
    html.style.backgroundColor = getComputedStyle(node).backgroundColor;
    return () => {
      html.style.backgroundColor = previous;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-scene3d={webglReady ? 'on' : 'off'}
      className={clsx(styles.root, styles.themeA, fontClassName)}
    >
      <Head>
        <title>{`${COPY.title} (prototype A)`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="data:," />
      </Head>

      <div aria-hidden="true" className={styles.field} />
      <SceneLayer
        ready={webglReady}
        onReady={handleReady}
        onFail={handleFail}
      />

      <Hero />
      <ExplodedScene mode={webglReady ? '3d' : 'svg'} />

      <footer className={clsx(styles.content, 'px-5 pb-24 pt-20 sm:px-8')}>
        <div className="mx-auto max-w-[1360px]">
          <div className={styles.rule} />
          <p
            className={clsx(
              styles.display,
              'mt-10 max-w-[34ch] text-[1.375rem] leading-snug sm:text-[1.75rem]'
            )}
          >
            {COPY.closing}
          </p>
        </div>
      </footer>
    </div>
  );
}
