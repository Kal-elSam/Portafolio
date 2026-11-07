import Image from 'next/image';

import { metaLine } from '../map/data';
import { KAIRO_COMMAND, KAIRO_REPO, PRIMARY } from './screens';

import type { Screen } from './screens';

import styles from './wall.module.css';

function Tile({ screen }: { screen: Screen }) {
  const { project } = screen;
  const content =
    screen.kind === 'image' ? (
      <Image
        className={styles.tileImage}
        src={screen.src}
        width={screen.w}
        height={screen.h}
        sizes="(min-width: 1024px) 18vw, 44vw"
        alt={`${project.name} interface`}
        unoptimized
      />
    ) : (
      <span className={styles.tileTerminal}>
        <span className={styles.tileTerminalTitle}>Kairo Runtime</span>
        <span className={`${styles.tileTerminalLine} ${styles.data}`}>
          <span aria-hidden="true">$ </span>
          {KAIRO_COMMAND}
        </span>
        <span className={`${styles.tileTerminalRepo} ${styles.data}`}>
          {KAIRO_REPO}
        </span>
      </span>
    );

  return (
    <li className={styles.tile}>
      {project.href ? (
        <a href={project.href} target="_blank" rel="noopener noreferrer">
          {content}
          <span className={styles.tileCaption}>
            <span className={styles.tileName}>
              {project.name}
              {project.href && (
                <span className={styles.srOnly}> (opens in a new tab)</span>
              )}
            </span>
            <span className={styles.tileMeta}>{metaLine(project)}</span>
          </span>
        </a>
      ) : (
        <div className={styles.tileStatic}>
          {content}
          <span className={styles.tileCaption}>
            <span className={styles.tileName}>
              {project.name}
              {project.href && (
                <span className={styles.srOnly}> (opens in a new tab)</span>
              )}
            </span>
            <span className={styles.tileMeta}>{metaLine(project)}</span>
          </span>
        </div>
      )}
    </li>
  );
}

/**
 * The wall as a designed static composition: the same real screens, in their
 * groups, as server-rendered next/image tiles. Used by no-JS, reduced motion,
 * no WebGL, context loss and narrow widths.
 */
export default function StaticWall() {
  return (
    <ul className={styles.mosaic}>
      {PRIMARY.map((screen) => (
        <Tile key={screen.id} screen={screen} />
      ))}
    </ul>
  );
}
