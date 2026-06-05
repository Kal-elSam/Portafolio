import { z } from 'zod';

import {
  executeWorkflowDemo,
  getWorkflowDemoCapabilities,
} from '@/lib/ai/workflow-demo';

import type {
  WorkflowDemoCapabilities,
  WorkflowDemoResult,
} from '@/lib/ai/types';
import type { TApiResponse } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

const workflowDemoRequestSchema = z.object({
  scenarioId: z.enum([
    'lead-qualification',
    'appointment-booking',
    'content-workflow',
  ]),
  userPrompt: z.string().min(3).max(500),
  useLiveAi: z.boolean().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    WorkflowDemoResult | WorkflowDemoCapabilities | TApiResponse
  >
) {
  if (req.method === 'GET') {
    res.status(200).json(getWorkflowDemoCapabilities());
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const parsed = workflowDemoRequestSchema.parse(req.body);
    const result = await executeWorkflowDemo({
      scenarioId: parsed.scenarioId,
      userPrompt: parsed.userPrompt,
      useLiveAi: parsed.useLiveAi,
    });
    res.status(200).json(result);
  } catch {
    res.status(400).json({ message: 'Invalid request' });
  }
}
