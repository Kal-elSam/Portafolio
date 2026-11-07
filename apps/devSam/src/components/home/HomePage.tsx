import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useRef } from 'react';

import { ScrollTrigger } from '@/components/prototype/gsap';

import Hero from './Hero';
import HomeNav from './HomeNav';
import SectionNav from './SectionNav';

import home from './home.module.css';

// Everything below the hero. Still rendered on the server, so the page is
// complete without JavaScript, but split into chunks so the hero's first load
// stays small. KairoStage in particular holds the scene's loader and the large
// static drawing; the WebGL itself starts only when the stage nears the viewport.
const Work = dynamic(() => import('./Work'));
const KairoStage = dynamic(
  () => import('@/components/prototype/kairo/KairoStage')
);
const KairoRuntime = dynamic(() => import('./KairoRuntime'));
const AiInAction = dynamic(() => import('./AiInAction'));
const CareerContact = dynamic(() => import('./CareerContact'));
const BugHunt = dynamic(() => import('./game/BugHunt'));

type HomePageProps = {
  /** next/font variable classes for this route only. */
  fontClassName: string;
};

export default function HomePage({ fontClassName }: HomePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Paint the document with the theme field so overscroll never shows white.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const html = document.documentElement;
    const previous = html.style.backgroundColor;
    html.style.backgroundColor = getComputedStyle(node).backgroundColor;
    return () => {
      html.style.backgroundColor = previous;
    };
  }, []);

  // Sticky sections change height once motion is on, and lazy sections mount
  // after the first paint, which moves everything below them. Refresh the
  // scroll triggers whenever the page height changes so they measure the real
  // layout.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    let timer = 0;
    let last = node.offsetHeight;
    const observer = new ResizeObserver(() => {
      const next = node.offsetHeight;
      if (next === last) return;
      last = next;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    observer.observe(node);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className={clsx(home.root, fontClassName)}>
      <Head>
        {/* Section jumps and the scroll-scrubbed sections need instant
            scrolling; the site-wide smooth scroll would animate through them.
            Removed with the page. */}
        <style>{'html:root{scroll-behavior:auto}'}</style>
      </Head>
      <a href="#main" className={home.skip}>
        Skip to content
      </a>
      <HomeNav />
      <SectionNav />
      <main id="main">
        <div id="home">
          <Hero />
        </div>
        <div id="building">
          <KairoStage />
        </div>
        <KairoRuntime />
        <Work />
        <AiInAction />
        <CareerContact />
        <BugHunt />
      </main>
    </div>
  );
}
