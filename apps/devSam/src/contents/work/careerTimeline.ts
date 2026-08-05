import type { CareerTimelineItem } from '@/components/wireframes/CareerTimeline';

/** Newest-first timeline aligned with work/experience.mdx and the canonical CV. */
export const careerTimelineItems: CareerTimelineItem[] = [
  {
    id: 'kairo',
    company: 'Kairo Systems',
    role: 'Founder & Software Engineer',
    period: '2026 — Present',
    location: 'Mexico · Remote',
    summary:
      'AI-native SaaS platform (ARI + MAYA): WhatsApp automation, calendar booking, content engine, and full-stack ownership.',
    isCurrent: true,
  },
  {
    id: 'lumston',
    company: 'Lumston',
    role: 'Software Engineer',
    period: '2025 · Contract',
    location: 'Mexico · Remote',
    summary:
      'Production React/Next.js/TypeScript features under tight delivery cycles with product and design partners.',
  },
  {
    id: 'ensamble',
    company: 'Ensamble Administrador de Riesgos y Sistemas',
    role: 'Software Engineer / Frontend Lead',
    period: 'Sep 2021 — Present',
    location: 'Mexico · Remote',
    summary:
      'Enterprise SaaS delivery, reusable architecture, ~30% performance gains, and API integration standards.',
    isCurrent: true,
  },
  {
    id: 'lemu',
    company: 'Lemu',
    role: 'Product Owner & Mobile Engineer',
    period: '2022',
    location: 'Chile · Remote',
    summary:
      'Flutter features with Node.js/GraphQL, plus backlog ownership and delivery coordination.',
  },
  {
    id: 'kc',
    company: 'Grupo KC',
    role: 'Frontend Engineer',
    period: '2020 — 2022',
    location: 'Mexico · Remote',
    summary:
      'Internal React/Next.js platforms for operational workflows, dashboards, and process automation.',
  },
  {
    id: 'miga',
    company: 'Miga Ingeniería',
    role: 'Project Engineer',
    period: 'Sep 2018 — Aug 2020',
    location: 'Mexico',
    summary:
      'Industrial and utility programs; planning and cost discipline before transitioning into software.',
  },
];
