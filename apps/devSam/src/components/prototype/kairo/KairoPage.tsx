import clsx from 'clsx';
import Head from 'next/head';
import { useEffect, useRef } from 'react';

import { COPY } from './data';
import KairoStage from './KairoStage';

import styles from './kairo.module.css';

type KairoPageProps = {
  /** next/font variable classes for this route only. */
  fontClassName: string;
};

export default function KairoPage({ fontClassName }: KairoPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

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
    <div ref={rootRef} className={clsx(styles.root, fontClassName)}>
      <Head>
        <title>{`${COPY.name} | ${COPY.title} (Kairo hero prototype)`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="data:," />
      </Head>
      <main>
        <KairoStage standalone />
      </main>
    </div>
  );
}
