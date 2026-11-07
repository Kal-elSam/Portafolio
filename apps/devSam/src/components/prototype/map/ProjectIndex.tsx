import { AREAS, metaLine, PROJECTS, projectsByArea } from './data';

import type { MapProject } from './data';

import styles from './map.module.css';

function Row({ project }: { project: MapProject }) {
  const meta = metaLine(project);
  return (
    <li className={styles.row}>
      <span className={`${styles.rowYear} ${styles.data}`}>
        {project.year ?? ''}
      </span>
      <p className={styles.rowName}>
        {project.href ? (
          <a href={project.href} target="_blank" rel="noopener noreferrer">
            {project.name}
            <span className={styles.srOnly}> (opens in a new tab)</span>
          </a>
        ) : (
          project.name
        )}
        {project.featured && (
          <span className={styles.featuredMark}> · Featured</span>
        )}
      </p>
      <p className={styles.rowBlurb}>{project.blurb}</p>
      <p className={styles.rowMeta}>{meta}</p>
    </li>
  );
}

// Server-rendered: no hooks, no client code. Complete without JavaScript.
export default function ProjectIndex() {
  const dated = PROJECTS.filter((p) => p.year !== null).length;
  return (
    <section
      id="all-projects"
      className={styles.index}
      aria-labelledby="index-title"
    >
      <h2 id="index-title" className={styles.indexTitle}>
        All projects
      </h2>
      <p className={styles.indexLead}>
        {PROJECTS.length} projects in {AREAS.length} areas. {dated} carry a year
        taken from a source; the rest are listed as Year not stated rather than
        guessed.
      </p>

      {AREAS.map((area) => {
        const list = projectsByArea(area.id);
        const withYear = list
          .filter((p) => p.year !== null)
          .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        const without = list.filter((p) => p.year === null);
        return (
          <section
            key={area.id}
            id={`lane-${area.id}`}
            className={styles.lane}
            aria-labelledby={`lane-title-${area.id}`}
          >
            <header className={styles.laneHead}>
              <h3 id={`lane-title-${area.id}`} className={styles.laneName}>
                {area.name}
              </h3>
              <p className={`${styles.laneTotal} ${styles.data}`}>
                {list.length} projects
              </p>
              <p className={styles.laneSummary}>{area.summary}</p>
            </header>
            <div>
              {withYear.length > 0 && (
                <ol>
                  {withYear.map((p) => (
                    <Row key={p.id} project={p} />
                  ))}
                </ol>
              )}
              {without.length > 0 && (
                <>
                  <p className={styles.bandTitle}>Year not stated</p>
                  <ol>
                    {without.map((p) => (
                      <Row key={p.id} project={p} />
                    ))}
                  </ol>
                </>
              )}
            </div>
          </section>
        );
      })}
    </section>
  );
}
