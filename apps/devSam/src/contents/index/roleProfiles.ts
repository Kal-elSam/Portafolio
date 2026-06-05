export type RoleProfileId =
  | 'software-engineer'
  | 'technical-lead'
  | 'solutions-engineer';

export interface RoleProfile {
  id: RoleProfileId;
  title: string;
  summary: string;
  proofPoints: string[];
  cvHref: string;
}

export const roleProfiles: RoleProfile[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    summary: 'Build product systems that ship reliably and scale with the business.',
    proofPoints: [
      'Next.js and React platforms for SaaS, dashboards, and AI workflows',
      'End-to-end delivery from UX to production with measurable outcomes',
      'Performance, maintainability, and developer experience as first-class goals',
    ],
    cvHref: '/assets/docs/SamuelGomez-SoftwareEngineer.pdf',
  },
  {
    id: 'technical-lead',
    title: 'Technical Lead',
    summary: 'Lead architecture and delivery standards across product and engineering teams.',
    proofPoints: [
      'System architecture standards, API contracts, and modular product design',
      'Code reviews, technical guidance, and cross-functional delivery alignment',
      '30% reported performance gains from architecture and refactoring initiatives',
    ],
    cvHref: '/assets/docs/SamuelGomez-TechnicalLead.pdf',
  },
  {
    id: 'solutions-engineer',
    title: 'Solutions Engineer',
    summary: 'Translate business needs into implementation plans teams can execute.',
    proofPoints: [
      'Discovery-to-delivery mapping for insurance, enterprise, and AI products',
      'Integration design across APIs, CRM flows, WhatsApp, and internal tooling',
      'Stakeholder-ready demos, documentation, and rollout support',
    ],
    cvHref: '/assets/docs/SamuelGomez-SolutionsEngineer.pdf',
  },
];
