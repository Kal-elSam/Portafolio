import clsx from 'clsx';
import { m } from 'framer-motion';
import { Fragment } from 'react';

import type {
  LiveFallbackReason,
  WorkflowDemoResult,
  WorkflowStep,
} from '@/lib/ai/types';

const STEP_LABELS = ['Input', 'Intent', 'Action', 'Outcome'] as const;

type PipelineNodeState = 'pending' | 'active' | 'completed';

function getFallbackMessage(reason?: LiveFallbackReason): string {
  switch (reason) {
    case 'quota_exceeded':
      return 'Gemini quota is exhausted and Groq fallback was unavailable. The demo continued in mock mode.';
    case 'invalid_response':
      return 'Live AI returned an unexpected format. The demo continued in mock mode.';
    case 'provider_error':
      return 'Live AI providers are temporarily unavailable. The demo continued in mock mode.';
    default:
      return 'Live AI was unavailable. The demo continued in mock mode.';
  }
}

function getNodeState(
  index: number,
  visibleStepCount: number,
  isComplete: boolean
): PipelineNodeState {
  if (visibleStepCount === 0) return 'pending';
  if (isComplete) return 'completed';
  if (index < visibleStepCount - 1) return 'completed';
  if (index === visibleStepCount - 1) return 'active';
  return 'pending';
}

function getModeBadgeClass(result: WorkflowDemoResult): string {
  if (result.mode === 'live') {
    return 'bg-accent-600 text-white';
  }
  if (result.liveFallback) {
    return 'bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200';
  }
  return 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
}

function getModeBadgeLabel(result: WorkflowDemoResult): string {
  if (result.mode === 'live') {
    return `Live · ${result.provider ?? 'AI'}`;
  }
  if (result.liveFallback) {
    return 'Mock · fallback';
  }
  return 'Mock';
}

function ModeBadge({ result }: { result: WorkflowDemoResult }) {
  return (
    <span
      className={clsx(
        'rounded-full px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wide',
        getModeBadgeClass(result)
      )}
    >
      {getModeBadgeLabel(result)}
    </span>
  );
}

interface PipelineNodeProps {
  index: number;
  state: PipelineNodeState;
  label: string;
}

function PipelineNode({ index, state, label }: PipelineNodeProps) {
  return (
    <div className={clsx('flex min-w-0 flex-1 flex-col items-center gap-1.5')}>
      <div
        className={clsx(
          'flex h-7 w-7 items-center justify-center rounded-full text-[0.65rem] font-black transition-colors duration-300',
          state === 'pending' &&
            'border border-dashed border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-600',
          state === 'active' && 'bg-accent-600 text-white dark:bg-accent-500',
          state === 'completed' && 'bg-emerald-500 text-white dark:bg-emerald-600'
        )}
      >
        {state === 'completed' ? '✓' : index + 1}
      </div>
      <p
        className={clsx(
          'text-center text-[0.55rem] font-black uppercase leading-tight tracking-wide',
          state === 'pending' && 'text-slate-400 dark:text-slate-600',
          state === 'active' && 'text-accent-600 dark:text-accent-400',
          state === 'completed' && 'text-emerald-600 dark:text-emerald-400'
        )}
      >
        {label}
      </p>
    </div>
  );
}

interface PipelineConnectorProps {
  filled: boolean;
}

function PipelineConnector({ filled }: PipelineConnectorProps) {
  return (
    <div
      className={clsx('relative mb-5 h-px w-full min-w-[0.35rem] max-w-[2.5rem] flex-1 self-start')}
      aria-hidden="true"
    >
      <div className={clsx('absolute inset-0 bg-slate-200 dark:bg-slate-800')} />
      <m.div
        initial={false}
        animate={{ scaleX: filled ? 1 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className={clsx('absolute inset-0 origin-left bg-emerald-500')}
      />
    </div>
  );
}

interface ActiveStepPanelProps {
  step: WorkflowStep;
  stepIndex: number;
  totalSteps: number;
}

function ActiveStepPanel({ step, stepIndex, totalSteps }: ActiveStepPanelProps) {
  return (
    <m.div
      key={step.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.28 }}
      className={clsx(
        'rounded-2xl border border-slate-200 bg-white px-4 py-4',
        'dark:border-slate-800 dark:bg-slate-950/80'
      )}
    >
      <p
        className={clsx(
          'text-accent-600 text-[0.65rem] font-black uppercase tracking-[0.16em]',
          'dark:text-accent-400'
        )}
      >
        Step {stepIndex + 1} of {totalSteps} · {STEP_LABELS[stepIndex]}
      </p>
      <p
        className={clsx(
          'mt-2 text-sm font-bold text-slate-900',
          'dark:text-white'
        )}
      >
        {step.label}
      </p>
      <p
        className={clsx(
          'mt-2 text-sm leading-6 text-slate-600',
          'dark:text-slate-400'
        )}
      >
        {step.detail}
      </p>
      {step.tool && (
        <p
          className={clsx(
            'text-accent-700 mt-2 text-xs font-semibold',
            'dark:text-accent-300'
          )}
        >
          via {step.tool}
        </p>
      )}
    </m.div>
  );
}

interface CompletedSummaryProps {
  steps: WorkflowStep[];
  result: WorkflowDemoResult;
}

function CompletedSummary({ steps, result }: CompletedSummaryProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'rounded-2xl border border-slate-200 bg-white',
        'dark:border-slate-800 dark:bg-slate-950/80'
      )}
    >
      <div
        className={clsx(
          'flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3',
          'dark:border-slate-800'
        )}
      >
        <p
          className={clsx(
            'text-sm font-bold text-slate-900',
            'dark:text-white'
          )}
        >
          Workflow complete
        </p>
        <ModeBadge result={result} />
      </div>

      <div className={clsx('px-4 py-4')}>
        <p
          className={clsx(
            'text-base font-semibold leading-7 text-slate-800',
            'dark:text-slate-100'
          )}
        >
          {result.outcome}
        </p>

        <dl
          className={clsx(
            'mt-4 grid gap-2.5 border-t border-slate-200 pt-4',
            'dark:border-slate-800'
          )}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={clsx(
                'grid gap-1',
                'sm:grid-cols-[4.5rem_1fr] sm:gap-3'
              )}
            >
              <dt
                className={clsx(
                  'text-[0.65rem] font-black uppercase tracking-wide text-slate-500',
                  'dark:text-slate-500'
                )}
              >
                {STEP_LABELS[index]}
              </dt>
              <dd
                className={clsx(
                  'text-sm leading-5 text-slate-600 line-clamp-2',
                  'dark:text-slate-400'
                )}
              >
                {step.detail}
              </dd>
            </div>
          ))}
        </dl>

        {result.liveFallback && (
          <p
            className={clsx(
              'mt-4 text-xs leading-5 text-amber-800',
              'dark:text-amber-200/90'
            )}
          >
            {getFallbackMessage(result.liveFallbackReason)}
          </p>
        )}
      </div>
    </m.div>
  );
}

interface WorkflowPipelineProps {
  steps: WorkflowStep[];
  visibleStepCount: number;
  isRunning: boolean;
  result: WorkflowDemoResult | null;
  showOutcome: boolean;
}

export function WorkflowPipeline({
  steps,
  visibleStepCount,
  isRunning,
  result,
  showOutcome,
}: WorkflowPipelineProps) {
  const isComplete = showOutcome && visibleStepCount >= steps.length && steps.length > 0;
  const activeStep =
    !isComplete && visibleStepCount > 0 ? steps[visibleStepCount - 1] : null;
  const showStepper = steps.length > 0 || isRunning;

  if (steps.length === 0 && !isRunning) {
    return (
      <div
        className={clsx(
          'rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center',
          'dark:border-slate-800'
        )}
      >
        <p
          className={clsx(
            'text-sm font-semibold text-slate-500',
            'dark:text-slate-400'
          )}
        >
          Run the workflow to trace intent → tools → outcome
        </p>
      </div>
    );
  }

  return (
    <div className={clsx('space-y-4')} aria-live="polite">
      {showStepper && (
        <div
          className={clsx('flex w-full items-start px-0.5')}
          role="list"
          aria-label="Workflow pipeline progress"
        >
          {steps.map((step, index) => {
            const state = getNodeState(index, visibleStepCount, isComplete);
            const connectorFilled = isComplete || index < visibleStepCount - 1;

            return (
              <Fragment key={step.id}>
                <div
                  role="listitem"
                  aria-current={state === 'active' ? 'step' : undefined}
                  className={clsx('min-w-0 flex-1')}
                >
                  <PipelineNode
                    index={index}
                    state={state}
                    label={STEP_LABELS[index] ?? step.label}
                  />
                </div>
                {index < steps.length - 1 && (
                  <PipelineConnector filled={connectorFilled} />
                )}
              </Fragment>
            );
          })}
        </div>
      )}

      {isRunning && visibleStepCount === 0 && (
        <div
          className={clsx(
            'flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4',
            'dark:border-slate-800 dark:bg-slate-900/50'
          )}
        >
          <span
            className={clsx(
              'bg-accent-600 inline-block h-1.5 w-1.5 animate-pulse rounded-full',
              'dark:bg-accent-400'
            )}
            aria-hidden="true"
          />
          <p className={clsx('text-sm text-slate-600', 'dark:text-slate-400')}>
            Analyzing request…
          </p>
        </div>
      )}

      {activeStep && (
        <ActiveStepPanel
          step={activeStep}
          stepIndex={visibleStepCount - 1}
          totalSteps={steps.length}
        />
      )}

      {isComplete && result && (
        <CompletedSummary steps={steps} result={result} />
      )}
    </div>
  );
}

/** Delay before the first step appears (ms). */
export const WORKFLOW_FIRST_STEP_MS = 700;

/** Pause between each subsequent step (ms). */
export const WORKFLOW_STEP_MS = 1800;

/** Extra pause after the last step before the outcome footer (ms). */
export const WORKFLOW_OUTCOME_DELAY_MS = 500;

export function getStepRevealDelay(stepIndex: number): number {
  if (stepIndex === 0) return WORKFLOW_FIRST_STEP_MS;
  return WORKFLOW_FIRST_STEP_MS + stepIndex * WORKFLOW_STEP_MS;
}
