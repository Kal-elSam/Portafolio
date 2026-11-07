import { useEffect, useState } from 'react';

import type { MapProject } from '@/components/prototype/map/data';

import home from './home.module.css';

// A project's own destination, opened in a new tab. Callers render this only
// when the project has an `href`.
export default function ProjectLink({
  project,
  className,
  children,
}: {
  project: MapProject;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className={home.srOnly}> (opens in a new tab)</span>
    </a>
  );
}

/**
 * The action of a project's inspector. A project with a destination links to
 * it; the systems that open on a sign-in say so; a project with none shows a
 * status line (private repository or private project), never a dead button.
 */
export function ProjectAction({
  project,
  className,
  noteClassName,
  lockClassName,
}: {
  project: MapProject;
  className: string;
  noteClassName: string;
  lockClassName: string;
}) {
  if (project.href) {
    return (
      <>
        <ProjectLink project={project} className={className}>
          {project.signIn ? 'Open live system' : 'Visit the project'}
          <span aria-hidden="true"> ↗</span>
        </ProjectLink>
        {project.signIn ? (
          <span className={noteClassName}>sign-in required</span>
        ) : null}
      </>
    );
  }
  // No public destination: only a status line, never a dead button.
  return (
    <span className={noteClassName}>
      <svg
        className={lockClassName}
        viewBox="0 0 12 14"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="1"
          y="6"
          width="10"
          height="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
      {project.privateRepo ? 'Private repository' : 'Private project'}
    </span>
  );
}

/** Tracks a media query after mount; false on the server and before it. */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}
