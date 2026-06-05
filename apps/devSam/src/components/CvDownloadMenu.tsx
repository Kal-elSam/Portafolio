import { Menu } from '@headlessui/react';
import clsx from 'clsx';
import { m } from 'framer-motion';
import { forwardRef } from 'react';

import { ChevronRightIcon, DocumentIcon } from '@/components/Icons';

import { roleProfiles } from '@/contents/index/roleProfiles';

import type { Ref } from 'react';

const animation = {
  hide: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

interface CvDownloadItemProps {
  active: boolean;
  href: string;
  title: string;
  download: string;
}

const CvDownloadItem = forwardRef(
  (
    { active, href, title, download }: CvDownloadItemProps,
    ref: Ref<HTMLAnchorElement>
  ) => (
    <a
      ref={ref}
      href={href}
      download={download}
      className={clsx(
        'flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition',
        'hover:bg-slate-100',
        'dark:text-slate-200 dark:hover:bg-slate-800',
        [active && ['bg-slate-100', 'dark:bg-slate-800']]
      )}
    >
      <DocumentIcon className={clsx('h-4 w-4 shrink-0')} />
      {title}
    </a>
  )
);

CvDownloadItem.displayName = 'CvDownloadItem';

interface CvDownloadMenuProps {
  variant?: 'ghost' | 'outline' | 'soft';
  label?: string;
}

function CvDownloadMenu({
  variant = 'ghost',
  label = 'Download CV by role',
}: CvDownloadMenuProps) {
  const buttonClass = clsx('button', {
    'button--outline': variant === 'outline',
    'button--soft': variant === 'soft',
    'button--ghost': variant === 'ghost',
  });

  return (
    <Menu as="div" className={clsx('relative')}>
      {({ open }) => (
        <>
          <Menu.Button
            className={clsx(
              buttonClass,
              'inline-flex items-center gap-2 md:button--big',
              variant === 'ghost' && 'px-2 md:px-2'
            )}
            aria-label={label}
          >
            <DocumentIcon className={clsx('h-5 w-5')} />
            <span className={clsx('hidden sm:inline')}>{label}</span>
            <span className={clsx('sm:hidden')}>CV</span>
            <ChevronRightIcon
              className={clsx('h-3.5 w-3.5 transition', [open && 'rotate-90'])}
            />
          </Menu.Button>
          {open && (
            <Menu.Items
              static
              as={m.div}
              variants={animation}
              initial="hide"
              animate="show"
              className={clsx(
                'absolute left-0 top-[calc(100%+0.5rem)] z-50 flex w-60 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-950/10',
                'dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30'
              )}
            >
              <p
                className={clsx(
                  'px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500',
                  'dark:text-slate-500'
                )}
              >
                Select role
              </p>
              {roleProfiles.map((role) => {
                const filename = role.cvHref.split('/').pop() ?? role.cvHref;

                return (
                  <Menu.Item key={role.id}>
                    {({ active }) => (
                      <CvDownloadItem
                        active={active}
                        href={role.cvHref}
                        download={filename}
                        title={role.title}
                      />
                    )}
                  </Menu.Item>
                );
              })}
            </Menu.Items>
          )}
        </>
      )}
    </Menu>
  );
}

export default CvDownloadMenu;
