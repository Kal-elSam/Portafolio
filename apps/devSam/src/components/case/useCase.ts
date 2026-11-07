import { useEffect, useState } from 'react';

import type { RefObject } from 'react';

/** True after hydration. Everything that hides content for a state-driven
 * view waits for it, so the server markup is the complete static page. */
export function useJs(): boolean {
  const [js, setJs] = useState(false);
  useEffect(() => setJs(true), []);
  return js;
}

/** Marks every `[data-reveal]` inside the root once it enters the viewport.
 * The CSS decides what that looks like, and only when motion is allowed. */
export function useReveal(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.setAttribute('data-in', ''));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-in', '');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    nodes.forEach((node) => observer.observe(node));
    // Sections that sit far above the viewport after a hash jump never enter
    // it from below: reveal whatever is already behind the reader.
    const sweep = () => {
      nodes.forEach((node) => {
        if (
          !node.hasAttribute('data-in') &&
          node.getBoundingClientRect().bottom < 0
        ) {
          node.setAttribute('data-in', '');
        }
      });
    };
    window.addEventListener('scroll', sweep, { passive: true });
    return () => {
      window.removeEventListener('scroll', sweep);
      observer.disconnect();
    };
  }, [rootRef]);
}
