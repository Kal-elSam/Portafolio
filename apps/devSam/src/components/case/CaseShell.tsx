import NextHead from 'next/head';
import { useEffect, useRef, useState } from 'react';

import Head from '@/components/meta/Head';
import { displayA, monoA } from '@/components/prototype/fonts-a';

import { getPageOgImageUrl } from '@/helpers/page';

import { CaseNav, CaseRail, NextCase } from './CaseChrome';
import { useJs, useReveal } from './useCase';

import type { CaseSection, NextCaseDef } from './CaseChrome';
import type { ReactNode } from 'react';

import styles from './case.module.css';

type CaseShellProps = {
  meta: { title: string; description: string; caption: string };
  sections: CaseSection[];
  next: NextCaseDef;
  children: ReactNode;
};

// A section is current once its top passes this share of the viewport height.
const READ_LINE = 0.4;

// The page has its own band (its getLayout returns it unwrapped), so only the
// field and the jump behaviour are set here. Both leave with the page's head.
const PAGE_FIELD =
  'html:root{scroll-behavior:auto}html:root body{background:#06080a}';

export default function CaseShell({
  meta,
  sections,
  next,
  children,
}: CaseShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const js = useJs();
  const [current, setCurrent] = useState(sections[0].id);

  useReveal(rootRef);

  // Current section: the last one whose top is above the read line.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * READ_LINE;
      const root = document.documentElement;
      const atEnd =
        window.scrollY + window.innerHeight >= root.scrollHeight - 2;
      let found = sections[0].id;
      sections.forEach(({ id }) => {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= line) found = id;
      });
      if (atEnd) found = sections[sections.length - 1].id;
      setCurrent((prev) => (prev === found ? prev : found));
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [sections]);

  const image = getPageOgImageUrl(meta);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${displayA.variable} ${monoA.variable}`}
      data-js={js ? '1' : '0'}
    >
      <Head
        title={meta.title}
        description={meta.description}
        ogImage={image.default}
      />
      <NextHead>
        <style key="case-field">{PAGE_FIELD}</style>
      </NextHead>
      <a href="#case-main" className={styles.skip}>
        Skip to content
      </a>
      <CaseNav sections={sections} current={current} />
      <CaseRail sections={sections} current={current} />
      <main id="case-main">{children}</main>
      <NextCase next={next} />
    </div>
  );
}
