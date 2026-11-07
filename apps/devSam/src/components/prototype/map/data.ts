// Project data for the /prototype/map work map. Prototype-only: the final data
// location is decided in T3.
//
// Rules: every entry of contents/projects/proyects.ts appears, with its real
// name, link and company. Overlays below add only what the sources state. A
// year is set only where a source states it (see `yearSource`); a repository's
// creation date is never a year; everything
// else is undated and is drawn in a labelled "Year not stated" band.

import { CV_HREF } from '@/contents/index/roleProfiles';
import projectsData from '@/contents/projects/proyects';

export { CV_HREF };

export const COPY = {
  name: 'Samuel Gomez Serrano',
  title: 'Senior Software Engineer | System Architecture & AI Engineering',
  headline: 'I design systems teams can understand, operate, and evolve.',
  subheadline:
    'Enterprise insurance platforms at work. In the open, Kairo: a control plane that routes AI engineering agents by capability, quota, and cost.',
} as const;

export const CONTACT_HREF = '/work/contact';

export type AreaId = 'insurance' | 'ai' | 'mobile' | 'web';

export type Area = {
  id: AreaId;
  name: string;
  /** Label for very narrow screens. */
  short: string;
  /** Plain description, grounded in the projects listed in the lane. */
  summary: string;
  featured: boolean;
};

/** Lane order is the camera order of the tour, left to right. */
export const AREAS: Area[] = [
  {
    id: 'insurance',
    name: 'Insurance systems',
    short: 'Insurance',
    summary:
      'Agent portals, CRM, analytics, quotation flows and the services behind them.',
    featured: true,
  },
  {
    id: 'ai',
    name: 'AI',
    short: 'AI',
    summary: 'ARI & MAYA, Kairo, and AI platforms I contributed to.',
    featured: false,
  },
  {
    id: 'mobile',
    name: 'Mobile',
    short: 'Mobile',
    summary: 'Flutter and cross-platform apps for agents and the public.',
    featured: false,
  },
  {
    id: 'web',
    name: 'Web and product',
    short: 'Web',
    summary:
      'Websites, dashboards and web products, my own and for teams I worked with.',
    featured: false,
  },
];

export type Relation = 'own' | 'contribution' | 'employer';

export type MapProject = {
  id: string;
  name: string;
  area: AreaId;
  /** null: no source states a year. Never guessed. */
  year: number | null;
  yearSource: string;
  roleSource: string;
  blurb: string;
  company?: string;
  role?: string;
  relation: Relation;
  /** Existing link when the source has one. */
  link?: string;
  /** Where a click goes: the link, or the /projects placeholder anchor. */
  /**
   * Where a click goes. Absent when the project has no public destination:
   * consumers must render a control that does not navigate, never a link.
   */
  href?: string;
  external: boolean;
  /** True when the link opens on a sign-in page. */
  signIn?: boolean;
  featured: boolean;
  origin: 'proyects.ts' | 'added';
  /**
   * Technologies a reader recognises (3 to 6), normalised spelling. Absent when
   * no source states a stack: nothing is guessed. Provenance: see STACKS and
   * ADDED_STACKS below.
   */
  stack?: string[];
  /** One-line outcome, condensed from the `impact` text of proyects.ts. */
  impact?: string;
  /**
   * Who it was built for, used to group the project. Only set from a stated
   * company or an owner-confirmed repository.
   */
  group?: WorkGroup;
  /** What the project is delivered as; drives how its screen is framed. */
  platform?: Platform;
  /**
   * Commits by the owner on the default branch of the project's repositories
   * (summed where several repositories belong to one project), read with the
   * GitHub API on COMMITS_AS_OF. Absent when no accessible repository gives a
   * count; never 0.
   */
  commits?: number;
  /**
   * True when the code is in a private repository of an account the owner can
   * read (checked with the GitHub API 2026-11-07). Absent when no repository
   * can be tied to the project: the UI then says "Private project".
   */
  privateRepo?: boolean;
};

export type Platform = 'mobile' | 'web' | 'api' | 'cli' | 'widget' | 'desktop';

export type WorkGroup =
  | 'Grupo KC'
  | 'Ensamble'
  | 'Lumston'
  | 'Lemu'
  | 'Personal';

const slug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

type Overlay = {
  area: AreaId;
  blurb: string;
  year?: number;
  yearSource?: string;
  featured?: boolean;
};

const LUMSTON = 'Single-year contract in careerTimeline.ts (2025)';
const LEMU = 'Single-year engagement in careerTimeline.ts (2022)';

/** Keyed by projectName in proyects.ts. A missing key fails the build. */
const OVERLAYS: Record<string, Overlay> = {
  'ARI & MAYA — AI Business Platform': {
    area: 'ai',
    blurb:
      'AI business platform: WhatsApp conversations, Google Calendar booking and a social content engine for local businesses in Mexico.',
    year: 2026,
    yearSource: 'CV: ARI & MAYA 2026',
    featured: true,
  },
  'GitHub Search': {
    area: 'web',
    blurb:
      'Web app that searches GitHub users and repositories through the GitHub API.',
  },
  'CVA Church Page': {
    area: 'web',
    blurb:
      'Official site of the Comunidad Vida Abundante church, built with Astro.',
  },
  Cinemapedia: {
    area: 'mobile',
    blurb: 'Flutter movie and series directory built on the TMDB API.',
  },
  'DashBoard Next14': {
    area: 'web',
    blurb: 'Practice dashboard built to explore Next.js 14.',
  },
  Vacunas: {
    area: 'web',
    blurb:
      'Vaccination appointment registration: locations, dates and family group bookings.',
  },
  'Admin Vacunas': {
    area: 'web',
    blurb:
      'Admin dashboard for vaccination data across locations: registrations, doses and appointments.',
  },
  'Red Médica': {
    area: 'mobile',
    blurb: 'Flutter medical directory to find and locate healthcare providers.',
  },
  SegunNet: {
    area: 'web',
    blurb:
      'Ticket management platform for customer support, built with React and Node.js.',
  },
  'NEXUS / Riesgos Amparados': {
    area: 'insurance',
    blurb:
      'Commercial platform that helps agents activate a second source of income through guided operational flows.',
  },
  'Solcrédito Autos': {
    area: 'insurance',
    blurb: 'Public auto insurance landing page with a quotation flow.',
  },
  'Seguros KC': {
    area: 'insurance',
    blurb:
      'Public insurance site with policy categories and entry points for prospects and agents.',
  },
  'Grupo KC Corporate Site': {
    area: 'web',
    blurb:
      'Corporate website: brand, recruitment messaging, insurance offerings and institutional information.',
  },
  'CRM Comercial': {
    area: 'insurance',
    blurb:
      'CRM for commercial teams: leads, opportunities, conversion metrics and activities.',
  },
  'CRM Mobile': {
    area: 'insurance',
    blurb:
      'Mobile interface of the commercial CRM: opportunities, prospecting, indicators and tasks.',
  },
  Maximus: {
    area: 'insurance',
    blurb:
      'Internal analytics platform tracking annual goals, sales mix, ranking and growth across teams.',
  },
  Titan: {
    area: 'insurance',
    blurb:
      'Internal operations platform: indicators, account information, persistence metrics and admin modules for agents.',
  },
  'Portal BI': {
    area: 'insurance',
    blurb:
      'Business intelligence interface with charts, operational metrics and commercial insights.',
  },
  'EoS Mobile': {
    area: 'mobile',
    blurb:
      'Cross-platform app giving agents and promoters access to performance, bonuses and dashboards.',
  },
  'Card Tu Agente': {
    area: 'insurance',
    blurb: 'Digital card and quotation entry point for insurance agents.',
  },
  'Batalla vs Thanos': {
    area: 'web',
    blurb:
      'Themed, game-like platform that tracks progress toward sales campaign goals.',
  },
  'Atlas de la Biodiversidad': {
    area: 'mobile',
    blurb:
      'Cross-platform atlas of biodiversity built with Flutter, Firebase and maps.',
    year: 2022,
    yearSource: LEMU,
  },
  'Volaris Analytics': {
    area: 'web',
    blurb:
      'Business intelligence platform with real-time analysis and dashboards, integrating Power BI.',
    year: 2025,
    yearSource: LUMSTON,
  },
  'Acolyte Health': {
    area: 'web',
    blurb:
      'SaaS platform for interactive video marketing with personalized campaigns and digital avatars.',
    year: 2025,
    yearSource: LUMSTON,
  },
};

/**
 * Where a click on a project can really go, keyed by projectName. A project
 * has a link only when a public destination exists: its live public site or a
 * public repository. A login page, a preview deployment of a private
 * repository and a private repository are not destinations. `null` drops the
 * link that proyects.ts carries. Checked 2026-11-06: every URL below answers
 * 200 without asking for a sign-in.
 */
const GH_OWN = 'https://github.com/Kal-elSam';
const SIGN_IN = new Set([
  'Titan',
  'Maximus',
  'CRM Comercial',
  'NEXUS / Riesgos Amparados',
  'EoS Mobile',
  'ATLAS',
]);

const LINKS: Record<string, string | null> = {
  // Systems that open on a sign-in: the owner chose to link them as they are
  // (message of 2026-11-07); the UI says "sign-in required".
  'EoS Mobile': 'https://eos.grupokc.com.mx/#/login',
  // CRM Mobile and the rest have no public destination: no link.
  'NEXUS / Riesgos Amparados': 'https://nexus.grupokc.com.mx/',
  'CRM Comercial': 'https://crm.grupokc.com.mx/dashboard',
  'CRM Mobile': null,
  Maximus: 'https://maximus.grupokc.com.mx/',
  Titan: 'https://titan.grupokc.com.mx/',
  // Public sites and public repositories.
  'Seguros KC': 'https://www.seguroskc.com/',
  'Grupo KC Corporate Site': 'https://www.grupokc.com.mx/',
  'Card Tu Agente': 'https://www.tuagente.com.mx/',
  Cinemapedia: `${GH_OWN}/cinemapedia`,
  'DashBoard Next14': `${GH_OWN}/Admin_Dashboard`,
};

// Spelling differences between sources, folded to one name so counts and
// filters treat them as the same technology. Keys are lower case.
const TECH_ALIASES: Record<string, string> = {
  tailwindcss: 'Tailwind CSS',
  'tailwind css': 'Tailwind CSS',
  'astro.js': 'Astro',
  'next.js 14': 'Next.js',
  'next.js 15': 'Next.js',
  'react 18': 'React',
  'next-auth': 'NextAuth.js',
  '@vercel/postgres': 'Vercel Postgres',
  'material-ui (mui)': 'MUI',
};

const normalizeStack = (list: string[]) => {
  const seen = new Set<string>();
  const out: string[] = [];
  list.forEach((raw) => {
    const name = TECH_ALIASES[raw.trim().toLowerCase()] ?? raw.trim();
    if (!seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  });
  return out;
};

/**
 * Stacks of the entries in proyects.ts, keyed by projectName. Provenance: the
 * `technologies` array of each entry, trimmed to the 3 to 6 a reader
 * recognises (frameworks, languages, data stores, key services); generic
 * descriptors such as "Responsive UI" or "Enterprise Dashboard UI" are not
 * technologies and are dropped. No technology appears here that the source
 * does not list.
 */
const STACKS: Record<string, string[]> = {
  'ARI & MAYA — AI Business Platform': [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'WhatsApp Cloud API',
  ],
  'GitHub Search': [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'GitHub API',
  ],
  'CVA Church Page': [
    'Astro.js',
    'TailwindCSS',
    'TypeScript',
    'Supabase',
    'PostgreSQL',
  ],
  Cinemapedia: ['Flutter', 'Dart', 'Riverpod', 'TMDB API'],
  'DashBoard Next14': [
    'Next.js 14',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'NextAuth.js',
    'PostgreSQL',
  ],
  Vacunas: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Formik',
    'Framer Motion',
    '@vercel/postgres',
  ],
  'Admin Vacunas': [
    'Next.js',
    'React',
    'NextUI',
    'Tailwind CSS',
    'next-auth',
    'xlsx',
  ],
  'Red Médica': [
    'Flutter',
    'Riverpod',
    'Google Maps API',
    'Flutter Map',
    'Dio',
  ],
  SegunNet: ['React', 'Node.js'],
  'NEXUS / Riesgos Amparados': [
    'React',
    'Next.js',
    'Vite',
    'TypeScript',
    'Tailwind CSS',
    'Azure Service Bus',
  ],
  'Solcrédito Autos': ['Astro', 'Tailwind CSS'],
  // Manifest of the project's repository (read 2026-11-06): Vue, Vite, Pinia,
  // Supabase, Tailwind CSS and TypeScript. It has no React or Next.js.
  'Seguros KC': [
    'Vue',
    'Vite',
    'TypeScript',
    'Tailwind CSS',
    'Pinia',
    'Supabase',
  ],
  'Grupo KC Corporate Site': ['React', 'Vite', 'TypeScript', 'Tailwind CSS'],
  'CRM Comercial': [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Redis',
    'Zustand',
  ],
  // The offline PWA is built with Vite, React, Dexie and Workbox (read from the
  // project's manifest, 2026-11-06), not Next.js as its older entry lists.
  'CRM Mobile': [
    'React',
    'Vite',
    'TypeScript',
    'Tailwind CSS',
    'Dexie',
    'Workbox',
  ],
  Maximus: [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Redis',
    'Chart.js',
  ],
  Titan: [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Azure Service Bus',
    'NextAuth.js',
  ],
  'Portal BI': [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'NextAuth.js',
    'Power BI',
  ],
  'EoS Mobile': ['Ionic Framework', 'Angular', 'Chart.js'],
  'Card Tu Agente': [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Zustand',
    'Redis',
  ],
  'Batalla vs Thanos': ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  'Atlas de la Biodiversidad': ['Flutter', 'Firebase', 'Google Maps API'],
  'Volaris Analytics': [
    'React 18',
    'TypeScript',
    'Vite',
    'Redux Toolkit',
    'Power BI Client',
    'AWS Cognito',
  ],
  'Acolyte Health': [
    'Next.js 15',
    'React 18',
    'TypeScript',
    'Tailwind CSS',
    'AWS Amplify',
    'Remotion',
  ],
};

/**
 * One-line outcomes, condensed from the `impact` text of each proyects.ts
 * entry. Only entries whose source has an impact appear; no figures are added.
 */
const IMPACTS: Record<string, string> = {
  'ARI & MAYA — AI Business Platform':
    'Designed and built the platform end to end: customer conversations, appointment booking, content generation and operational dashboards.',
  'NEXUS / Riesgos Amparados':
    'Built a dark-theme sales enablement platform and operational views for agent activation, support workflows and opportunity management.',
  'Solcrédito Autos':
    'Delivered a quotation flow optimized for lead capture and self-service from the public web.',
  'Seguros KC':
    'Built a clearer public product-discovery and quotation interface for several insurance offerings and agent access points.',
  'Grupo KC Corporate Site':
    'Supported the modernization of the public site with a more polished hero and clearer navigation.',
  'CRM Comercial':
    'Built a CRM experience for sales visibility, qualified opportunities, pipeline tracking and daily tasks.',
  'CRM Mobile':
    'Extended the CRM into a mobile-first experience for agents on the move.',
  Maximus:
    'Created a performance dashboard for promotories and agents: ranking, goals, growth and sales mix.',
  Titan:
    'Delivered internal modules for indicators, account status, persistence, emission and services, and agent support.',
  'Portal BI':
    'Built data visualization workflows with exports, dashboards and decision-support views.',
  'EoS Mobile':
    'Extended performance, bonus and indicator visibility into a mobile experience for agents and promoters.',
  'Card Tu Agente':
    'Delivered a digital profile and quotation entry point for agents, with contact conversion paths.',
  'Batalla vs Thanos':
    'Created a gamified internal experience around short-term sales goals and progress visibility.',
  'Volaris Analytics':
    'Improved real-time dashboard usability through role management, authentication flows and data visualization UX.',
  'Acolyte Health':
    'Delivered product-facing features in a SaaS environment combining personalization, media workflows and multi-tenant UX.',
};

/**
 * What each project is delivered as, keyed by name. From the owner's
 * descriptions and the repositories' manifests; nothing is inferred from a
 * screenshot.
 */
const PLATFORMS: Record<string, Platform> = {
  'ARI & MAYA — AI Business Platform': 'web',
  'GitHub Search': 'web',
  'CVA Church Page': 'web',
  Cinemapedia: 'mobile',
  'DashBoard Next14': 'web',
  Vacunas: 'web',
  'Admin Vacunas': 'web',
  'Red Médica': 'mobile',
  SegunNet: 'web',
  'NEXUS / Riesgos Amparados': 'web',
  'Solcrédito Autos': 'web',
  'Seguros KC': 'web',
  'Grupo KC Corporate Site': 'web',
  'CRM Comercial': 'web',
  'CRM Mobile': 'mobile',
  Maximus: 'web',
  Titan: 'web',
  'Portal BI': 'web',
  'EoS Mobile': 'mobile',
  'Card Tu Agente': 'mobile',
  'Batalla vs Thanos': 'web',
  'Atlas de la Biodiversidad': 'mobile',
  'Volaris Analytics': 'web',
  'Acolyte Health': 'web',
  Kairo: 'cli',
  'Maze Chase 2D level editor': 'web',
  'Getmore homepage layout': 'web',
  'AI talent and initiative platform': 'web',
  'KC coding harness': 'cli',
  'Digital insurance widget': 'widget',
  'Reports API': 'api',
  'Notifications API': 'api',
  'Testing center': 'web',
  'Alianza Red Magisterial': 'web',
  ATLAS: 'web',
  Prometeo: 'web',
  'Help desk': 'web',
  'Desktop AI assistant': 'desktop',
  'Employee benefits app': 'mobile',
  'Single sign-on': 'api',
  'Pizza ordering app': 'web',
  'Repository explorer': 'web',
  'Map and charts SPA': 'web',
  'Portfolio site': 'web',
};

/** Projects whose code is in a private repository the owner can read. */
const PRIVATE_REPO = new Set([
  'AI talent and initiative platform',
  'Portal BI',
  'Testing center',
  'CRM Mobile',
  'Batalla vs Thanos',
  'Digital insurance widget',
  'Reports API',
  'Notifications API',
  'KC coding harness',
  'Help desk',
  'Desktop AI assistant',
  'Employee benefits app',
  'Single sign-on',
  'Titan',
  'Maximus',
  'CRM Comercial',
  'NEXUS / Riesgos Amparados',
  'ATLAS',
  'Seguros KC',
  'Card Tu Agente',
  'Grupo KC Corporate Site',
  'Alianza Red Magisterial',
  'Solcrédito Autos',
  'ARI & MAYA — AI Business Platform',
  'CVA Church Page',
]);

/** When the commit counts below were read. */
export const COMMITS_AS_OF = '2026-11-07';

/**
 * Commits by the owner on each project's default branch, from
 * `gh api repos/<repo>/commits?author=<owner>&per_page=1` (last page of the
 * Link header), summed over the repositories that belong to the project:
 * ARI & MAYA (one repository), Titan (one), Grupo KC Corporate Site (two),
 * Card Tu Agente (two), NEXUS (two), Single sign-on (two) and so on. Projects
 * with no accessible repository (Ensamble, Lumston, Lemu, Prometeo) and
 * repositories where the owner has no commits under this author (the
 * notifications API and the desktop assistant) have no entry: they show no
 * count. Repositories that are backups, vaults, profile readmes or forks are
 * not counted anywhere.
 */
const COMMITS: Record<string, number> = {
  'ARI & MAYA — AI Business Platform': 872,
  Titan: 221,
  'KC coding harness': 207,
  'CVA Church Page': 186,
  'Help desk': 186,
  'Digital insurance widget': 130,
  'Grupo KC Corporate Site': 94,
  'Portfolio site': 91,
  'Seguros KC': 78,
  Maximus: 68,
  'CRM Comercial': 55,
  'Card Tu Agente': 55,
  'Alianza Red Magisterial': 49,
  'Batalla vs Thanos': 30,
  'CRM Mobile': 26,
  'Solcrédito Autos': 23,
  'NEXUS / Riesgos Amparados': 21,
  Cinemapedia: 15,
  'Repository explorer': 10,
  ATLAS: 9,
  'Single sign-on': 6,
  'Maze Chase 2D level editor': 6,
  'GitHub Search': 6,
  'Testing center': 6,
  'Getmore homepage layout': 5,
  'Pizza ordering app': 5,
  'DashBoard Next14': 3,
  'Reports API': 3,
  'Map and charts SPA': 2,
  'Employee benefits app': 2,
  'Portal BI': 2,
  'AI talent and initiative platform': 1,
  Kairo: 1473,
};

const COMPANY_GROUPS: Record<string, WorkGroup> = {
  KC: 'Grupo KC',
  Ensamble: 'Ensamble',
  Lumston: 'Lumston',
  LEMU: 'Lemu',
  Personal: 'Personal',
  'Kairo Systems': 'Personal',
};

const linkOf = (name: string, source?: string) =>
  name in LINKS ? LINKS[name] ?? undefined : source;

const fromSource: MapProject[] = projectsData.map((entry) => {
  const overlay = OVERLAYS[entry.projectName];
  if (!overlay) {
    throw new Error(`Map overlay missing for "${entry.projectName}"`);
  }
  const id = slug(entry.projectName);
  const own = entry.company === 'Personal' || entry.company === 'Kairo Systems';
  return {
    id,
    name: entry.projectName,
    area: overlay.area,
    year: overlay.year ?? null,
    yearSource: overlay.yearSource ?? 'No year stated in sources',
    roleSource: entry.role ? 'proyects.ts role' : 'No role stated',
    blurb: overlay.blurb,
    company: entry.company === 'Personal' ? undefined : entry.company,
    role: entry.role,
    relation: own ? 'own' : 'employer',
    link: linkOf(entry.projectName, entry.link),
    href: linkOf(entry.projectName, entry.link),
    external: Boolean(linkOf(entry.projectName, entry.link)),
    signIn: SIGN_IN.has(entry.projectName) || undefined,
    featured: Boolean(overlay.featured),
    origin: 'proyects.ts',
    stack: STACKS[entry.projectName]
      ? normalizeStack(STACKS[entry.projectName])
      : undefined,
    impact: IMPACTS[entry.projectName],
    group: COMPANY_GROUPS[entry.company],
    platform: PLATFORMS[entry.projectName],
    commits: COMMITS[entry.projectName],
    privateRepo: PRIVATE_REPO.has(entry.projectName) || undefined,
  };
});

type Added = {
  /** Overrides the id derived from the name. */
  id?: string;
  name: string;
  area: AreaId;
  blurb: string;
  relation: Relation;
  /** Only where a screen or source states the company. */
  company?: string;
  /** What the entry rests on when it is neither the owner's list nor a repo. */
  roleSource?: string;
  year?: number;
  yearSource?: string;
  link?: string;
  featured?: boolean;
};

const GH = GH_OWN;

/**
 * Added beyond proyects.ts. Contribution entries come from the owner's list of
 * private-repo contributions and carry functional names only: no organization
 * or repository names beyond those already public in proyects.ts.
 */
const ADDED: Added[] = [
  {
    // The id stays "kairo-runtime": the wall and the map layouts key on it.
    id: 'kairo-runtime',
    name: 'Kairo',
    area: 'ai',
    blurb:
      'Open-source layer that routes work between Claude Code, Codex and OpenCode by capability, eligibility, quota and cost.',
    relation: 'own',
    year: 2026,
    yearSource: 'CV: Kairo 2026-present',
    link: `${GH}/harness`,
    featured: true,
  },
  {
    name: 'Maze Chase 2D level editor',
    area: 'web',
    blurb:
      'Maze Chase 2D level editor, built as a frontend engineer technical challenge.',
    relation: 'own',
    link: `${GH}/technical-challenge-frontend-engineer`,
  },
  {
    name: 'Getmore homepage layout',
    area: 'web',
    blurb:
      'Desktop and mobile homepage layout, built as assessment 2 for Getmore.',
    relation: 'own',
    link: `${GH}/Maquetaci-n-de-Homepage-Desktop-y-M-vil-Getmore`,
  },
  {
    name: 'AI talent and initiative platform',
    area: 'ai',
    blurb: 'AI platform for talent and initiatives.',
    relation: 'contribution',
  },
  {
    name: 'KC coding harness',
    area: 'ai',
    blurb: 'Coding harness for AI-assisted engineering.',
    relation: 'contribution',
  },
  {
    name: 'Digital insurance widget',
    area: 'insurance',
    blurb: 'Widget for digital insurance.',
    relation: 'contribution',
  },
  {
    name: 'Reports API',
    area: 'insurance',
    blurb: 'API that generates PDF and Excel reports.',
    relation: 'contribution',
  },
  {
    name: 'Notifications API',
    area: 'insurance',
    blurb: 'API for notifications.',
    relation: 'contribution',
  },
  {
    name: 'Testing center',
    area: 'web',
    blurb: 'Web shell built with Vite and React that embeds testing modules.',
    relation: 'contribution',
  },
  {
    name: 'Alianza Red Magisterial',
    area: 'insurance',
    blurb:
      'Three-step auto insurance quotation flow: vehicle, contact, results.',
    relation: 'contribution',
    link: 'https://www.seguros-redmagisterial.com/',
  },
  // The next two entries come from owner screenshots (2026-11-06). The URL
  // and the role are pending from the owner.
  {
    name: 'ATLAS',
    area: 'ai',
    blurb:
      'Applications hub: A.T.L.A.S., AI Transformation & Linked Applications System.',
    link: 'https://atlas.grupokc.com.mx/login',
    relation: 'employer',
    company: 'KC',
    roleSource: 'Company from the login and footer text of the screenshots',
  },
  {
    name: 'Prometeo',
    area: 'insurance',
    blurb:
      'Legacy web portal built with ASP.NET MVC 5, Web API 2 and .NET Framework 4.8, with Power BI.',
    relation: 'employer',
    company: 'KC',
    roleSource: 'Company from the login and footer text of the screenshots',
  },
  // Added from the owner's repositories (read 2026-11-07). Display names are
  // generic; blurbs say only what each repository's README or manifest states.
  {
    name: 'Help desk',
    area: 'web',
    blurb: 'Internal help desk web app built with Next.js and Socket.IO.',
    relation: 'contribution',
  },
  {
    name: 'Desktop AI assistant',
    area: 'ai',
    blurb:
      'Desktop app for a corporate AI assistant, built with Tauri, React and TypeScript.',
    relation: 'contribution',
  },
  {
    name: 'Employee benefits app',
    area: 'mobile',
    blurb:
      'Mobile app for employee benefits, built with React Native, Expo and TypeScript.',
    relation: 'contribution',
  },
  {
    name: 'Single sign-on',
    area: 'web',
    blurb: 'Service that identifies a user across several systems.',
    relation: 'contribution',
  },
  {
    name: 'Pizza ordering app',
    area: 'web',
    blurb:
      'Pizza ordering single-page app: menu filters and sorting, automatic discounts, an order summary and charts.',
    relation: 'own',
    link: `${GH}/pizza-order-app`,
  },
  {
    name: 'Repository explorer',
    area: 'web',
    blurb: 'Nuxt 3 app that loads GitHub repositories with infinite scroll.',
    relation: 'own',
    link: `${GH}/infinite-scroll`,
  },
  {
    name: 'Map and charts SPA',
    area: 'web',
    blurb:
      'Multi-page single-page app with a Leaflet map and Chart.js charts, built as a front-end interview exercise.',
    relation: 'own',
    link: `${GH}/SPA_with_several_pages`,
  },
  {
    name: 'Portfolio site',
    area: 'web',
    blurb:
      'This portfolio: a Next.js, MDX and Tailwind CSS site with GSAP animation and a three.js scene.',
    relation: 'own',
    link: `${GH}/Portafolio`,
  },
];

/**
 * Stacks of the added entries. Provenance: the dependency manifests of the
 * owner's repositories on GitHub, read 2026-11-06. The repositories are
 * private, so neither their names nor their creation dates are published: only
 * the technologies. Prometeo takes its stack from internal documentation.
 * Entries that duplicated another project (same product under a second
 * name) were folded into it: their technologies sit in that project's stack.
 */
const ADDED_STACKS: Record<string, string[]> = {
  Kairo: ['Node.js', 'JavaScript', 'TypeScript', 'MCP', 'Shell'],
  'Maze Chase 2D level editor': ['Vue', 'TypeScript', 'Python', 'Bun'],
  'Getmore homepage layout': ['HTML', 'SCSS', 'JavaScript', 'Vite'],
  'AI talent and initiative platform': [
    'React',
    'TypeScript',
    'Vite',
    'Supabase',
  ],
  'KC coding harness': [
    'Shell',
    'JavaScript',
    'TypeScript',
    'Claude Code plugins',
  ],
  'Digital insurance widget': [
    'Vue',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Pinia',
  ],
  'Reports API': [
    'Node.js',
    'TypeScript',
    'Fastify',
    'PDFMake',
    'ExcelJS',
    'QuickChart',
    'Redis',
    'Zod',
  ],
  'Notifications API': [
    'Node.js',
    'TypeScript',
    'Fastify',
    'PostgreSQL',
    'Drizzle ORM',
  ],
  'Testing center': ['React', 'Vite', 'JavaScript'],
  'Alianza Red Magisterial': ['Astro', 'Vue', 'TypeScript', 'Vite'],
  ATLAS: [
    'React',
    'TypeScript',
    'Vite',
    'Supabase',
    'Tailwind CSS',
    'Recharts',
  ],
  // From the project's internal documentation, not a manifest.
  Prometeo: ['ASP.NET MVC 5', 'Web API 2', '.NET Framework 4.8', 'Power BI'],
  'Help desk': ['Next.js', 'React', 'Tailwind CSS', 'Socket.IO', 'Zustand'],
  'Desktop AI assistant': ['Tauri', 'React', 'TypeScript', 'Vite', 'Supabase'],
  'Employee benefits app': ['React Native', 'Expo', 'TypeScript', 'Zustand'],
  'Single sign-on': ['Node.js', 'Express', 'TypeScript', 'JWT'],
  'Pizza ordering app': [
    'React',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Recharts',
    'Zod',
  ],
  'Repository explorer': ['Nuxt', 'Vue', 'Tailwind CSS'],
  'Map and charts SPA': [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Chart.js',
    'Leaflet',
  ],
  // From this repository's package.json: Next.js, React, TypeScript, Tailwind
  // CSS, MDX, GSAP and three.js.
  'Portfolio site': [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'MDX',
    'GSAP',
    'Three.js',
  ],
};

/**
 * Added entries whose repository the owner confirmed as Grupo KC's (message of
 * 2026-11-06). Entries with a stated `company` are grouped by it; own
 * repositories are "Personal"; anything else is Grupo KC's.
 */
const KC_REPOSITORIES = new Set([
  'AI talent and initiative platform',
  'KC coding harness',
  'Digital insurance widget',
  'Reports API',
  'Notifications API',
  'Testing center',
  'Alianza Red Magisterial',
  'ATLAS',
]);

const addedGroup = (entry: Added): WorkGroup => {
  if (entry.company) return COMPANY_GROUPS[entry.company] ?? 'Grupo KC';
  if (KC_REPOSITORIES.has(entry.name)) return 'Grupo KC';
  return entry.relation === 'own' ? 'Personal' : 'Grupo KC';
};

const addedProjects: MapProject[] = ADDED.map((entry) => {
  const id = entry.id ?? slug(entry.name);
  return {
    id,
    name: entry.name,
    area: entry.area,
    year: entry.year ?? null,
    yearSource: entry.yearSource ?? 'No year stated in sources',
    company: entry.company,
    roleSource:
      entry.roleSource ??
      (entry.relation === 'contribution'
        ? 'Owner list: contribution'
        : 'Own repository'),
    blurb: entry.blurb,
    relation: entry.relation,
    link: entry.link,
    href: entry.link,
    external: Boolean(entry.link),
    signIn: SIGN_IN.has(entry.name) || undefined,
    featured: Boolean(entry.featured),
    origin: 'added',
    stack: ADDED_STACKS[entry.name]
      ? normalizeStack(ADDED_STACKS[entry.name])
      : undefined,
    group: addedGroup(entry),
    platform: PLATFORMS[entry.name],
    commits: COMMITS[entry.name],
    privateRepo: PRIVATE_REPO.has(entry.name) || undefined,
  };
});

export const PROJECTS: MapProject[] = [...fromSource, ...addedProjects];

const ids = new Set<string>();
PROJECTS.forEach((p) => {
  if (ids.has(p.id)) throw new Error(`Duplicate map project id "${p.id}"`);
  ids.add(p.id);
});

export const projectsByArea = (area: AreaId) =>
  PROJECTS.filter((p) => p.area === area);

/** Company, then role or relation, only from stated facts. */
export const metaLine = (p: MapProject) => {
  const parts: string[] = [];
  if (p.company) parts.push(p.company);
  if (p.role) parts.push(p.role);
  else if (p.relation === 'own') parts.push('Own project');
  else if (p.relation === 'contribution') parts.push('Contribution');
  return parts.join(' · ');
};
