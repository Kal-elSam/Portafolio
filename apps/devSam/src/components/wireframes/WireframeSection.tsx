import React from 'react';

import projectsData from '@/contents/projects/proyects';

import { IphoneShowcase, MacShowcase } from './DeviceShowcase';

function WireframeSection() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-6">
      {projectsData.map((project) => (
        <div
          key={`${project.projectName}-${project.company}`}
          className="w-full md:w-1/2 lg:w-1/3"
        >
          <h3 className="mb-4 text-xl">
            {project.projectName} - {project.company}
          </h3>
          <div className="flex gap-6 justify-center">
            {project.iphoneScreenshots ? (
              <div>
                <IphoneShowcase screenshots={project.iphoneScreenshots} />
              </div>
            ) : (
              <div style={{ width: 'fit-content' }} />  // Espacio reservado en caso de que no haya vista iPhone
            )}

            {project.macScreenshots ? (
              <div>
                <MacShowcase screenshots={project.macScreenshots} />
              </div>
            ) : (
              <div style={{ width: 'fit-content' }} />  // Espacio reservado en caso de que no haya vista Web
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


export default WireframeSection;
