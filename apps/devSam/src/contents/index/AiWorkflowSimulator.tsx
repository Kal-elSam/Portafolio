import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { SectionButton } from '@/components/sections/SectionButton';

import {
  aiWorkflowScenarios,
  getScenarioById,
} from '@/contents/index/aiWorkflowScenarios';

import type {
  WorkflowDemoResult,
  WorkflowScenarioId,
  WorkflowStep,
  WorkflowStepPhase,
} from '@/lib/ai/types';

const phaseLabels: Record<WorkflowStepPhase, string> = {
  analyzing: 'Analyzing',
  routing: 'Routing',
  executing: 'Executing',
  completed: 'Completed',
};

const phaseStyles: Record<WorkflowStepPhase, string> = {
  analyzing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  routing: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  executing:
    'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
  completed:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
};

const flowColumns = [
  { key: 'input', label: 'User input' },
  { key: 'intent', label: 'AI intent' },
  { key: 'action', label: 'Tool / API action' },
  { key: 'outcome', label: 'Business outcome' },
] as const;

interface WorkflowStepCardProps {
  step: WorkflowStep;
  isActive: boolean;
  isVisible: boolean;
}

function WorkflowStepCard({ step, isActive, isVisible }: WorkflowStepCardProps) {
  if (!isVisible) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={clsx(
        'rounded-2xl border p-4 transition-shadow',
        isActive
          ? 'border-accent-400 shadow-lg shadow-accent-600/10 dark:border-accent-400'
          : 'border-slate-200 dark:border-slate-800',
        'bg-white dark:bg-slate-950/70'
      )}
    >
      <div className={clsx('mb-2 flex items-center justify-between gap-2')}>
        <p
          className={clsx(
            'text-xs font-black uppercase tracking-[0.16em] text-slate-500',
            'dark:text-slate-500'
          )}
        >
          {step.label}
        </p>
        <span
          className={clsx(
            'rounded-full px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wide',
            phaseStyles[step.phase]
          )}
        >
          {phaseLabels[step.phase]}
        </span>
      </div>
      <p
        className={clsx(
          'text-sm leading-6 text-slate-700',
          'dark:text-slate-300'
        )}
      >
        {step.detail}
      </p>
      {step.tool && (
        <p
          className={clsx(
            'text-accent-700 mt-2 text-xs font-bold',
            'dark:text-accent-300'
          )}
        >
          via {step.tool}
        </p>
      )}
    </motion.article>
  );
}

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

  const handleScenarioChange = useCallback((nextId: WorkflowScenarioId) => {
    setScenarioId(nextId);
    setUserPrompt(getScenarioById(nextId).samplePrompt);
    setResult(null);
    setVisibleStepCount(0);
    setErrorMessage('');
  }, []);

  const animateSteps = useCallback((steps: WorkflowStep[]) => {
    setVisibleStepCount(0);
    steps.forEach((_, index) => {
      window.setTimeout(() => {
        setVisibleStepCount(index + 1);
      }, (index + 1) * 650);
    });
  }, []);

  const handleRunWorkflow = useCallback(async () => {
    if (!userPrompt.trim() || isRunning) return;

    setIsRunning(true);
    setErrorMessage('');
    setResult(null);
    setVisibleStepCount(0);

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
    isRunning,
    liveAiAvailable,
    scenarioId,
    useLiveAi,
    userPrompt,
  ]);

  const activeScenario = getScenarioById(scenarioId);

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
          calls, and measurable outcomes. Mock mode runs instantly; live AI
          activates when server-side keys are configured.
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
              'mb-5 flex flex-col gap-3',
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

          <div
            className={clsx(
              'mb-4 grid gap-2',
              'sm:grid-cols-2 lg:grid-cols-4'
            )}
            aria-hidden="true"
          >
            {flowColumns.map((column, index) => (
              <div key={column.key} className={clsx('flex flex-col items-center')}>
                <div
                  className={clsx(
                    'w-full rounded-xl border border-dashed border-slate-200 px-2 py-2 text-center text-[0.65rem] font-black uppercase tracking-wide text-slate-500',
                    'dark:border-slate-700 dark:text-slate-400',
                    result && visibleStepCount > index && 'border-accent-400 text-accent-600 dark:text-accent-400'
                  )}
                >
                  {column.label}
                </div>
                {index < flowColumns.length - 1 && (
                  <span className={clsx('my-1 text-accent-600 text-xs font-black lg:hidden')}>
                    ↓
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className={clsx('grid gap-3')}>
            <AnimatePresence>
              {result?.steps.map((step, index) => (
                <WorkflowStepCard
                  key={step.id}
                  step={step}
                  isActive={visibleStepCount === index + 1}
                  isVisible={index < visibleStepCount}
                />
              ))}
            </AnimatePresence>
          </div>

          {result && visibleStepCount >= result.steps.length && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                'mt-5 rounded-2xl border px-4 py-4',
                'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/30'
              )}
            >
              <div
                className={clsx(
                  'mb-2 flex flex-wrap items-center gap-2'
                )}
              >
                <span
                  className={clsx(
                    'rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide',
                    result.mode === 'live'
                      ? 'bg-accent-600 text-white'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  )}
                >
                  {result.mode === 'live'
                    ? `Live · ${result.provider ?? 'AI'}`
                    : 'Mock mode'}
                </span>
              </div>
              <p
                className={clsx(
                  'text-sm font-semibold leading-6 text-emerald-900',
                  'dark:text-emerald-200'
                )}
              >
                {result.outcome}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AiWorkflowSimulator;
