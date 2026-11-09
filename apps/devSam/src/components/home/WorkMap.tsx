import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { gsap, useGSAP } from '@/components/prototype/gsap';

import {
  ARCHIVE,
  ARCHIVE_COUNT,
  commitsLabel,
  dots,
  orderBy,
  usesAny,
} from './workData';
import { ProjectAction } from './WorkLink';
import { CUT, Diagram, Screen, useTilt } from './WorkScreen';

import type { WorkItem } from './workData';

import home from './home.module.css';
import styles from './workMap.module.css';

const ALL = ARCHIVE.flatMap((g) => g.items);
// Backend and command-line projects get a request trace on their schematic.
const traceable = (item: WorkItem) =>
  item.schematic?.variant === 'flow' &&
  (item.project.platform === 'api' || item.project.platform === 'cli');

function Inspector({
  item,
  selected,
  onToggle,
}: {
  item: WorkItem;
  selected: string[];
  onToggle: (name: string) => void;
}) {
  const [run, setRun] = useState(0);
  const [tracing, setTracing] = useState(false);
  const canTrace = traceable(item);
  const commits = commitsLabel(item);
  let status = `Showing ${item.name}`;
  if (tracing) status = 'Tracing a request through the diagram.';
  else if (run > 0) status = 'Trace complete.';
  let frame: React.ReactNode = null;
  if (item.shots.length > 0) {
    frame = <Screen shots={item.shots} alt={`${item.name} screen`} />;
  } else if (item.schematic) {
    frame = (
      <Diagram
        def={item.schematic}
        run={run}
        onTraceEnd={() => setTracing(false)}
      />
    );
  }
  return (
    <div className={styles.inBody}>
      <p className={home.srOnly} role="status">
        {status}
      </p>
      {item.schematic ? (
        <div className={styles.inCapRow}>
          <p className={`${styles.inCap} ${home.mono}`}>How it works</p>
          {canTrace ? (
            <button
              type="button"
              className={`${styles.trace} ${home.mono}`}
              aria-pressed={tracing}
              onClick={() => {
                setTracing(true);
                setRun((r) => r + 1);
              }}
            >
              Trace a request
            </button>
          ) : null}
        </div>
      ) : null}
      <div className={`${CUT} ${styles.inFrame}`} data-sweep="">
        <div className={styles.inDevice} data-tilt data-tilt-deg="5">
          {frame}
          <span className={styles.inGlare} data-glare aria-hidden="true" />
        </div>
      </div>
      <h4 className={styles.inName}>{item.name}</h4>
      <p className={`${styles.inMeta} ${home.mono}`}>
        {dots(item.meta, item.platform, item.project.year)}
      </p>
      {commits ? (
        <p className={`${styles.commits} ${home.mono}`}>{commits}</p>
      ) : null}
      <dl className={styles.facts}>
        {item.line ? (
          <div>
            <dt>What it is</dt>
            <dd>{item.line}</dd>
          </div>
        ) : null}
        {item.role ? (
          <div>
            <dt>Role</dt>
            <dd>{item.role}</dd>
          </div>
        ) : null}
        {item.impact ? (
          <div>
            <dt>Impact</dt>
            <dd>{item.impact}</dd>
          </div>
        ) : null}
      </dl>
      {item.stack.length > 0 ? (
        <div
          className={styles.chips}
          role="group"
          aria-label={`${item.name} stack`}
        >
          {item.stack.map((t) => (
            <button
              key={t}
              type="button"
              className={styles.chip}
              aria-pressed={selected.includes(t)}
              onClick={() => onToggle(t)}
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}
      <div className={styles.actionRow}>
        <ProjectAction
          project={item.project}
          className={`${CUT} ${styles.open}`}
          noteClassName={`${styles.note} ${home.mono}`}
          lockClassName={styles.lock}
        />
      </div>
    </div>
  );
}

type Layer = {
  w: number;
  h: number;
  stubs: { d: string; lit: boolean }[];
  chains: string[];
};

const EMPTY: Layer = { w: 0, h: 0, stubs: [], chains: [] };

function LockMark() {
  return (
    <svg viewBox="0 0 12 14" aria-hidden="true" focusable="false">
      <rect
        x="1"
        y="6"
        width="10"
        height="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

type Company = (typeof ARCHIVE)[number];

// The archive as a company select: one armoured panel per company, closed by
// default; one opens at a time and shows that company's tiles and an
// inspector. Traces between tiles that share a picked technology are drawn
// inside the open panel. Without JavaScript every panel is open and every
// project and link is in the HTML.
export default function WorkMap({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (name: string) => void;
}) {
  const [open, setOpen] = useState<Company['group'] | null>(null);
  const [activeId, setActiveId] = useState(ALL[0].project.id);
  const [ready, setReady] = useState(false);
  const [power, setPower] = useState(false);
  const [layer, setLayer] = useState<Layer>(EMPTY);
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLElement>());
  const btnRefs = useRef(new Map<string, HTMLButtonElement>());
  const bodyRefs = useRef(new Map<string, HTMLElement>());
  const anchor = useRef<{ el: HTMLElement; top: number } | null>(null);

  const active = ALL.find((item) => item.project.id === activeId) ?? ALL[0];
  const filtering = selected.length > 0;
  const selectedKey = selected.join('|');
  const hitsOf = (items: WorkItem[]) =>
    items.filter((i) => usesAny(i.project, selected)).length;
  const matching = ARCHIVE.filter((c) => hitsOf(c.items) > 0);

  useEffect(() => setReady(true), []);

  // A filter change that dims the chosen project while its company is open
  // moves the inspector to that company's first match. No match, or clearing
  // the filter, keeps the selection. Focus is never touched.
  useEffect(() => {
    if (!open || selected.length === 0) return;
    const company = ARCHIVE.find((c) => c.group === open);
    if (!company || hitsOf(company.items) === 0) return;
    const chosen = company.items.find((i) => i.project.id === activeId);
    if (chosen && usesAny(chosen.project, selected)) return;
    setActiveId(orderBy(company.items, selected)[0].project.id);
    // Runs only when the filter changes, so picking a dimmed tile by hand
    // is not overridden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  // Pointer tilt on hover-capable devices: panels, tiles and the inspector.
  useTilt(mapRef, 'map');

  // The page must not jump: a panel above the clicked one may close in the
  // same gesture, so the clicked button is put back where it was.
  useLayoutEffect(() => {
    const held = anchor.current;
    anchor.current = null;
    if (!held) return;
    const delta = held.el.getBoundingClientRect().top - held.top;
    if (Math.abs(delta) > 1)
      window.scrollBy({ top: delta, behavior: 'instant' });
  }, [open]);

  // Power-up along the traces, then the tiles deal out from depth. Short, and
  // never blocking: the next toggle kills what is running.
  useEffect(() => {
    if (!open) {
      setPower(false);
      return undefined;
    }
    setPower(true);
    const t = window.setTimeout(() => setPower(false), 900);
    return () => window.clearTimeout(t);
  }, [open]);

  useGSAP(
    () => {
      if (!open) return undefined;
      const body = bodyRefs.current.get(open);
      if (!body) return undefined;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tiles = gsap.utils.toArray<HTMLElement>('[data-node]', body);
        const tween = gsap.fromTo(
          tiles,
          {
            autoAlpha: 0,
            y: 40,
            rotateX: 16,
            transformPerspective: 900,
            transformOrigin: '50% 100%',
          },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: { each: 0.03, amount: 0.25 },
            clearProps: 'transform,opacity,visibility',
          }
        );
        return () => {
          tween.kill();
          gsap.set(tiles, { clearProps: 'all' });
        };
      });
      return () => mm.revert();
    },
    { dependencies: [open], scope: mapRef, revertOnUpdate: true }
  );

  const measure = useCallback(() => {
    const root = canvasRef.current;
    if (!root || !open) {
      setLayer((l) => (l.stubs.length ? EMPTY : l));
      return;
    }
    // Below 900px the tiles are a plain grid: no traces.
    if (!window.matchMedia('(min-width: 900px)').matches) {
      setLayer((l) => (l.stubs.length ? EMPTY : l));
      return;
    }
    // Layout positions (offsets), not painted rectangles: tiles may be
    // mid-entry or tilted when this runs.
    const within = (el: HTMLElement) => {
      let x = 0;
      let y = 0;
      let cur: HTMLElement | null = el;
      while (cur && cur !== root) {
        x += cur.offsetLeft;
        y += cur.offsetTop;
        cur = cur.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-node]')
    ).map((el) => {
      const p = within(el);
      const stack = (el.getAttribute('data-stack') ?? '').split('|');
      return {
        stack,
        l: p.x,
        r: p.x + el.offsetWidth,
        t: p.y,
        b: p.y + el.offsetHeight,
        rail: 6.5,
      };
    });

    const stubs = nodes.map((n) => ({
      d: `M${n.rail},${(n.t + n.b) / 2} H${n.l}`,
      lit: selected.some((t) => n.stack.includes(t)),
    }));

    const chains: string[] = [];
    selected.forEach((tech) => {
      const hits = nodes
        .filter((n) => n.stack.includes(tech))
        .sort((a, b) => (Math.abs(a.t - b.t) < 12 ? a.l - b.l : a.t - b.t));
      for (let i = 0; i < hits.length - 1; i += 1) {
        const a = hits[i];
        const b = hits[i + 1];
        const ay = (a.t + a.b) / 2;
        const by = (b.t + b.b) / 2;
        const ax = (a.l + a.r) / 2;
        const bx = (b.l + b.r) / 2;
        if (Math.abs(ay - by) < 12) {
          chains.push(`M${ax},${ay} H${bx}`);
        } else {
          const ym = (a.b + b.t) / 2;
          chains.push(`M${ax},${ay} V${ym} H${bx} V${by}`);
        }
      }
    });

    setLayer({ w: root.scrollWidth, h: root.scrollHeight, stubs, chains });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, open]);

  useLayoutEffect(() => {
    measure();
  }, [measure, ready]);

  useEffect(() => {
    const root = canvasRef.current;
    if (!root) return undefined;
    const observer = new ResizeObserver(() => measure());
    observer.observe(root);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, open]);

  // Open one company, close the one that was open, in the same gesture.
  // Choosing the open one closes it. The inspector starts on the company's
  // first project (a match, when a technology is picked).
  const toggleCompany = (company: Company, button: HTMLButtonElement) => {
    anchor.current = { el: button, top: button.getBoundingClientRect().top };
    if (open === company.group) {
      setOpen(null);
      return;
    }
    const first = orderBy(company.items, selected)[0];
    setActiveId(first.project.id);
    setOpen(company.group);
  };

  // Escape closes the open company and returns focus to its button, when focus
  // is on that button or inside its panel.
  useEffect(() => {
    if (!open) return undefined;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const button = btnRefs.current.get(open);
      const body = bodyRefs.current.get(open);
      const at = document.activeElement;
      if (at && (at === button || body?.contains(at))) {
        event.preventDefault();
        setOpen(null);
        button?.focus();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open]);

  const pick = (item: WorkItem) => {
    setActiveId(item.project.id);
    // Below the wide layout the inspector sits above the tiles: bring it into
    // view.
    if (!window.matchMedia('(min-width: 1100px)').matches) {
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      window.requestAnimationFrame(() =>
        inspectorRef.current?.scrollIntoView({
          block: 'nearest',
          behavior: reduce ? 'auto' : 'smooth',
        })
      );
    }
  };

  const onClick = (event: React.MouseEvent, item: WorkItem) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    pick(item);
  };

  // Arrow keys move between the tiles of the open panel in visual order.
  const onKeyDown = (event: React.KeyboardEvent, item: WorkItem) => {
    if (event.key === ' ') {
      event.preventDefault();
      pick(item);
      return;
    }
    if (
      !event.key.startsWith('Arrow') &&
      event.key !== 'Home' &&
      event.key !== 'End'
    )
      return;
    const visible = Array.from(
      canvasRef.current?.querySelectorAll<HTMLElement>('[data-node]') ?? []
    )
      .filter((el) => el.offsetParent !== null)
      .map((el) => ALL.find((i) => i.project.id === el.dataset.node))
      .filter((i): i is WorkItem => Boolean(i));
    const at = visible.findIndex((i) => i.project.id === item.project.id);
    let target: WorkItem | undefined;
    if (event.key === 'ArrowRight') target = visible[at + 1];
    else if (event.key === 'ArrowLeft') target = visible[at - 1];
    else if (event.key === 'Home') [target] = visible;
    else if (event.key === 'End') target = visible[visible.length - 1];
    else {
      const down = event.key === 'ArrowDown';
      const from = nodeRefs.current
        .get(item.project.id)
        ?.getBoundingClientRect();
      if (from) {
        let best = Infinity;
        visible.forEach((i) => {
          const r = nodeRefs.current.get(i.project.id)?.getBoundingClientRect();
          if (!r) return;
          const dy = (r.top + r.bottom - from.top - from.bottom) / 2;
          if (down ? dy <= 8 : dy >= -8) return;
          const dx = Math.abs((r.left + r.right - from.left - from.right) / 2);
          const score = dx + Math.abs(dy) * 1.5;
          if (score < best) {
            best = score;
            target = i;
          }
        });
      }
    }
    if (!target) return;
    event.preventDefault();
    pick(target);
    nodeRefs.current.get(target.project.id)?.focus();
  };

  const renderNode = (item: WorkItem, isOpen: boolean) => {
    const { id } = item.project;
    const isActive = isOpen && id === activeId;
    const hit = usesAny(item.project, selected);
    const commits = commitsLabel(item);
    const body = (
      <>
        <span className={styles.shadow} aria-hidden="true" />
        <span className={styles.ext} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className={styles.edge} aria-hidden="true" />
        <span className={styles.face} aria-hidden="true">
          <span className={styles.glare} data-glare aria-hidden="true" />
        </span>
        {item.shots.length > 0 ? (
          <span className={styles.float} data-float>
            <Screen shots={item.shots} alt="" thumb />
          </span>
        ) : (
          <span className={`${styles.float} ${styles.plate}`} data-float>
            <span className={`${styles.mark} ${home.mono}`}>{item.mark}</span>
            <span className={`${styles.plateStack} ${home.mono}`}>
              {item.stack.slice(0, 3).join(' · ')}
            </span>
          </span>
        )}
        <span className={styles.label}>
          <span className={styles.name}>{item.name}</span>
          {item.shots.length === 0 ? (
            <span className={styles.short}>{item.short}</span>
          ) : null}
          <span className={`${styles.tag} ${home.mono}`}>
            {dots(item.tag, item.project.year)}
            {commits ? ` · ${commits}` : ''}
          </span>
        </span>
      </>
    );
    return (
      <li
        key={id}
        className={styles.nodeItem}
        data-node={id}
        data-kind={item.shot?.kind ?? 'quiet'}
        data-stack={item.stack.join('|')}
        data-active={isActive ? '' : undefined}
        data-dim={filtering && !hit ? '' : undefined}
        data-hit={filtering && hit ? '' : undefined}
      >
        <div className={styles.lift}>
          {item.project.href ? (
            <a
              ref={(el) => {
                if (el) nodeRefs.current.set(id, el);
              }}
              href={item.project.href}
              target="_blank"
              rel="noopener noreferrer"
              role="button"
              aria-pressed={isActive}
              tabIndex={ready && !isActive ? -1 : 0}
              className={styles.node}
              data-tilt
              onClick={(e) => onClick(e, item)}
              onKeyDown={(e) => onKeyDown(e, item)}
            >
              {body}
            </a>
          ) : (
            <button
              ref={(el) => {
                if (el) nodeRefs.current.set(id, el);
              }}
              type="button"
              aria-pressed={isActive}
              tabIndex={ready && !isActive ? -1 : 0}
              className={styles.node}
              data-tilt
              onClick={() => pick(item)}
              onKeyDown={(e) => onKeyDown(e, item)}
            >
              {body}
            </button>
          )}
        </div>
      </li>
    );
  };

  return (
    <div
      ref={mapRef}
      className={styles.map}
      data-ready={ready ? '' : undefined}
    >
      <header className={styles.head}>
        <h3 className={styles.title}>All projects</h3>
        <p className={`${styles.stat} ${home.mono}`}>
          The other {ARCHIVE_COUNT}: choose a company to open it
        </p>
      </header>

      <div className={styles.roster}>
        {ARCHIVE.map((company) => {
          const { group: name, items } = company;
          const isOpen = open === name;
          const hits = hitsOf(items);
          const bodyId = `work-co-${name.replace(/\W+/g, '-').toLowerCase()}`;
          const btnId = `${bodyId}-btn`;
          const sole = filtering && matching.length === 1 && hits > 0;
          return (
            <div key={name} className={styles.co}>
              <button
                ref={(el) => {
                  if (el) btnRefs.current.set(name, el);
                }}
                id={btnId}
                type="button"
                className={styles.coBtn}
                aria-expanded={ready ? isOpen : undefined}
                aria-controls={bodyId}
                data-lit={filtering && hits > 0 ? '' : undefined}
                data-dim={filtering && hits === 0 ? '' : undefined}
                data-sole={sole ? '' : undefined}
                onClick={(e) => toggleCompany(company, e.currentTarget)}
              >
                <span className={styles.coLift}>
                  <span className={styles.coPlate} data-tilt data-tilt-deg="4">
                    <span className={styles.ext} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className={styles.edge} aria-hidden="true" />
                    <span className={styles.face} aria-hidden="true">
                      <span
                        className={styles.glare}
                        data-glare
                        aria-hidden="true"
                      />
                    </span>
                    <span className={styles.coFront}>
                      <span className={styles.coName}>{name}</span>
                      <span className={`${styles.coStat} ${home.mono}`}>
                        {items.length}{' '}
                        {items.length === 1 ? 'project' : 'projects'}
                        {company.commits > 0
                          ? ` · ${company.commits.toLocaleString(
                              'en-US'
                            )} commits`
                          : ''}
                      </span>
                      <span className={`${styles.coTechs} ${home.mono}`}>
                        {company.techs.join(' · ')}
                      </span>
                      {filtering ? (
                        <span className={`${styles.coMatch} ${home.mono}`}>
                          {hits} / {items.length}
                          {sole ? ' · only match' : ' match'}
                        </span>
                      ) : null}
                    </span>
                    <span className={styles.hatch} aria-hidden="true">
                      <span className={styles.core} />
                      <i className={`${styles.leaf} ${styles.leafL}`} />
                      <i className={`${styles.leaf} ${styles.leafR}`} />
                      <span className={styles.seam}>
                        <LockMark />
                      </span>
                    </span>
                  </span>
                </span>
                <span className={home.srOnly}>
                  {isOpen ? 'Close' : 'Open'} {name}
                </span>
              </button>

              <div
                ref={(el) => {
                  if (el) bodyRefs.current.set(name, el);
                }}
                id={bodyId}
                role="region"
                aria-labelledby={btnId}
                className={styles.coBody}
                data-open={!ready || isOpen ? '' : undefined}
              >
                <div className={styles.bodyGrid}>
                  <div
                    ref={isOpen ? canvasRef : undefined}
                    className={styles.canvas}
                    data-power={isOpen && power ? '' : undefined}
                  >
                    {isOpen ? (
                      <svg
                        className={styles.layer}
                        width={layer.w}
                        height={layer.h}
                        viewBox={`0 0 ${layer.w || 1} ${layer.h || 1}`}
                        aria-hidden="true"
                      >
                        {layer.stubs.map((st) => (
                          <path
                            key={st.d}
                            className={st.lit ? styles.stubLit : styles.stub}
                            d={st.d}
                            pathLength={1}
                          />
                        ))}
                        {layer.chains.map((d) => (
                          <g key={d}>
                            <path className={styles.chainGlow} d={d} />
                            <path className={styles.chain} d={d} />
                          </g>
                        ))}
                      </svg>
                    ) : null}
                    <ul className={styles.tiles}>
                      {orderBy(items, selected).map((item) =>
                        renderNode(item, isOpen)
                      )}
                    </ul>
                  </div>

                  {isOpen ? (
                    <aside
                      ref={inspectorRef}
                      className={`${CUT} ${styles.inspector}`}
                      aria-label="Project details"
                    >
                      <Inspector
                        key={active.project.id}
                        item={active}
                        selected={selected}
                        onToggle={onToggle}
                      />
                    </aside>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
