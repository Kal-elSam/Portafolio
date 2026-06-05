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

export type LiveFallbackReason =
  | 'quota_exceeded'
  | 'provider_error'
  | 'invalid_response';

export interface WorkflowDemoResult {
  mode: WorkflowDemoMode;
  provider?: AiProviderId;
  /** True when live AI was requested but providers failed — mock was used instead. */
  liveFallback?: boolean;
  /** Why live mode fell back to mock (safe to expose to client). */
  liveFallbackReason?: LiveFallbackReason;
  scenarioId: WorkflowScenarioId;
  userInput: string;
  steps: WorkflowStep[];
  outcome: string;
}

export interface WorkflowDemoCapabilities {
  liveAiAvailable: boolean;
}
