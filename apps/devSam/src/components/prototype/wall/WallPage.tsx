import clsx from 'clsx';
import Head from 'next/head';
import { useEffect, useRef } from 'react';

import { COPY } from '../map/data';
import ProjectIndex from '../map/ProjectIndex';
import WallStage from './WallStage';

import mapStyles from '../map/map.module.css';
import styles from './wall.module.css';

type WallPageProps = {
  /** next/font variable classes for this route only. */
  fontClassName: string;
};

export default function WallPage({ fontClassName }: WallPageProps) {
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
    <div
      ref={rootRef}
      className={clsx(mapStyles.root, styles.root, fontClassName)}
    >
      <Head>
        <title>{`${COPY.name} | ${COPY.title} (wall prototype)`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="data:," />
      </Head>
      <a className={styles.skip} href="#all-projects">
        Skip to all projects
      </a>
      <WallStage />
      <ProjectIndex />
    </div>
  );
}
