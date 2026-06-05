export type WorkflowScenarioId =
  | 'lead-qualification'
  | 'appointment-booking'
  | 'content-workflow';

export type WorkflowStepPhase =
  | 'analyzing'
  | 'routing'
  | 'executing'
  | 'completed';

export type AiProviderId = 'gemini' | 'groq' | 'openrouter';

export type WorkflowDemoMode = 'mock' | 'live';

export interface WorkflowStep {
  id: string;
  phase: WorkflowStepPhase;
  label: string;
  detail: string;
  tool?: string;
}

export interface WorkflowDemoResult {
  mode: WorkflowDemoMode;
  provider?: AiProviderId;
  scenarioId: WorkflowScenarioId;
  userInput: string;
  steps: WorkflowStep[];
  outcome: string;
}

export interface WorkflowDemoCapabilities {
  liveAiAvailable: boolean;
}
