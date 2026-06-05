import {
  buildMockWorkflowDemo,
  isLiveAiConfigured,
} from '@/lib/ai/mock-workflow';
import {
  aiProviders,
  getLastLiveFailureReason,
  LIVE_PROVIDER_CHAIN,
  runLiveWorkflowDemo,
} from '@/lib/ai/providers';

import type {
  WorkflowDemoCapabilities,
  WorkflowDemoResult,
  WorkflowScenarioId,
} from '@/lib/ai/types';

export function getWorkflowDemoCapabilities(): WorkflowDemoCapabilities {
  return {
    liveAiAvailable: isLiveAiConfigured(),
    providers: LIVE_PROVIDER_CHAIN.filter((id) => {
      const provider = aiProviders.find((item) => item.id === id);
      return provider?.isConfigured() ?? false;
    }),
  };
}

export async function executeWorkflowDemo(input: {
  scenarioId: WorkflowScenarioId;
  userPrompt: string;
  useLiveAi?: boolean;
}): Promise<WorkflowDemoResult> {
  const { scenarioId, userPrompt, useLiveAi = false } = input;

  if (useLiveAi && isLiveAiConfigured()) {
    const liveResult = await runLiveWorkflowDemo(scenarioId, userPrompt);
    if (liveResult) return liveResult;

    return {
      ...buildMockWorkflowDemo(scenarioId, userPrompt),
      liveFallback: true,
      liveFallbackReason: getLastLiveFailureReason() ?? 'provider_error',
    };
  }

  return buildMockWorkflowDemo(scenarioId, userPrompt);
}
