import { useEffect, useRef } from 'react';

import { CV_HREF } from '@/components/prototype/map/data';

import home from './home.module.css';

// Past this scroll distance the band hides while reading down and returns on
// the first move up, so it never sits on a section title.
const HIDE_AFTER = 120;
const DELTA = 6;

// In-page jump; without the section on the page the browser's own anchor jump
// runs. The page sets `scroll-behavior: auto`, so the jump is instant.
const jump = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  const target = document.getElementById(id);
  if (
    !target ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  target.scrollIntoView({ block: 'start' });
  window.history.replaceState(null, '', `#${id}`);
};

// Every link stays on this page: Work, Career and Contact are sections of it,
// and the CV is the download. The name is a link back to the top that only
// shows once the hero's own large name has scrolled out of view.
export default function HomeNav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      nav.dataset.top = y < 24 ? '1' : '0';
      if (y < HIDE_AFTER) {
        nav.dataset.hidden = '0';
      } else if (y > last + DELTA) {
        nav.dataset.hidden = '1';
      } else if (y < last - DELTA) {
        nav.dataset.hidden = '0';
      }
      if (Math.abs(y - last) > DELTA) last = y;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    // Keyboard focus inside the band always brings it back.
    const onFocus = () => {
      nav.dataset.hidden = '0';
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    nav.addEventListener('focusin', onFocus);

    // The name shows once the hero's name has left through the top.
    const title = document.getElementById('hero-title');
    let observer: IntersectionObserver | undefined;
    if (title) {
      observer = new IntersectionObserver(([entry]) => {
        nav.dataset.name =
          !entry.isIntersecting && entry.boundingClientRect.bottom < 0
            ? '1'
            : '0';
      });
      observer.observe(title);
    } else {
      nav.dataset.name = '1';
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      nav.removeEventListener('focusin', onFocus);
      observer?.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={home.nav}
      aria-label="Primary"
      data-top="1"
      data-hidden="0"
      data-name="0"
    >
      <noscript>
        {/* Without scripts the band stays solid, so it never covers a title,
            and the name stays visible. */}
        <style>{`.${home.nav}[data-top="1"]{background:#06080a;border-bottom-color:rgba(232,237,229,.16)}.${home.nav}[data-name="0"] .${home.navName}{opacity:1;pointer-events:auto}`}</style>
      </noscript>
      <a
        href="#home"
        className={home.navName}
        onClick={(event) => jump(event, 'home')}
      >
        Samuel Gomez
      </a>
      <ul className={home.navLinks}>
        <li>
          <a href="#projects" onClick={(event) => jump(event, 'projects')}>
            Work
          </a>
        </li>
        <li>
          <a href="#career" onClick={(event) => jump(event, 'career')}>
            Career
          </a>
        </li>
        <li>
          <a href="#contact" onClick={(event) => jump(event, 'contact')}>
            Contact
          </a>
        </li>
        <li>
          <a href={CV_HREF} download data-cv>
            CV
          </a>
        </li>
      </ul>
    </nav>
  );
}
