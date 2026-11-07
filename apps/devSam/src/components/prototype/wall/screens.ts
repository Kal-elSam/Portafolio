// Screen data for the /prototype/wall 3D wall. Prototype-only.
//
// Every panel is one real project from ../map/data (name, link, company and
// role come from there). Images are sized WebP derivatives of the screenshots
// in public/assets/projects, generated without any repo dependency (see
// public/assets/images/prototype-wall). The Kairo Runtime panel is real text
// only: it has no product screenshot, so none is invented.

import { PROJECTS } from '../map/data';

import type { AreaId, MapProject } from '../map/data';

const DIR = '/assets/images/prototype-wall';

export const KAIRO_COMMAND = 'npx @kal-elsam/kairo-runtime';
export const KAIRO_REPO = 'github.com/Kal-elSam/harness';

export type Place = {
  /** Arc length along the wall, in world units. 0 is the wall centre. */
  u: number;
  /** Height of the panel centre. */
  y: number;
  /** Panel width in world units; height follows the image aspect. */
  width: number;
  /** Offset along the wall normal (toward the viewer): depth stagger. */
  dz: number;
};

type Def = {
  /** Defaults to the project id: one primary screen per project. */
  id?: string;
  projectId: string;
  /** Image file base name under DIR; null for the text-only panel. */
  file: string | null;
  /** Pixel size of the full-size derivative (the aspect source). */
  w: number;
  h: number;
  /** Lower is loaded earlier. */
  priority: number;
  place: Place;
};

export type Screen = {
  /** Unique per panel; the primary screen of a project uses the project id. */
  id: string;
  project: MapProject;
  area: AreaId;
  kind: 'image' | 'terminal';
  src: string;
  lo: string;
  w: number;
  h: number;
  aspect: number;
  priority: number;
  place: Place;
};

// Composition notes. The wall is a row of seven set pieces, one per stop of the
// tour (the first is the hero). Each set piece is 3 to 5 screens in layered
// depth around one protagonist: big and in front, with the supporting screens
// behind and beside it, overlapping. Insurance has three set pieces, then AI,
// mobile and two for web and product; practice projects close the wall. Every
// image is a data-rich screen of a product, never a login or a stock photo
// (owner, L15 and L16: screenshots hold mock data; CVA congregation photos,
// the Thanos artwork and marketing stock photography stay out).

/** Arc position of the centre of each set piece. */
export const CENTRES = [-10.4, 0, 10.4, 20.8, 31.2, 41.6, 52] as const;
const [C1, C2, C3, C4, C5, C6, C7] = CENTRES;

const DEFS: Def[] = [
  // ---- 1. hero: the commercial cluster ----
  {
    projectId: 'maximus',
    file: 'maximus',
    w: 1500,
    h: 610,
    priority: 0,
    place: { u: C1 + 0.2, y: 0.3, width: 4.9, dz: 1.5 },
  },
  {
    projectId: 'crm-comercial',
    file: 'crm-comercial',
    w: 1441,
    h: 900,
    priority: 1,
    place: { u: C1 - 1.55, y: 2.5, width: 3.5, dz: -1.2 },
  },
  {
    projectId: 'titan',
    file: 'titan',
    w: 1452,
    h: 812,
    priority: 2,
    place: { u: C1 + 2.45, y: 2.7, width: 3.7, dz: -2.0 },
  },
  {
    id: 'crm-comercial--cartera',
    projectId: 'crm-comercial',
    file: 'crm-cartera',
    w: 1351,
    h: 620,
    priority: 3,
    place: { u: C1 - 1.4, y: -1.85, width: 3.6, dz: -0.6 },
  },
  {
    projectId: 'crm-mobile',
    file: 'crm-mobile',
    w: 388,
    h: 675,
    priority: 4,
    place: { u: C1 + 2.55, y: -1.45, width: 1.4, dz: 2.6 },
  },
  // ---- 2. insurance: operations ----
  {
    id: 'titan--tickets',
    projectId: 'titan',
    file: 'titan-tickets',
    w: 1440,
    h: 881,
    priority: 5,
    place: { u: C2 + 0.2, y: 0.45, width: 4.4, dz: 1.4 },
  },
  {
    projectId: 'prometeo',
    file: 'prometeo',
    w: 1440,
    h: 600,
    priority: 6,
    place: { u: C2 + 1.2, y: 2.9, width: 4.0, dz: -1.6 },
  },
  {
    projectId: 'seguros-kc',
    file: 'seguros-kc',
    w: 1380,
    h: 861,
    priority: 7,
    place: { u: C2 - 1.6, y: -2.2, width: 3.3, dz: -0.4 },
  },
  {
    projectId: 'alianza-red-magisterial',
    file: 'alianza-red-magisterial',
    w: 1440,
    h: 720,
    priority: 8,
    place: { u: C2 + 1.8, y: -2.15, width: 3.0, dz: 0.7 },
  },
  // ---- 3. insurance: commercial platform and analytics ----
  {
    projectId: 'nexus-riesgos-amparados',
    file: 'nexus-data',
    w: 1453,
    h: 749,
    priority: 9,
    place: { u: C3 + 0.2, y: 0.4, width: 4.4, dz: 1.4 },
  },
  {
    id: 'nexus-riesgos-amparados--landing',
    projectId: 'nexus-riesgos-amparados',
    file: 'nexus',
    w: 1398,
    h: 714,
    priority: 10,
    place: { u: C3 - 1.2, y: 2.75, width: 3.7, dz: -1.2 },
  },
  {
    projectId: 'portal-bi',
    file: 'portal-bi',
    w: 1350,
    h: 620,
    priority: 11,
    place: { u: C3 + 1.5, y: -2.4, width: 3.7, dz: 0.2 },
  },
  // ---- 4. AI ----
  {
    projectId: 'ari-maya-ai-business-platform',
    file: 'ari-maya',
    w: 1200,
    h: 1035,
    priority: 12,
    place: { u: C4 - 1.5, y: 0.0, width: 3.6, dz: 1.6 },
  },
  {
    projectId: 'kairo-runtime',
    file: null,
    w: 1280,
    h: 720,
    priority: 13,
    place: { u: C4 + 1.95, y: 1.85, width: 3.9, dz: -0.8 },
  },
  {
    projectId: 'atlas',
    file: 'atlas',
    w: 1380,
    h: 917,
    priority: 14,
    place: { u: C4 + 1.6, y: -1.75, width: 3.6, dz: 0.5 },
  },
  // ---- 5. mobile ----
  {
    projectId: 'eos-mobile',
    file: 'eos-mobile',
    w: 560,
    h: 983,
    priority: 15,
    place: { u: C5 + 1.1, y: -0.1, width: 2.6, dz: 1.6 },
  },
  {
    projectId: 'red-medica',
    file: 'red-medica',
    w: 720,
    h: 1600,
    priority: 16,
    place: { u: C5 - 2.5, y: 0.4, width: 2.0, dz: -0.4 },
  },
  {
    id: 'eos-mobile--login',
    projectId: 'eos-mobile',
    file: 'eos-login',
    w: 388,
    h: 712,
    priority: 17,
    place: { u: C5 - 0.6, y: 0.9, width: 2.3, dz: -1.0 },
  },
  {
    id: 'eos-mobile--home',
    projectId: 'eos-mobile',
    file: 'eos-home',
    w: 380,
    h: 716,
    priority: 18,
    place: { u: C5 + 3.1, y: 0.5, width: 2.1, dz: 0.2 },
  },
  // ---- 6. web and product ----
  {
    projectId: 'segunnet',
    file: 'segunnet',
    w: 1352,
    h: 620,
    priority: 19,
    place: { u: C6 + 0.3, y: 0.3, width: 4.6, dz: 1.4 },
  },
  {
    projectId: 'volaris-analytics',
    file: 'volaris-analytics',
    w: 1440,
    h: 708,
    priority: 20,
    place: { u: C6 - 1.5, y: 2.6, width: 3.6, dz: -1.0 },
  },
  {
    projectId: 'admin-vacunas',
    file: 'admin-vacunas',
    w: 1339,
    h: 608,
    priority: 21,
    place: { u: C6 + 1.8, y: 2.75, width: 3.7, dz: -1.8 },
  },
  {
    projectId: 'acolyte-health',
    file: 'acolyte-health',
    w: 1440,
    h: 709,
    priority: 22,
    place: { u: C7 + 1.5, y: -2.3, width: 3.7, dz: 0.4 },
  },
  // ---- 7. web and product: smaller and practice work ----
  {
    projectId: 'vacunas',
    file: 'vacunas',
    w: 1352,
    h: 606,
    priority: 23,
    place: { u: C6 + 0.2, y: -2.3, width: 4.2, dz: 0.4 },
  },
  {
    projectId: 'github-search',
    file: 'github-search',
    w: 1440,
    h: 718,
    priority: 24,
    place: { u: C7 - 1.4, y: 2.6, width: 3.4, dz: -1.0 },
  },
  {
    projectId: 'dashboard-next14',
    file: 'dashboard-next14',
    w: 1440,
    h: 754,
    priority: 25,
    place: { u: C7 + 0.2, y: 0.3, width: 4.2, dz: 1.4 },
  },
];

export const SCREENS: Screen[] = DEFS.map((def) => {
  const project = PROJECTS.find((p) => p.id === def.projectId);
  if (!project) throw new Error(`Wall: no project "${def.projectId}"`);
  return {
    id: def.id ?? project.id,
    project,
    area: project.area,
    kind: def.file ? 'image' : 'terminal',
    src: def.file ? `${DIR}/${def.file}.webp` : '',
    lo: def.file ? `${DIR}/${def.file}-lo.webp` : '',
    w: def.w,
    h: def.h,
    aspect: def.w / def.h,
    priority: def.priority,
    place: def.place,
  };
});

export const screenById = (id: string) => SCREENS.find((s) => s.id === id);

/**
 * One screen per project: the primary one, used by lists and static views, in
 * wall order (strongest work first).
 */
export const PRIMARY = SCREENS.filter((s) => s.id === s.project.id);

export const primaryByArea = (area: AreaId) =>
  PRIMARY.filter((s) => s.area === area);
