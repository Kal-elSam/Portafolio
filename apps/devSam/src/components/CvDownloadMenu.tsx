import clsx from 'clsx';

import { DocumentIcon } from '@/components/Icons';

import { CV_HREF } from '@/contents/index/roleProfiles';

interface CvDownloadMenuProps {
  variant?: 'ghost' | 'outline' | 'soft';
  label?: string;
}

function CvDownloadMenu({
  variant = 'ghost',
  label = 'Download CV',
}: CvDownloadMenuProps) {
  const buttonClass = clsx('button', {
    'button--outline': variant === 'outline',
    'button--soft': variant === 'soft',
    'button--ghost': variant === 'ghost',
  });

  return (
    <a
      href={CV_HREF}
      download="SamuelGomez-CV.pdf"
      className={clsx(
        buttonClass,
        'md:button--big inline-flex items-center gap-2',
        variant === 'ghost' && 'px-2 md:px-2'
      )}
      aria-label={label}
    >
      <DocumentIcon className={clsx('h-5 w-5')} />
      <span className={clsx('hidden sm:inline')}>{label}</span>
      <span className={clsx('sm:hidden')}>CV</span>
    </a>
  );
}

export default CvDownloadMenu;
