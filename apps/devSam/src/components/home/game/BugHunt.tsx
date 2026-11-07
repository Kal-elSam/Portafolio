// "Bug Hunt": the last section of the home. This file is the whole shell: a
// framed console with a static preview and a Play button. The game itself
// (engine, renderer, art, audio) is a separate chunk fetched on first press.

import { ComponentType, useCallback, useRef, useState } from 'react';

import styles from './bugHunt.module.css';

type PlayerComponent = ComponentType<{ onExit: () => void }>;

const DESCRIPTION =
  'A first-person maze shooter. You walk the corridors of a data center and shoot bugs with a patch gun before the system goes down. ' +
  'There are two short maps, three kinds of bug, and pickups that restore uptime and ammo. ' +
  'It uses the keyboard and mouse, or an on-screen stick and fire button on touch screens, and it is a visual game: ' +
  'a screen reader cannot play it, and nothing else on this page depends on it. Press Escape to pause and again to exit.';

/** Static corridor, drawn with SVG: vanishing point, racks with LEDs, a bug. */
function Preview() {
  const leds = [
    [58, 112, '#c8ff2e'],
    [66, 112, '#35d6ff'],
    [58, 128, '#ffb020'],
    [66, 128, '#c8ff2e'],
    [58, 144, '#ff3b3b'],
    [66, 144, '#c8ff2e'],
    [58, 160, '#35d6ff'],
    [66, 160, '#ffb020'],
    [58, 176, '#c8ff2e'],
    [66, 176, '#ff3b3b'],
  ] as const;
  return (
    <svg
      className={styles.preview}
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="320" height="180" fill="#05080a" />
      <polygon points="0,0 320,0 190,72 130,72" fill="#0a0f12" />
      <polygon points="0,180 320,180 190,108 130,108" fill="#0d1317" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={160 + (i - 2) * 14}
          y1="108"
          x2={160 + (i - 2) * 120}
          y2="180"
          stroke="rgba(200,255,46,0.12)"
        />
      ))}
      <rect x="146" y="26" width="28" height="9" fill="#e4ffb4" opacity="0.8" />
      <rect
        x="130"
        y="52"
        width="60"
        height="5"
        fill="#e4ffb4"
        opacity="0.35"
      />
      {/* left wall: racks */}
      <polygon points="0,0 130,72 130,108 0,180" fill="#10171b" />
      <g>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <polygon
            key={i}
            points={`${i * 18},${i * 10.3} ${i * 18 + 16},${i * 10.3 + 8.2} ${
              i * 18 + 16
            },${180 - i * 10.3 - 8.2} ${i * 18},${180 - i * 10.3}`}
            fill="none"
            stroke="#3a4a54"
          />
        ))}
        {leds.map(([x, y, c], i) => (
          <rect
            key={`${x}-${y}`}
            x={x - 40}
            y={y - 70 + (i % 3)}
            width="3"
            height="3"
            fill={c}
          />
        ))}
      </g>
      {/* right wall: cable tray */}
      <polygon points="320,0 190,72 190,108 320,180" fill="#0b1115" />
      {[0, 1, 2, 3, 4].map((i) => (
        <polyline
          key={i}
          points={`320,${30 + i * 28} 190,${76 + i * 7}`}
          stroke={['#c8ff2e', '#35d6ff', '#ff4fa3', '#ffb020', '#8a98a0'][i]}
          strokeWidth="3"
          fill="none"
          opacity="0.8"
        />
      ))}
      {/* a bug in the distance */}
      <g transform="translate(236 132) scale(2.4)">
        <ellipse cx="0" cy="3" rx="9" ry="10" fill="#ffb020" />
        <rect x="-0.5" y="-6" width="1" height="18" fill="#5a3600" />
        <circle cx="0" cy="-8" r="5" fill="#5a3600" />
        <rect x="-3" y="-10" width="2" height="2" fill="#ff3b3b" />
        <rect x="1" y="-10" width="2" height="2" fill="#ff3b3b" />
        <ellipse cx="9" cy="3" rx="9" ry="10" fill="#35d6ff" opacity="0.35" />
      </g>
      {/* gun */}
      <polygon points="126,180 146,150 174,150 194,180" fill="#1b262b" />
      <rect x="152" y="140" width="16" height="12" fill="#0a1013" />
      <rect x="154" y="142" width="12" height="3" fill="#c8ff2e" />
      <rect x="156" y="152" width="8" height="28" fill="#c8ff2e" />
      {/* crosshair */}
      <path d="M160 86v-4M160 94v4M152 90h-4M168 90h4" stroke="#c8ff2e" />
    </svg>
  );
}

export default function BugHunt() {
  const [Player, setPlayer] = useState<PlayerComponent | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);

  const play = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const mod = await import('./GamePlayer');
      setPlayer(() => mod.default);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const exit = useCallback(() => {
    setPlayer(null);
    window.requestAnimationFrame(() =>
      playRef.current?.focus({ preventScroll: true })
    );
  }, []);

  return (
    <section
      id="bug-hunt"
      className={styles.section}
      aria-labelledby="bug-hunt-title"
      aria-describedby="bug-hunt-about"
    >
      <div className={styles.head}>
        <p className={styles.kicker}>Side quest</p>
        <h2 id="bug-hunt-title" className={styles.title}>
          Bug Hunt
        </h2>
        <p className={styles.lede}>
          A tiny first-person engine, written from scratch for this site. Clear
          the bugs before the system goes down.
        </p>
        <p id="bug-hunt-about" className={styles.sr}>
          {DESCRIPTION}
        </p>
        <noscript>
          <style>{`.${styles.cover}{display:none}`}</style>
          <p className={styles.nojs}>Bug Hunt needs JavaScript to run.</p>
        </noscript>
      </div>

      <div className={styles.console}>
        <div className={styles.plate}>
          <span className={styles.badge}>Patch gun mk1</span>
          <span className={styles.lamps} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className={styles.bay}>
          {Player ? <Player onExit={exit} /> : <Preview />}
          {!Player && (
            <div className={styles.cover}>
              <button
                ref={playRef}
                type="button"
                className={styles.play}
                onClick={play}
                disabled={loading}
                aria-describedby="bug-hunt-about"
              >
                {loading ? 'Loading' : 'Play'}
              </button>
              {failed && (
                <p className={styles.error} role="alert">
                  The game could not load. Check the connection and try again.
                </p>
              )}
            </div>
          )}
        </div>
        <div className={styles.plate}>
          <span className={styles.hint}>
            Keyboard and mouse, or touch. Sound is off until you turn it on.
          </span>
        </div>
      </div>
    </section>
  );
}
