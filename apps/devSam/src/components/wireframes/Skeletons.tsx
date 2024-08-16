import clsx from 'clsx';

import type { PropsWithChildren } from 'react';

interface SkeletonProps {
  /**
   * Skeleton width in pixels.
   */
  w?: number;
}

export function SkeletonSm({
  w = 16,
  children = null,
}: PropsWithChildren<SkeletonProps>) {
  return (
    <div
      className={clsx(
        'flex h-4 items-center rounded-md bg-slate-200/80',
        'dark:bg-slate-100/5'
      )}
      style={{ width: w }}
    >
      {children}
    </div>
  );
}

export function SkeletonMd({
  w = 24,
  children = null,
}: PropsWithChildren<SkeletonProps>) {
  return (
    <div
      className={clsx(
        'flex h-6 items-center rounded-lg bg-slate-200/80',
        'dark:bg-slate-100/5'
      )}
      style={{ width: w }}
    >
      {children}
    </div>
  );
}

export function SkeletonPhone({
  w = 275,
  h = 412,
  children = null,
}: PropsWithChildren<{ w?: number; h?: number }>) {
  return (
    <div
      className={clsx(
        'relative flex items-center justify-center rounded-[40px] bg-slate-200/80',
        'dark:bg-slate-100/5'
      )}
      style={{
        width: w,
        height: h,
        padding: '20px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        className="w-full h-full bg-white dark:bg-[#0c1222] rounded-[30px]"
        style={{
          paddingTop: '15px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
