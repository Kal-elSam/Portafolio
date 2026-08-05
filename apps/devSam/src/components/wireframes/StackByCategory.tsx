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
    <div className={clsx('space-y-8')}>
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
      <dl className={clsx('space-y-6')}>
        {categories.map((category) => (
          <div key={category.id}>
            <dt
              className={clsx(
                'text-xs font-bold uppercase tracking-[0.16em] text-slate-500',
                'dark:text-slate-500'
              )}
            >
              {category.label}
            </dt>
            <dd className={clsx('mt-2')}>
              <p
                className={clsx(
                  'text-sm leading-7 text-slate-700',
                  'dark:text-slate-300'
                )}
              >
                {category.items.join(' · ')}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default StackByCategory;
