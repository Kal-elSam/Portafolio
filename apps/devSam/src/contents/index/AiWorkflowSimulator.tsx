import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SectionButton } from '@/components/sections/SectionButton';

import {
  aiWorkflowScenarios,
  getScenarioById,
} from '@/contents/index/aiWorkflowScenarios';
import {
  getStepRevealDelay,
  WORKFLOW_OUTCOME_DELAY_MS,
  WorkflowPipeline,
} from '@/contents/index/WorkflowPipeline';

import type {
  WorkflowDemoResult,
  WorkflowScenarioId,
  WorkflowStep,
} from '@/lib/ai/types';

function AiWorkflowSimulator() {
  const [scenarioId, setScenarioId] =
    useState<WorkflowScenarioId>('lead-qualification');
  const [userPrompt, setUserPrompt] = useState(
    () => getScenarioById('lead-qualification').samplePrompt
  );
  const [useLiveAi, setUseLiveAi] = useState(false);
  const [liveAiAvailable, setLiveAiAvailable] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [visibleStepCount, setVisibleStepCount] = useState(0);
  const [result, setResult] = useState<WorkflowDemoResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showOutcome, setShowOutcome] = useState(false);
  const stepTimeoutsRef = useRef<number[]>([]);

  const clearStepTimeouts = useCallback(() => {
    stepTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    stepTimeoutsRef.current = [];
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchCapabilities() {
      try {
        const response = await fetch('/api/ai/workflow-demo');
        if (!response.ok) return;
        const data = (await response.json()) as { liveAiAvailable: boolean };
        if (isMounted) setLiveAiAvailable(data.liveAiAvailable);
      } catch {
        if (isMounted) setLiveAiAvailable(false);
      }
    }

    fetchCapabilities();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => clearStepTimeouts, [clearStepTimeouts]);

  const handleScenarioChange = useCallback(
    (nextId: WorkflowScenarioId) => {
      clearStepTimeouts();
      setScenarioId(nextId);
      setUserPrompt(getScenarioById(nextId).samplePrompt);
      setResult(null);
      setVisibleStepCount(0);
      setShowOutcome(false);
      setErrorMessage('');
    },
    [clearStepTimeouts]
  );

  const animateSteps = useCallback(
    (steps: WorkflowStep[]) => {
      clearStepTimeouts();
      setVisibleStepCount(0);
      setShowOutcome(false);

      steps.forEach((_, index) => {
        const timeoutId = window.setTimeout(() => {
          setVisibleStepCount(index + 1);

          if (index === steps.length - 1) {
            const outcomeTimeoutId = window.setTimeout(() => {
              setShowOutcome(true);
            }, WORKFLOW_OUTCOME_DELAY_MS);
            stepTimeoutsRef.current.push(outcomeTimeoutId);
          }
        }, getStepRevealDelay(index));
        stepTimeoutsRef.current.push(timeoutId);
      });
    },
    [clearStepTimeouts]
  );

  const handleRunWorkflow = useCallback(async () => {
    if (!userPrompt.trim() || isRunning) return;

    clearStepTimeouts();
    setIsRunning(true);
    setErrorMessage('');
    setResult(null);
    setVisibleStepCount(0);
    setShowOutcome(false);

    try {
      const response = await fetch('/api/ai/workflow-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId,
          userPrompt: userPrompt.trim(),
          useLiveAi: useLiveAi && liveAiAvailable,
        }),
      });

      if (!response.ok) {
        setErrorMessage('Could not run the workflow demo. Try again.');
        return;
      }

      const data = (await response.json()) as WorkflowDemoResult;
      setResult(data);
      animateSteps(data.steps);
    } catch {
      setErrorMessage('Network error. Mock mode will retry on next run.');
    } finally {
      setIsRunning(false);
    }
  }, [
    animateSteps,
    clearStepTimeouts,
    isRunning,
    liveAiAvailable,
    scenarioId,
    useLiveAi,
    userPrompt,
  ]);

  const activeScenario = getScenarioById(scenarioId);
  const pipelineSteps = result?.steps ?? [];

  return (
    <section className={clsx('content-wrapper')} aria-labelledby="ai-workflow-title">
      <div className={clsx('mb-7 max-w-3xl')}>
        <p
          className={clsx(
            'text-accent-600 text-sm font-black uppercase tracking-[0.24em]',
            'dark:text-accent-400'
          )}
        >
          AI systems in practice
        </p>
        <h2
          id="ai-workflow-title"
          className={clsx(
            'mt-2 text-3xl font-black tracking-normal text-slate-950',
            'md:text-4xl dark:text-white'
          )}
        >
          See how business requests become production AI workflows.
        </h2>
        <p
          className={clsx(
            'mt-3 max-w-2xl text-sm leading-6 text-slate-600',
            'md:text-base dark:text-slate-400'
          )}
        >
          Not a generic chatbot — a visual simulator of intent routing, tool
          calls, and measurable outcomes.
        </p>
      </div>

      <div className={clsx('flex flex-col gap-8', 'lg:flex-row lg:gap-10')}>
        <div className={clsx('flex flex-col gap-3', 'lg:max-w-[22rem]')}>
          <div
            className={clsx(
              'flex gap-2 overflow-x-auto pb-1',
              'lg:flex-col lg:overflow-visible'
            )}
          >
            {aiWorkflowScenarios.map((scenario, index) => (
              <SectionButton
                key={scenario.id}
                title={scenario.title}
                description={scenario.summary}
                icon={index + 1}
                active={scenarioId === scenario.id}
                onClick={() => handleScenarioChange(scenario.id)}
              />
            ))}
          </div>
        </div>

        <div
          className={clsx(
            'flex-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/[0.04]',
            'dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20',
            'md:p-6'
          )}
        >
          <div className={clsx('mb-4')}>
            <label
              htmlFor="workflow-prompt"
              className={clsx(
                'text-xs font-black uppercase tracking-[0.16em] text-slate-500',
                'dark:text-slate-500'
              )}
            >
              Sample {activeScenario.title.toLowerCase()} request
            </label>
            <textarea
              id="workflow-prompt"
              rows={3}
              value={userPrompt}
              onChange={(event) => setUserPrompt(event.target.value)}
              className={clsx(
                'mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-800 outline-none',
                'focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20',
                'dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200'
              )}
            />
          </div>

          <div
            className={clsx(
              'mb-6 flex flex-col gap-3',
              'sm:flex-row sm:items-center sm:justify-between'
            )}
          >
            <label
              htmlFor="live-ai-toggle"
              className={clsx(
                'inline-flex items-center gap-2 text-sm font-semibold text-slate-600',
                'dark:text-slate-400',
                !liveAiAvailable && 'opacity-60'
              )}
            >
              <input
                id="live-ai-toggle"
                type="checkbox"
                checked={useLiveAi && liveAiAvailable}
                disabled={!liveAiAvailable}
                onChange={(event) => setUseLiveAi(event.target.checked)}
                className={clsx(
                  'text-accent-600 h-4 w-4 rounded border-slate-300',
                  'focus:ring-accent-400'
                )}
              />
              Try live AI (server-side)
            </label>

            <button
              type="button"
              onClick={handleRunWorkflow}
              disabled={isRunning || !userPrompt.trim()}
              className={clsx(
                'button button--solid inline-flex items-center justify-center px-5 py-2.5 text-sm font-black',
                (isRunning || !userPrompt.trim()) && 'cursor-not-allowed opacity-60'
              )}
            >
              {isRunning ? 'Running workflow…' : 'Run workflow'}
            </button>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className={clsx(
                'mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700',
                'dark:border-red-900 dark:bg-red-950/40 dark:text-red-300'
              )}
            >
              {errorMessage}
            </p>
          )}

          <WorkflowPipeline
            steps={pipelineSteps}
            visibleStepCount={visibleStepCount}
            isRunning={isRunning}
            result={result}
            showOutcome={showOutcome}
          />
        </div>
      </div>
    </section>
  );
}

export default AiWorkflowSimulator;
