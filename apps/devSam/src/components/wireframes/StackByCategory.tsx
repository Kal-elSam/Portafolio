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
    <div>
      {intro ? (
        <p
          className={clsx(
            'mb-2 text-sm leading-6 text-slate-600',
            'dark:text-slate-400'
          )}
        >
          {intro}
        </p>
      ) : null}

      <div className={clsx('mdx-table')}>
        <table>
          <caption className={clsx('sr-only')}>
            Technology stack grouped by category
          </caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Stack</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <strong
                    className={clsx('text-slate-900', 'dark:text-slate-100')}
                  >
                    {category.label}
                  </strong>
                </td>
                <td>{category.items.join(' · ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StackByCategory;
