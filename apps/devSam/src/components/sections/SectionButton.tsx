import clsx from 'clsx';

import type { ReactNode } from 'react';

interface SectionButtonProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  innerButtonUrl?: string;
  variant?: 'default' | 'compact';
}

export function SectionButton({
  title,
  description = '',
  icon = null,
  active = false,
  onClick = () => {},
  innerButtonUrl = '',
  variant = 'default',
}: SectionButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'flex items-center gap-2 rounded-2xl border-2 bg-white px-3 py-2 text-left transition-all duration-200',
        'dark:bg-slate-900',
        // Tamaños responsivos basados en el variant
        variant === 'compact' 
          ? 'min-w-[140px] max-w-[180px] flex-shrink-0 sm:min-w-[160px] sm:max-w-[200px]'
          : 'min-w-[220px] max-w-[320px] flex-shrink-0 sm:min-w-[250px] sm:max-w-[350px]',
        // Hover effects
        'hover:scale-105 hover:shadow-lg',
        active
          ? ['border-accent-400', 'dark:border-accent-400']
          : ['border-divider-light ', 'dark:border-divider-dark']
      )}
      onClick={onClick}
    >
      {icon && (
        <span
          className={clsx(
            'hidden w-8 shrink-0 justify-center text-center text-3xl font-black',
            'lg:flex lg:w-10 lg:text-4xl',
            active
              ? ['text-accent-600', 'dark:text-accent-400']
              : ['text-slate-400', 'dark:text-slate-600']
          )}
        >
          {icon}
        </span>
      )}
      <span className={clsx('flex-1 min-w-0')}>
        <span
          className={clsx(
            'block font-bold truncate',
            variant === 'compact' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base',
            active
              ? ['text-accent-600', 'dark:text-accent-400']
              : ['text-slate-700', 'dark:text-slate-200']
          )}
        >
          {title}
        </span>
        {description && (
          <span
            className={clsx(
              'mt-1 block text-xs text-slate-600 line-clamp-2 sm:text-sm',
              'dark:text-slate-400'
            )}
          >
            {description}
          </span>
        )}
      </span>
      {innerButtonUrl && (
        <a
          href={innerButtonUrl}
          className="flex items-center px-2 py-1 rounded-md text-xs font-medium text-white bg-accent-600 hover:bg-accent-700 sm:text-sm"
        >
          Browse
        </a>
      )}
    </button>
  );
}

export function SectionButtonSmall({
  title,
  icon = null,
  active = false,
  onClick = () => {},
}: Omit<SectionButtonProps, 'description'>) {
  return (
    <button
      type="button"
      className={clsx('flex flex-col items-center rounded-xl p-2 text-sm', [
        active
          ? ['text-accent-600', 'dark:text-accent-400']
          : ['text-slate-400', 'dark:text-slate-600'],
      ])}
      onClick={onClick}
    >
      <span className={clsx('text-4xl font-black')}>{icon}</span>
      <span
        className={clsx(
          'font-medium',
          active
            ? ['text-accent-600', 'dark:text-accent-400']
            : ['text-slate-500', 'dark:text-slate-400']
        )}
      >
        {title}
      </span>
    </button>
  );
}
