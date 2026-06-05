import { z } from 'zod';

import { getScenarioById } from '@/contents/index/aiWorkflowScenarios';

import type {
  AiProviderId,
  WorkflowDemoResult,
  WorkflowScenarioId,
  WorkflowStep,
} from '@/lib/ai/types';

const workflowStepSchema = z.object({
  id: z.string(),
  phase: z.enum(['analyzing', 'routing', 'executing', 'completed']),
  label: z.string(),
  detail: z.string(),
  tool: z.string().optional(),
});

const workflowResponseSchema = z.object({
  steps: z.array(workflowStepSchema).min(3).max(6),
  outcome: z.string(),
});

export interface AiWorkflowProvider {
  id: AiProviderId;
  isConfigured: () => boolean;
  generateWorkflow: (
    scenarioId: WorkflowScenarioId,
    userPrompt: string
  ) => Promise<WorkflowDemoResult | null>;
}

function buildSystemPrompt(
  scenarioId: WorkflowScenarioId,
  userPrompt: string
): string {
  const scenario = getScenarioById(scenarioId);

  return `You are an AI workflow simulator for a portfolio demo.
Scenario: ${scenario.title} — ${scenario.summary}
Available tools: ${scenario.tools.join(', ')}

Given this user input:
"${userPrompt}"

Return ONLY valid JSON (no markdown fences) with this shape:
{
  "steps": [
    { "id": "string", "phase": "analyzing|routing|executing|completed", "label": "string", "detail": "string", "tool": "optional tool name" }
  ],
  "outcome": "one sentence business outcome"
}

Rules:
- Include 4 steps: user input analysis, AI intent, tool/API action, business outcome.
- Use realistic tool names from the scenario.
- Keep details concise and production-oriented.
- Phases must progress: analyzing → routing → executing → completed.`;
}

function parseProviderJson(
  raw: string,
  scenarioId: WorkflowScenarioId,
  userPrompt: string,
  provider: AiProviderId
): WorkflowDemoResult | null {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const parsed = workflowResponseSchema.parse(JSON.parse(cleaned));
    return {
      mode: 'live',
      provider,
      scenarioId,
      userInput: userPrompt,
      steps: parsed.steps as WorkflowStep[],
      outcome: parsed.outcome,
    };
  } catch {
    return null;
  }
}

async function callGemini(
  scenarioId: WorkflowScenarioId,
  userPrompt: string
): Promise<WorkflowDemoResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = buildSystemPrompt(scenarioId, userPrompt);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!response.ok) return null;

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  return parseProviderJson(text, scenarioId, userPrompt, 'gemini');
}

async function callGroq(
  scenarioId: WorkflowScenarioId,
  userPrompt: string
): Promise<WorkflowDemoResult | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const prompt = buildSystemPrompt(scenarioId, userPrompt);
  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    }
  );

  if (!response.ok) return null;

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) return null;

  return parseProviderJson(text, scenarioId, userPrompt, 'groq');
}

async function callOpenRouter(
  scenarioId: WorkflowScenarioId,
  userPrompt: string
): Promise<WorkflowDemoResult | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const prompt = buildSystemPrompt(scenarioId, userPrompt);
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://sam.dev',
        'X-Title': 'Sam Portfolio AI Demo',
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    }
  );

  if (!response.ok) return null;

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) return null;

  return parseProviderJson(text, scenarioId, userPrompt, 'openrouter');
}

export const aiProviders: AiWorkflowProvider[] = [
  {
    id: 'gemini',
    isConfigured: () => Boolean(process.env.GEMINI_API_KEY),
    generateWorkflow: callGemini,
  },
  {
    id: 'groq',
    isConfigured: () => Boolean(process.env.GROQ_API_KEY),
    generateWorkflow: callGroq,
  },
  {
    id: 'openrouter',
    isConfigured: () => Boolean(process.env.OPENROUTER_API_KEY),
    generateWorkflow: callOpenRouter,
  },
];

async function tryProviderAtIndex(
  index: number,
  scenarioId: WorkflowScenarioId,
  userPrompt: string
): Promise<WorkflowDemoResult | null> {
  if (index >= aiProviders.length) {
    return null;
  }

  const provider = aiProviders[index];

  if (provider.isConfigured()) {
    try {
      const result = await provider.generateWorkflow(scenarioId, userPrompt);
      if (result) {
        return result;
      }
    } catch {
      // Try next provider in chain.
    }
  }

  return tryProviderAtIndex(index + 1, scenarioId, userPrompt);
}

export async function runLiveWorkflowDemo(
  scenarioId: WorkflowScenarioId,
  userPrompt: string
): Promise<WorkflowDemoResult | null> {
  return tryProviderAtIndex(0, scenarioId, userPrompt);
}
