// The playable part. This module and everything it imports (engine, renderer,
// art, audio, rules) is only fetched when the visitor presses Play.

import {
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Game, Hud } from './engine';
import { MAX_HP } from './world';

import styles from './player.module.css';

interface Props {
  onExit: () => void;
}

/** Keep receiving a touch after it leaves the control. Optional. */
const capture = (e: ReactPointerEvent<HTMLElement>) => {
  try {
    e.currentTarget.setPointerCapture(e.pointerId);
  } catch {
    // The pointer ended already; nothing to capture.
  }
};

const clock = (s: number) => {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
};

const pauseText: Record<string, string> = {
  esc: 'Paused',
  blur: 'Paused: the game lost focus',
  hidden: 'Paused: tab hidden',
  offscreen: 'Paused: scrolled out of view',
};

function Controls({ coarse }: { coarse: boolean }) {
  if (coarse) {
    return (
      <ul className={styles.keys} aria-label="Controls">
        <li>
          <b>Left pad</b> move and turn
        </li>
        <li>
          <b>Fire</b> shoot
        </li>
      </ul>
    );
  }
  return (
    <ul className={styles.keys} aria-label="Controls">
      <li>
        <kbd>W</kbd>
        <kbd>S</kbd> or <kbd>↑</kbd>
        <kbd>↓</kbd> move
      </li>
      <li>
        <kbd>A</kbd>
        <kbd>D</kbd> strafe
      </li>
      <li>
        <kbd>←</kbd>
        <kbd>→</kbd> or mouse turn
      </li>
      <li>
        <kbd>Space</kbd> or click fire
      </li>
      <li>
        <kbd>M</kbd> minimap
      </li>
      <li>
        <kbd>Esc</kbd> pause, again to exit
      </li>
    </ul>
  );
}

export default function GamePlayer({ onExit }: Props) {
  const screenRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const exitRef = useRef(onExit);
  exitRef.current = onExit;
  const stickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const stickActive = useRef(false);
  const [hud, setHud] = useState<Hud | null>(null);
  const [coarse] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
  );

  useEffect(() => {
    const screen = screenRef.current;
    const canvas = canvasRef.current;
    if (!screen || !canvas) return undefined;
    const game = new Game({
      container: screen,
      canvas,
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      coarse: window.matchMedia('(pointer: coarse)').matches,
      onHud: setHud,
      onQuit: () => exitRef.current(),
    });
    gameRef.current = game;
    return () => {
      game.destroy();
      gameRef.current = null;
    };
  }, []);

  // Move focus into a new blocking screen, except when the visitor has
  // already moved on (blur, hidden tab, scrolled away).
  const status = hud?.status;
  const reason = hud?.pauseReason;
  useEffect(() => {
    if (!status || status === 'playing') return;
    if (status === 'paused' && reason !== 'esc') return;
    overlayRef.current
      ?.querySelector<HTMLElement>('button')
      ?.focus({ preventScroll: true });
  }, [status, reason]);

  const game = () => gameRef.current;

  const onStick = (e: ReactPointerEvent<HTMLDivElement>) => {
    const pad = stickRef.current;
    if (!pad) return;
    const r = pad.getBoundingClientRect();
    const radius = r.width / 2;
    let dx = (e.clientX - (r.left + radius)) / radius;
    let dy = (e.clientY - (r.top + radius)) / radius;
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }
    const dead = (v: number) => (Math.abs(v) < 0.18 ? 0 : v);
    game()?.setStick(dead(dx), dead(dy));
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx * radius * 0.55}px, ${
        dy * radius * 0.55
      }px)`;
    }
  };
  const endStick = () => {
    stickActive.current = false;
    game()?.setStick(0, 0);
    if (knobRef.current) knobRef.current.style.transform = '';
  };

  const playing = status === 'playing';
  let live = '';
  if (status === 'won') live = 'All bugs fixed. Ship it.';
  else if (status === 'lost') live = 'System down.';
  else if (status === 'paused') live = pauseText[reason ?? 'esc'];
  else if (hud?.cleared) live = `${hud.levelName} clear. Loading next sector.`;

  return (
    <div
      ref={screenRef}
      className={styles.screen}
      tabIndex={-1}
      role="group"
      aria-label="Bug Hunt game screen"
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <p className={styles.sr} role="status" aria-live="polite">
        {live}
      </p>

      {hud && (
        <div className={styles.hud} data-live={playing}>
          <div className={styles.chip} data-low={hud.hp <= 30}>
            <span className={styles.lab}>Uptime</span>
            <span className={styles.val}>{hud.hp}%</span>
            <span className={styles.bar} aria-hidden="true">
              <span style={{ width: `${(hud.hp / MAX_HP) * 100}%` }} />
            </span>
          </div>
          <div className={styles.chip}>
            <span className={styles.lab}>Bugs fixed</span>
            <span className={styles.val}>
              {hud.levelFixed}/{hud.levelTotal}
            </span>
            <span className={styles.sub}>
              {hud.levelName} · {clock(hud.time)}
            </span>
          </div>
          <div className={styles.chip} data-low={hud.lowAmmo}>
            <span className={styles.lab}>Patches</span>
            <span className={styles.val}>{hud.ammo}</span>
          </div>
          <div className={styles.tools}>
            <button
              type="button"
              className={styles.tool}
              aria-pressed={hud.minimap}
              onClick={() => game()?.toggleMinimap()}
            >
              Map
            </button>
            <button
              type="button"
              className={styles.tool}
              aria-pressed={hud.sound}
              onClick={() => game()?.setSound(!hud.sound)}
            >
              Sound {hud.sound ? 'on' : 'off'}
            </button>
          </div>
          {hud.cleared && (
            <p className={styles.banner}>
              {hud.levelName} clear. Next sector loading.
            </p>
          )}
        </div>
      )}

      {playing && coarse && (
        <>
          <div
            ref={stickRef}
            className={styles.stick}
            onPointerDown={(e) => {
              capture(e);
              stickActive.current = true;
              onStick(e);
            }}
            onPointerMove={(e) => {
              if (stickActive.current) onStick(e);
            }}
            onPointerUp={endStick}
            onPointerCancel={endStick}
            aria-hidden="true"
          >
            <span ref={knobRef} className={styles.knob} />
          </div>
          <div
            className={styles.fire}
            onPointerDown={(e) => {
              capture(e);
              game()?.setFire(true);
            }}
            onPointerUp={() => game()?.setFire(false)}
            onPointerCancel={() => game()?.setFire(false)}
            aria-hidden="true"
          >
            Fire
          </div>
        </>
      )}

      {hud && !playing && (
        <div ref={overlayRef} className={styles.overlay} data-kind={status}>
          {status === 'ready' && (
            <>
              <h3 className={styles.title}>Bug Hunt</h3>
              <p className={styles.line}>
                Clear every bug in the data center before the system goes down.
              </p>
              <Controls coarse={coarse} />
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.primary}
                  onClick={() => game()?.start()}
                >
                  Start
                </button>
                <button
                  type="button"
                  className={styles.quiet}
                  aria-pressed={hud.sound}
                  onClick={() => game()?.setSound(!hud.sound)}
                >
                  Sound {hud.sound ? 'on' : 'off'}
                </button>
                <button
                  type="button"
                  className={styles.quiet}
                  onClick={() => onExit()}
                >
                  Close
                </button>
              </div>
            </>
          )}
          {status === 'paused' && (
            <>
              <h3 className={styles.title}>{pauseText[reason ?? 'esc']}</h3>
              <Controls coarse={coarse} />
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.primary}
                  onClick={() => game()?.resume()}
                >
                  Resume
                </button>
                <button
                  type="button"
                  className={styles.quiet}
                  onClick={() => game()?.restart()}
                >
                  Restart
                </button>
                <button
                  type="button"
                  className={styles.quiet}
                  aria-pressed={hud.sound}
                  onClick={() => game()?.setSound(!hud.sound)}
                >
                  Sound {hud.sound ? 'on' : 'off'}
                </button>
                <button
                  type="button"
                  className={styles.quiet}
                  onClick={() => onExit()}
                >
                  Exit
                </button>
              </div>
            </>
          )}
          {(status === 'won' || status === 'lost') && (
            <>
              <h3 className={styles.title} data-tone={status}>
                {status === 'won' ? 'All bugs fixed. Ship it.' : 'System down.'}
              </h3>
              <dl className={styles.stats}>
                <div>
                  <dt>Time</dt>
                  <dd>{clock(hud.time)}</dd>
                </div>
                <div>
                  <dt>Bugs fixed</dt>
                  <dd>{hud.fixed}</dd>
                </div>
              </dl>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.primary}
                  onClick={() => game()?.restart()}
                >
                  Restart
                </button>
                <button
                  type="button"
                  className={styles.quiet}
                  onClick={() => onExit()}
                >
                  Exit
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
