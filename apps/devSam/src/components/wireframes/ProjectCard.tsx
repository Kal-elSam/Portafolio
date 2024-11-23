import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

import { ExternalLink } from '../Icons';
import { any } from 'zod';

interface ProjectCardProps {
  projectName: string;
  description: string;
  link: string;
  technologies: string[];
  iphoneScreenshots?: string[];
  macScreenshots?: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = function ProjectCard({
  projectName,
  description,
  link,
  technologies,
  iphoneScreenshots = [],
  macScreenshots = [],
}) {
  // Determinar qué capturas de pantalla usar
  let screenshots: string[] = [];
  let screenshotType = '';

  if (iphoneScreenshots.length > 0) {
    screenshots = iphoneScreenshots;
    screenshotType = 'iphone';
  } else if (macScreenshots.length > 0) {
    screenshots = macScreenshots;
    screenshotType = 'mac';
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg text-white shadow-lg md:flex-row">
      {/* Contenedor del contenido del proyecto */}
      <div className="relative flex w-full flex-col gap-6 rounded-lg bg-gray-900 p-6 shadow-lg md:w-1/2">
        {/* Nombre del Proyecto */}
        <div>
          <h2 className="text-xl font-semibold uppercase tracking-wide text-teal-300">
            {projectName}
          </h2>
        </div>

        {/* Descripción del Proyecto */}
        <div className="rounded-md bg-gray-800 p-4 shadow-md">
          <p className="text-sm leading-relaxed text-gray-400">{description}</p>
        </div>

        {/* Tecnologías */}
        <div className="flex flex-wrap items-center gap-3">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
        {/* Enlace al Proyecto */}
        {link && (
          <div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-teal-500 hover:text-teal-400"
            >
              <ExternalLink className="h-5 w-5" aria-label={`External link to ${projectName}`} />
            </a>
          </div>
        )}
      </div>

      {/* Contenedor de la imagen */}
      <div className="flex w-full items-center justify-center p-6 md:w-1/2">
        <div
          className={clsx(
            'relative mx-auto',
            screenshotType === 'iphone'
              ? 'h-[400px] w-[200px] md:h-[500px] md:w-[250px]'
              : 'h-auto w-full'
          )}
        >
          {screenshots.length > 0 && (
            <Image
              src={screenshots[0]}
              alt={`${projectName} Screenshot`}
              layout="responsive"
              width={screenshotType === 'iphone' ? 250 : 800}
              height={screenshotType === 'iphone' ? 500 : 600}
              objectFit="contain"
              priority
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
