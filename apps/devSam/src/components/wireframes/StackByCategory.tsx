import clsx from 'clsx';

export interface StackCategory {
  id: string;
  label: string;
  items: string[];
}

interface StackByCategoryProps {
  categories: StackCategory[];
  intro?: string;
}

export const defaultStackCategories: StackCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Zustand',
      'Redux Toolkit',
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: ['Node.js', 'Express', 'GraphQL'],
  },
  {
    id: 'database',
    label: 'Database',
    items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase'],
  },
  {
    id: 'ai',
    label: 'AI',
    items: [
      'LLM Function Calling',
      'Prompt Engineering',
      'Workflow Orchestration',
      'Gemini',
      'Groq',
      'Claude Code',
      'GPT',
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & Deployment',
    items: [
      'Vercel',
      'Railway',
      'Docker',
      'Docker Compose',
      'GitHub Actions',
      'Sentry',
      'Cloudinary',
      'AWS',
      'GCP',
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    items: ['Flutter', 'React Native'],
  },
  {
    id: 'tooling',
    label: 'Tooling',
    items: ['Git', 'Figma', 'Jest', 'Playwright', 'Postman'],
  },
];

function StackByCategory({
  categories,
  intro = 'The tools I reach for most often, grouped by where they sit in a product — not a proficiency scorecard.',
}: StackByCategoryProps) {
  return (
    <div className={clsx('space-y-5')}>
      {intro ? (
        <p
          className={clsx(
            'text-sm leading-6 text-slate-600',
            'dark:text-slate-400'
          )}
        >
          {intro}
        </p>
      ) : null}
      <div className={clsx('grid gap-3', 'sm:grid-cols-2')}>
        {categories.map((category) => (
          <article
            key={category.id}
            className={clsx(
              'rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/[0.03]',
              'dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-black/20'
            )}
          >
            <h3
              className={clsx(
                'text-sm font-black uppercase tracking-[0.16em] text-slate-500',
                'dark:text-slate-500'
              )}
            >
              {category.label}
            </h3>
            <ul className={clsx('mt-3 flex flex-wrap gap-1.5')}>
              {category.items.map((item) => (
                <li
                  key={item}
                  className={clsx(
                    'rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700',
                    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                  )}
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

export default StackByCategory;
