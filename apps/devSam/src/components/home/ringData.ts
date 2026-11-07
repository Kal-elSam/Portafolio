// The panels of the "All projects" ring, derived from the real project data.
// Nothing here is invented: every project in PROJECTS has exactly one panel,
// and a project without a usable screen gets a typographic panel with its own
// stated data (name, area, role or "Contribution", year when a source gives
// one), never a fake picture.

import { AREAS, metaLine, PROJECTS } from '@/components/prototype/map/data';
import { PRIMARY } from '@/components/prototype/wall/screens';

import type { AreaId, MapProject } from '@/components/prototype/map/data';

export type PanelKind = 'image' | 'type' | 'terminal';

export type RingPanel = {
  id: string;
  project: MapProject;
  kind: PanelKind;
  /** Display name: the project's own name without its subtitle. */
  name: string;
  /** Company, then role or relation: stated facts only. */
  meta: string;
  src: string;
  lo: string;
  w: number;
  h: number;
  /** Frame aspect (width / height) of the panel the screen sits in. */
  frame: number;
  /** Image aspect divided by frame aspect (contain fit). 1 for non-images. */
  fit: number;
};

export const KAIRO_ID = 'kairo-runtime';
export const KAIRO_COMMAND = 'npx @kal-elsam/kairo-runtime';
export const KAIRO_SLOGAN = 'The right agent for every task.';
export const KAIRO_REPO = 'github.com/Kal-elSam/harness';

/**
 * Screens that are only a login (owner exclusion) get a typographic panel
 * even though the wall has a picture for them.
 */
const LOGIN_ONLY = new Set(['volaris-analytics', 'acolyte-health']);

export type Shot = { src: string; lo: string; w: number; h: number };

export const SHOTS = new Map<string, Shot>();
PRIMARY.forEach((s) => {
  if (s.kind === 'image' && !LOGIN_ONLY.has(s.project.id)) {
    SHOTS.set(s.project.id, { src: s.src, lo: s.lo, w: s.w, h: s.h });
  }
});
// public/assets/projects/personal/cinemapedia/1.png, 288x625, as WebP.
SHOTS.set('cinemapedia', {
  src: '/assets/images/home/cinemapedia.webp',
  lo: '/assets/images/home/cinemapedia.webp',
  w: 288,
  h: 625,
});

// public/assets/projects/kc/cardAgente/card.png, 722x1434, as a 560 px WebP.
// A real, legible mobile screen, so the project gets it instead of a type panel.
SHOTS.set('card-tu-agente', {
  src: '/assets/images/home/card-tu-agente.webp',
  lo: '/assets/images/home/card-tu-agente.webp',
  w: 560,
  h: 1113,
});

export const label = (p: MapProject) => p.name.split(' — ')[0];

const clampFrame = (aspect: number) => Math.min(2.3, Math.max(1.3, aspect));

const toPanel = (p: MapProject): RingPanel => {
  const shot = SHOTS.get(p.id);
  const base = {
    id: p.id,
    project: p,
    name: label(p),
    meta: metaLine(p),
  };
  if (p.id === KAIRO_ID) {
    return {
      ...base,
      kind: 'terminal',
      src: '',
      lo: '',
      w: 1280,
      h: 800,
      frame: 1.6,
      fit: 1,
    };
  }
  if (shot) {
    const aspect = shot.w / shot.h;
    const frame = clampFrame(aspect);
    return { ...base, kind: 'image', ...shot, frame, fit: aspect / frame };
  }
  return {
    ...base,
    kind: 'type',
    src: '',
    lo: '',
    w: 1280,
    h: 800,
    frame: 1.6,
    fit: 1,
  };
};

// Areas in ring order. AI leads so Kairo sits first with its own area around
// it. Inside an area, pictures and typographic panels are interleaved evenly,
// so the ring has a rhythm instead of a run of one kind.
const AREA_ORDER: AreaId[] = ['ai', 'insurance', 'mobile', 'web'];

const interleave = (pics: RingPanel[], types: RingPanel[]) => {
  const total = pics.length + types.length;
  const out: RingPanel[] = [];
  let pi = 0;
  let ti = 0;
  for (let i = 0; i < total; i += 1) {
    const wantPic =
      pics.length > 0 && (pi + 0.5) / pics.length <= (i + 1) / total;
    if ((wantPic && pi < pics.length) || ti >= types.length) {
      out.push(pics[pi]);
      pi += 1;
    } else {
      out.push(types[ti]);
      ti += 1;
    }
  }
  return out;
};

export const PANELS: RingPanel[] = (() => {
  const kairo = PROJECTS.find((p) => p.id === KAIRO_ID);
  if (!kairo) throw new Error('All projects: Kairo is missing from the data');
  const out: RingPanel[] = [toPanel(kairo)];
  AREA_ORDER.forEach((area) => {
    const panels = PROJECTS.filter(
      (p) => p.area === area && p.id !== KAIRO_ID
    ).map(toPanel);
    out.push(
      ...interleave(
        panels.filter((p) => p.kind === 'image'),
        panels.filter((p) => p.kind === 'type')
      )
    );
  });
  return out;
})();

// Filters follow the ring's own order and carry the real count of each area,
// so the row reads as the range of work, with no area placed first by weight.
export const FILTERS = AREA_ORDER.map((id) => {
  const area = AREAS.find((a) => a.id === id);
  return {
    id,
    label: area?.short ?? id,
    count: PROJECTS.filter((p) => p.area === id).length,
  };
});

/** First panel of an area's block, the one nearest to `from` around the ring. */
export const firstOfArea = (area: AreaId, from: number) => {
  const n = PANELS.length;
  let best = 0;
  let bestD = Infinity;
  PANELS.forEach((panel, i) => {
    const prev = PANELS[(i - 1 + n) % n];
    if (panel.project.area !== area || prev.project.area === area) return;
    const raw = Math.abs(i - (((from % n) + n) % n));
    const d = Math.min(raw, n - raw);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
};

export const areaName = (id: AreaId) =>
  AREAS.find((a) => a.id === id)?.name ?? '';
