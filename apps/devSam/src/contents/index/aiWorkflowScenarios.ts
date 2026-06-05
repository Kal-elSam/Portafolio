import type { WorkflowScenarioId } from '@/lib/ai/types';

export interface AiWorkflowScenario {
  id: WorkflowScenarioId;
  title: string;
  summary: string;
  samplePrompt: string;
  tools: string[];
}

export const aiWorkflowScenarios: AiWorkflowScenario[] = [
  {
    id: 'lead-qualification',
    title: 'Lead Qualification',
    summary:
      'Score inbound leads, route hot prospects, and sync qualified contacts to CRM.',
    samplePrompt:
      'We got a WhatsApp message from a fleet manager asking about enterprise pricing for 40 vehicles.',
    tools: ['Intent classifier', 'Lead scoring API', 'CRM sync'],
  },
  {
    id: 'appointment-booking',
    title: 'Appointment Booking',
    summary:
      'Parse scheduling intent, check availability, and confirm appointments automatically.',
    samplePrompt:
      'Can I book a demo call next Tuesday afternoon to review the dashboard rollout?',
    tools: ['Calendar API', 'Availability checker', 'Confirmation webhook'],
  },
  {
    id: 'content-workflow',
    title: 'Content Workflow',
    summary:
      'Turn briefs into structured drafts, route for review, and publish to product surfaces.',
    samplePrompt:
      'Draft a product update email announcing the new AI lead routing feature for sales teams.',
    tools: ['Content planner', 'Draft generator', 'CMS publish hook'],
  },
];

export function getScenarioById(
  scenarioId: WorkflowScenarioId
): AiWorkflowScenario {
  const scenario = aiWorkflowScenarios.find((item) => item.id === scenarioId);
  if (!scenario) {
    return aiWorkflowScenarios[0];
  }
  return scenario;
}
