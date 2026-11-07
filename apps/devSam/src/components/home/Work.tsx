import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { KAIRO_COMMAND } from './data';
import {
  ARCHIVE,
  BENCH,
  commitsLabel,
  dots,
  GITHUB,
  LANGUAGE_SHARES,
  orderBy,
  PROJECT_COUNT,
  TECH_HEAD,
  TECHS,
  usesAny,
} from './workData';
import { ProjectAction, useMedia } from './WorkLink';
import WorkMap from './WorkMap';
import { CUT, Diagram, Screen } from './WorkScreen';

import type { WorkItem } from './workData';

import home from './home.module.css';
import styles from './work.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

const joinNames = (names: string[]) =>
  names.length < 3
    ? names.join(' or ')
    : `${names.slice(0, -1).join(', ')} or ${names[names.length - 1]}`;

// A bench project with no screen (Kairo is backend and CLI): its schematic,
// large, with the trace control, and its real install command as plain text.
function SchematicStage({ item }: { item: WorkItem }) {
  const [run, setRun] = useState(0);
  const [tracing, setTracing] = useState(false);
  const def = item.schematic;
  if (!def) return null;
  const canTrace = def.variant === 'flow';
  return (
    <div className={styles.stageDiagram}>
      <div className={styles.stageHead}>
        <span className={`${styles.stageCap} ${home.mono}`}>How it works</span>
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
      <div className={styles.stageArt}>
        <Diagram def={def} run={run} onTraceEnd={() => setTracing(false)} />
      </div>
      {item.project.id === 'kairo-runtime' ? (
        <div className={styles.cmd}>
          <span className={`${styles.cmdLabel} ${home.mono}`}>Install</span>
          <pre className={`${styles.cmdLine} ${home.mono}`}>
            <code>{KAIRO_COMMAND}</code>
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function Panel({
  item,
  position,
  active,
  selected,
  onToggle,
  onStep,
}: {
  item: WorkItem;
  position: number;
  active: boolean;
  selected: string[];
  onToggle: (name: string) => void;
  onStep: (by: number) => void;
}) {
  const { project } = item;
  return (
    <div
      id={`work-panel-${item.project.id}`}
      role="tabpanel"
      aria-labelledby={`work-tab-${item.project.id}`}
      className={styles.panel}
      data-active={active ? '' : undefined}
      data-project={project.id}
    >
      <div className={styles.stage}>
        <div className={`${CUT} ${styles.frame}`}>
          {item.shots.length ? (
            <Screen shots={item.shots} alt={`${item.name} screen`} />
          ) : (
            <SchematicStage item={item} />
          )}
        </div>
        <div className={styles.stageBar}>
          <span className={`${styles.counter} ${home.mono}`}>
            {pad(position + 1)} / {pad(BENCH.length)}
          </span>
          <span className={styles.steps}>
            <button
              type="button"
              className={styles.step}
              onClick={() => onStep(-1)}
              aria-label="Previous project"
              tabIndex={active ? 0 : -1}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className={styles.step}
              onClick={() => onStep(1)}
              aria-label="Next project"
              tabIndex={active ? 0 : -1}
            >
              <span aria-hidden="true">→</span>
            </button>
          </span>
        </div>
      </div>

      <div className={styles.detail}>
        <h3 className={styles.detailName}>{item.name}</h3>
        <p className={`${styles.detailMeta} ${home.mono}`}>
          {dots(item.meta, item.platform, project.year)}
        </p>
        {commitsLabel(item) ? (
          <p className={`${styles.commits} ${home.mono}`}>
            {commitsLabel(item)}
          </p>
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
                tabIndex={active ? 0 : -1}
              >
                {t}
              </button>
            ))}
          </div>
        ) : null}
        <div className={styles.actionRow}>
          <ProjectAction
            project={project}
            className={`${CUT} ${styles.open}`}
            noteClassName={`${styles.note} ${home.mono}`}
            lockClassName={styles.lock}
          />
        </div>
      </div>
    </div>
  );
}

// The section is a bench, a stack strip and a system map. The bench holds every
// panel stacked in one grid cell, so switching never changes the section
// height; the base markup (first project visible, every link present) is the
// complete page without JavaScript.
export default function Work() {
  const [activeId, setActiveId] = useState(BENCH[0].project.id);
  const [selected, setSelected] = useState<string[]>([]);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const tablistRef = useRef<HTMLDivElement>(null);
  const allRef = useRef<HTMLDetailsElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const vertical = useMedia('(min-width: 1100px)');

  // Picking a technology puts the projects that use it first. The panels keep
  // their place (so nothing below moves); only the tabs follow this order.
  const order = orderBy(BENCH, selected);
  const active = Math.max(
    0,
    order.findIndex((i) => i.project.id === activeId)
  );
  const orderRef = useRef(order);
  orderRef.current = order;

  const go = useCallback((index: number, focus = false) => {
    const list = orderRef.current;
    const next = list[(index + list.length) % list.length];
    setActiveId(next.project.id);
    const tab = tabRefs.current.get(next.project.id);
    if (focus) tab?.focus();
    // Keep the chosen tab in view inside a horizontal strip, without moving
    // the page.
    const strip = tablistRef.current;
    if (tab && strip && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({
        left: tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    }
  }, []);

  // Warm the neighbours' screens so a switch never waits on the network.
  useEffect(() => {
    [active - 1, active + 1].forEach((i) => {
      const item = order[(i + order.length) % order.length];
      item.shots.forEach((s) => {
        new Image().src = s.src;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Reordering moves the tabs: a focused tab keeps its focus.
  const focusedTab = useRef<string | null>(null);
  useLayoutEffect(() => {
    const id = focusedTab.current;
    focusedTab.current = null;
    if (id && document.activeElement === document.body) {
      tabRefs.current.get(id)?.focus();
    }
  }, [selected]);

  // The list of every technology closes on Escape or a click outside it.
  useEffect(() => {
    const close = (event: Event) => {
      const el = allRef.current;
      if (!el?.open) return;
      if (event instanceof KeyboardEvent && event.key !== 'Escape') return;
      if (event instanceof MouseEvent && el.contains(event.target as Node))
        return;
      el.open = false;
    };
    document.addEventListener('keydown', close);
    document.addEventListener('mousedown', close);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('mousedown', close);
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: order.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    go(keys[event.key], true);
  };

  const onTouchStart = (event: React.TouchEvent) => {
    const t = event.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(active + (dx < 0 ? 1 : -1));
    }
  };

  const toggle = (name: string) => {
    const el = document.activeElement;
    focusedTab.current =
      el instanceof HTMLElement && el.getAttribute('role') === 'tab'
        ? el.id.replace('work-tab-', '')
        : null;
    const next = selected.includes(name)
      ? selected.filter((t) => t !== name)
      : [...selected, name];
    setSelected(next);
    // If the project on show does not use the picked technologies, show the
    // first one that does. Clearing the filter keeps the selection.
    const shown = BENCH.find((i) => i.project.id === activeId);
    if (next.length > 0 && shown && !usesAny(shown.project, next)) {
      const first = orderBy(BENCH, next).find((i) => usesAny(i.project, next));
      if (first) setActiveId(first.project.id);
    }
  };

  // The hero asks for a technology: pick it (replacing the previous pick).
  // Work scrolls nothing; the hero scrolls to #projects itself.
  useEffect(() => {
    const onPick = (event: Event) => {
      const name = (event as CustomEvent<string>).detail;
      if (typeof name === 'string' && TECHS.some((t) => t.name === name)) {
        setSelected([name]);
        setActiveId((current) => {
          const shown = BENCH.find((i) => i.project.id === current);
          if (shown && usesAny(shown.project, [name])) return current;
          const first = orderBy(BENCH, [name]).find((i) =>
            usesAny(i.project, [name])
          );
          return first ? first.project.id : current;
        });
      }
    };
    window.addEventListener('work:pick', onPick);
    return () => window.removeEventListener('work:pick', onPick);
  }, []);

  const filtering = selected.length > 0;
  const matchCount = BENCH.concat(ARCHIVE.flatMap((g) => g.items)).filter(
    (item) => usesAny(item.project, selected)
  ).length;

  const head = TECHS.slice(0, TECH_HEAD);
  const rest = TECHS.slice(TECH_HEAD);

  const chip = (name: string, count: number) => (
    <button
      key={name}
      type="button"
      className={styles.tech}
      aria-pressed={selected.includes(name)}
      onClick={() => toggle(name)}
    >
      {name}
      <span className={home.mono}>{count}</span>
    </button>
  );

  return (
    <section
      id="projects"
      className={`${home.section} ${styles.work}`}
      aria-labelledby="work-title"
    >
      <header className={styles.head}>
        <div>
          <p className={`${styles.eyebrow} ${home.mono}`}>&#47;&#47; Work</p>
          <h2 id="work-title" className={home.h2}>
            Selected work
          </h2>
        </div>
        <figure className={styles.langs}>
          <figcaption className={`${styles.langHead} ${home.mono}`}>
            {PROJECT_COUNT} projects · {GITHUB.repositories} repositories
          </figcaption>
          <div className={styles.langBar} aria-hidden="true">
            {LANGUAGE_SHARES.map((l) => (
              <span
                key={l.name}
                style={{ '--p': l.percent } as React.CSSProperties}
              />
            ))}
          </div>
          <ul
            className={styles.langList}
            aria-label={`Code by language across ${GITHUB.repositories} repositories, in bytes, GitHub, ${GITHUB.asOf}`}
          >
            {LANGUAGE_SHARES.map((l) => (
              <li key={l.name}>
                <i aria-hidden="true" />
                {l.name}{' '}
                <span className={home.mono}>
                  {l.percent < 1 ? '<1' : Math.round(l.percent)}%
                </span>
              </li>
            ))}
          </ul>
        </figure>
      </header>

      <div className={styles.stack}>
        <div className={styles.stackHead}>
          <h3 className={`${styles.stackTitle} ${home.mono}`}>Stack</h3>
          <details ref={allRef} className={styles.all}>
            <summary className={styles.more}>All {TECHS.length}</summary>
            <div
              className={styles.pop}
              role="group"
              aria-label="Every technology"
            >
              {rest.map((t) => chip(t.name, t.count))}
            </div>
          </details>
          <div className={styles.picked}>
            {selected.map((name) => (
              <button
                key={name}
                type="button"
                className={styles.pickedChip}
                onClick={() => toggle(name)}
                aria-label={`Remove ${name} from the filter`}
              >
                {name}
                <span aria-hidden="true"> ×</span>
              </button>
            ))}
            <p
              className={styles.stackStatus}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {filtering ? (
                <>
                  <strong>{matchCount}</strong> of {PROJECT_COUNT} projects use{' '}
                  {joinNames(selected)}
                </>
              ) : (
                <>Pick a technology to light up the projects that use it.</>
              )}
            </p>
          </div>
          <button
            type="button"
            className={styles.clear}
            onClick={() => setSelected([])}
            hidden={!filtering}
          >
            Clear
          </button>
        </div>
        <div
          className={`${styles.techs} ${styles.techsHead}`}
          role="group"
          aria-label="Filter projects by technology"
        >
          {head.map((t) => chip(t.name, t.count))}
        </div>
      </div>

      <div className={styles.bench}>
        {/* Without JavaScript the tabs and arrows do nothing: every panel is
            shown one after another instead, so all 8 projects and their links
            can be read and reached. */}
        <noscript>
          <style>
            {`.${styles.bench}{grid-template-columns:minmax(0,1fr)}.${styles.tabs}{display:none}.${styles.steps}{display:none}.${styles.panels}{row-gap:2.5rem}.${styles.panel}{grid-area:auto;visibility:visible;opacity:1;transform:none;pointer-events:auto}.${styles.detail} *{opacity:1;transform:none}`}
          </style>
        </noscript>
        <div
          ref={tablistRef}
          className={styles.tabs}
          role="tablist"
          aria-label="Selected projects"
          aria-orientation={vertical ? 'vertical' : 'horizontal'}
        >
          {order.map((item, i) => {
            const { id } = item.project;
            const hit = usesAny(item.project, selected);
            return (
              <button
                key={id}
                ref={(node) => {
                  if (node) tabRefs.current.set(id, node);
                }}
                id={`work-tab-${id}`}
                type="button"
                role="tab"
                className={styles.tab}
                aria-selected={activeId === id}
                aria-controls={`work-panel-${id}`}
                tabIndex={activeId === id ? 0 : -1}
                data-dim={filtering && !hit ? '' : undefined}
                data-hit={filtering && hit ? '' : undefined}
                onClick={() => go(i)}
                onKeyDown={onKeyDown}
              >
                <span className={`${styles.tabNo} ${home.mono}`}>
                  {pad(i + 1)}
                </span>
                <span className={styles.tabName}>{item.name}</span>
                <span className={styles.tabMeta}>{item.meta}</span>
                {commitsLabel(item) ? (
                  <span className={`${styles.tabCommits} ${home.mono}`}>
                    {commitsLabel(item)}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div
          className={styles.panels}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {BENCH.map((item) => (
            <Panel
              key={item.project.id}
              item={item}
              position={order.findIndex((o) => o === item)}
              active={activeId === item.project.id}
              selected={selected}
              onToggle={toggle}
              onStep={(by) => go(active + by)}
            />
          ))}
        </div>
      </div>

      <WorkMap selected={selected} onToggle={toggle} />
    </section>
  );
}
