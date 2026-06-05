import { getScenarioById } from '@/contents/index/aiWorkflowScenarios';

import type {
  WorkflowDemoResult,
  WorkflowScenarioId,
  WorkflowStep,
} from '@/lib/ai/types';

function buildLeadQualificationSteps(
  userPrompt: string,
  tools: string[]
): WorkflowStep[] {
  const isEnterprise =
    /enterprise|fleet|40|pricing|b2b/i.test(userPrompt) ||
    userPrompt.length > 20;

  return [
    {
      id: 'input',
      phase: 'analyzing',
      label: 'User input received',
      detail: userPrompt.slice(0, 120) + (userPrompt.length > 120 ? '…' : ''),
    },
    {
      id: 'intent',
      phase: 'routing',
      label: 'AI intent detected',
      detail: isEnterprise
        ? 'High-intent enterprise lead — pricing and fleet sizing request'
        : 'Inbound lead inquiry — needs qualification before sales handoff',
      tool: tools[0],
    },
    {
      id: 'action',
      phase: 'executing',
      label: 'Tool action executed',
      detail: isEnterprise
        ? 'Score: 87/100 · Route to AE · Create HubSpot deal with fleet metadata'
        : 'Score: 62/100 · Route to SDR nurture sequence · Tag channel source',
      tool: tools[1],
    },
    {
      id: 'outcome',
      phase: 'completed',
      label: 'Business outcome',
      detail: isEnterprise
        ? 'AE notified in Slack · CRM record synced · Auto-reply sent with calendar link'
        : 'Lead queued for follow-up · CRM contact created · SLA timer started',
      tool: tools[2],
    },
  ];
}

function buildAppointmentSteps(
  userPrompt: string,
  tools: string[]
): WorkflowStep[] {
  const hasTuesday = /tuesday|martes|afternoon|tarde|demo|call/i.test(
    userPrompt
  );

  return [
    {
      id: 'input',
      phase: 'analyzing',
      label: 'User input received',
      detail: userPrompt.slice(0, 120) + (userPrompt.length > 120 ? '…' : ''),
    },
    {
      id: 'intent',
      phase: 'routing',
      label: 'AI intent detected',
      detail: hasTuesday
        ? 'Scheduling intent — demo call request with day preference'
        : 'Scheduling intent — needs date/time clarification',
      tool: tools[0],
    },
    {
      id: 'action',
      phase: 'executing',
      label: 'Tool action executed',
      detail: hasTuesday
        ? 'Checked Google Calendar · Found 2:30 PM and 4:00 PM slots on Tuesday'
        : 'Checked availability window · Proposed next 3 open slots',
      tool: tools[1],
    },
    {
      id: 'outcome',
      phase: 'completed',
      label: 'Business outcome',
      detail: hasTuesday
        ? 'Meeting booked · Confirmation email sent · CRM activity logged'
        : 'Slot options sent to user · Pending confirmation webhook armed',
      tool: tools[2],
    },
  ];
}

function buildContentWorkflowSteps(
  userPrompt: string,
  tools: string[]
): WorkflowStep[] {
  const isProductUpdate =
    /product|feature|update|email|announce/i.test(userPrompt);

  return [
    {
      id: 'input',
      phase: 'analyzing',
      label: 'User input received',
      detail: userPrompt.slice(0, 120) + (userPrompt.length > 120 ? '…' : ''),
    },
    {
      id: 'intent',
      phase: 'routing',
      label: 'AI intent detected',
      detail: isProductUpdate
        ? 'Content brief — product announcement email for sales-facing audience'
        : 'Content brief — needs format and audience clarification',
      tool: tools[0],
    },
    {
      id: 'action',
      phase: 'executing',
      label: 'Tool action executed',
      detail: isProductUpdate
        ? 'Generated structured draft: headline, value props, CTA, review checklist'
        : 'Generated outline with sections pending stakeholder input',
      tool: tools[1],
    },
    {
      id: 'outcome',
      phase: 'completed',
      label: 'Business outcome',
      detail: isProductUpdate
        ? 'Draft routed to marketing review · CMS stub created · Send window queued'
        : 'Outline saved to content queue · Review task assigned',
      tool: tools[2],
    },
  ];
}

const stepBuilders: Record<
  WorkflowScenarioId,
  (prompt: string, tools: string[]) => WorkflowStep[]
> = {
  'lead-qualification': buildLeadQualificationSteps,
  'appointment-booking': buildAppointmentSteps,
  'content-workflow': buildContentWorkflowSteps,
};

const outcomeByScenario: Record<WorkflowScenarioId, string> = {
  'lead-qualification':
    'Qualified lead routed to the right owner with CRM context — response time cut without manual triage.',
  'appointment-booking':
    'Meeting confirmed automatically with calendar sync and stakeholder notifications.',
  'content-workflow':
    'Brief converted to publish-ready draft with review routing and CMS handoff.',
};

export function buildMockWorkflowDemo(
  scenarioId: WorkflowScenarioId,
  userPrompt: string
): WorkflowDemoResult {
  const scenario = getScenarioById(scenarioId);
  const buildSteps = stepBuilders[scenarioId];
  const steps = buildSteps(userPrompt, scenario.tools);

  return {
    mode: 'mock',
    scenarioId,
    userInput: userPrompt,
    steps,
    outcome: outcomeByScenario[scenarioId],
  };
}

export function isLiveAiConfigured(): boolean {
  return Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GROQ_API_KEY ||
      process.env.OPENROUTER_API_KEY
  );
}
