type ProjectType = {
  projectName: string;
  company: string;
  iphoneScreenshots?: string[] | null;
  macScreenshots?: string[] | null;
};


const projectsData: ProjectType[] = [
  {
    projectName: 'Atlas de la Biodiversidad',
    company: 'LEMU',
    iphoneScreenshots: [
      '/assets/projects/lemu/Screenshot 2023-10-27 at 9.21.05 a.m..png',
      '/assets/projects/lemu/Screenshot 2023-10-27 at 9.21.41 a.m..png',
    ],
  },
  {
    projectName: 'CRM',
    company: 'KC',
    macScreenshots: [
      '/assets/projects/kc/crm-login.png',
      '/assets/projects/kc/crm-home.png',
      '/assets/projects/kc/crm-cartera.png',
      '/assets/projects/kc/crm-tickets.png',

    ],
  },
  // ... añade tantos proyectos como quieras.
];

export default projectsData;
