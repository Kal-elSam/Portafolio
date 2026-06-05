import clsx from 'clsx';

export type DeliveryPhaseId =
  | 'scope'
  | 'design'
  | 'integrations'
  | 'ship';

interface DeliveryPhase {
  id: DeliveryPhaseId;
  eyebrow: string;
  title: string;
  summary: string;
  deliverables: string[];
  layers: string[];
  outcome: string;
}

export const deliveryPhases: DeliveryPhase[] = [
  {
    id: 'scope',
    eyebrow: 'Discovery',
    title: 'Product Scope',
    summary:
      'Frame the problem, define success metrics, and sequence delivery around business outcomes.',
    deliverables: [
      'Problem statement and stakeholder alignment',
      'Success metrics and rollout milestones',
      'Scope boundaries for MVP vs. scale phase',
    ],
    layers: ['Business goals', 'Requirements', 'Delivery plan'],
    outcome: 'Teams know what to build and how success is measured.',
  },
  {
    id: 'design',
    eyebrow: 'Architecture',
    title: 'System Design',
    summary:
      'Shape modular product systems with clear contracts between UI, APIs, and data.',
    deliverables: [
      'Module boundaries and ownership model',
      'API contracts and typed service layers',
      'Scalable frontend and backend structure',
    ],
    layers: ['Product UI', 'API layer', 'Data & services'],
    outcome: 'Parallel delivery without breaking system contracts.',
  },
  {
    id: 'integrations',
    eyebrow: 'Connections',
    title: 'Integrations',
    summary:
      'Wire the product into real operations — messaging, CRM, AI workflows, and data handoffs.',
    deliverables: [
      'WhatsApp, CRM, and third-party API orchestration',
      'LLM routing and automation workflows',
      'Secure handoffs between public and internal systems',
    ],
    layers: ['External APIs', 'Orchestration', 'Product surfaces'],
    outcome: 'Features connect to how the business actually runs.',
  },
  {
    id: 'ship',
    eyebrow: 'Production',
    title: 'Ship & Measure',
    summary:
      'Move from build to production with quality gates, monitoring, and iteration loops.',
    deliverables: [
      'Release readiness and regression checks',
      'Performance and reliability monitoring',
      'Iteration based on usage and business signals',
    ],
    layers: ['Build', 'Deploy', 'Monitor', 'Improve'],
    outcome: 'Shipped systems with measurable production impact.',
  },
];

interface ProductDeliveryPanelProps {
  phaseId: DeliveryPhaseId;
}

function ProductDeliveryPanel({ phaseId }: ProductDeliveryPanelProps) {
  const phase =
    deliveryPhases.find((item) => item.id === phaseId) ?? deliveryPhases[0];

  return (
    <div
      className={clsx(
        'w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/[0.04]',
        'dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20',
        'md:p-6'
      )}
    >
      <p
        className={clsx(
          'text-accent-600 text-xs font-black uppercase tracking-[0.2em]',
          'dark:text-accent-400'
        )}
      >
        {phase.eyebrow}
      </p>
      <h3
        className={clsx(
          'mt-2 text-xl font-black text-slate-950',
          'dark:text-white'
        )}
      >
        {phase.title}
      </h3>
      <p
        className={clsx(
          'mt-2 text-sm leading-6 text-slate-600',
          'dark:text-slate-400'
        )}
      >
        {phase.summary}
      </p>

      <div className={clsx('mt-5 grid gap-5', 'md:grid-cols-[1fr_auto]')}>
        <div>
          <p
            className={clsx(
              'text-xs font-black uppercase tracking-[0.16em] text-slate-500',
              'dark:text-slate-500'
            )}
          >
            Deliverables
          </p>
          <ul
            className={clsx(
              'mt-2 space-y-2 text-sm leading-6 text-slate-700',
              'dark:text-slate-300'
            )}
          >
            {phase.deliverables.map((item) => (
              <li key={item} className={clsx('flex gap-2')}>
                <span
                  className={clsx(
                    'text-accent-600 mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current',
                    'dark:text-accent-400'
                  )}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={clsx(
            'rounded-2xl border border-slate-200 bg-slate-50/80 p-4',
            'dark:border-slate-800 dark:bg-slate-900/70',
            'md:min-w-[11rem]'
          )}
        >
          <p
            className={clsx(
              'text-xs font-black uppercase tracking-[0.16em] text-slate-500',
              'dark:text-slate-500'
            )}
          >
            System flow
          </p>
          <div className={clsx('mt-3 flex flex-col items-stretch gap-1.5')}>
            {phase.layers.map((layer, index) => (
              <div key={layer} className={clsx('flex flex-col items-center')}>
                <div
                  className={clsx(
                    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-xs font-bold text-slate-700',
                    'dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
                  )}
                >
                  {layer}
                </div>
                {index < phase.layers.length - 1 && (
                  <span
                    className={clsx(
                      'text-accent-600 my-0.5 text-[10px] font-black',
                      'dark:text-accent-400'
                    )}
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p
        className={clsx(
          'bg-accent-600/[0.08] text-accent-700 mt-5 rounded-2xl px-4 py-3 text-sm font-semibold leading-6',
          'dark:bg-accent-400/10 dark:text-accent-300'
        )}
      >
        {phase.outcome}
      </p>
    </div>
  );
}

export default ProductDeliveryPanel;
