import clsx from 'clsx';

const metrics = [
  {
    value: '6+',
    label: 'years shipping product systems end-to-end',
  },
  {
    value: '30%',
    label: 'performance gains from frontend architecture work',
  },
  {
    value: '24',
    label: 'projects spanning SaaS, dashboards, and AI integrations',
  },
  {
    value: '5',
    label: 'companies served — product delivery from startup to enterprise',
  },
];

function ImpactMetrics() {
  return (
    <section className={clsx('content-wrapper')}>
      <div
        className={clsx(
          'grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-950/[0.04]',
          'dark:border-slate-800 dark:bg-slate-950/60 dark:shadow-black/20',
          'sm:grid-cols-2 lg:grid-cols-4'
        )}
      >
        {metrics.map((metric, index) => (
          <div
            key={metric.value}
            className={clsx(
              'relative min-h-[132px] p-5',
              index !== metrics.length - 1 &&
                'border-b border-slate-200 dark:border-slate-800',
              'sm:odd:border-r sm:even:border-r-0 lg:border-b-0 lg:border-r'
            )}
          >
            <p
              className={clsx(
                'text-4xl font-black leading-none text-slate-950',
                'dark:text-white'
              )}
            >
              {metric.value}
            </p>
            <p
              className={clsx(
                'mt-3 max-w-[14rem] text-sm font-semibold leading-6 text-slate-600',
                'dark:text-slate-400'
              )}
            >
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ImpactMetrics;
