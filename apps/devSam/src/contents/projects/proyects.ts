type ProjectType = {
  projectName: string;
  company: string;
  iphoneScreenshots?: string[] | null;
  macScreenshots?: string[] | null;
};


const projectsData: ProjectType[] = [
  {
    projectName: 'Cinemapedia',
    company: 'Personal',
    iphoneScreenshots: [
      '/assets/projects/personal/cinemapedia/1.png',
      '/assets/projects/personal/cinemapedia/2.png',
      '/assets/projects/personal/cinemapedia/3.png',
      '/assets/projects/personal/cinemapedia/4.png',
      '/assets/projects/personal/cinemapedia/5.png',
      '/assets/projects/personal/cinemapedia/6.png',

    ],
  },
  {
    projectName: 'Red Medica',
    company: 'Ensamble',
    iphoneScreenshots: [
      '/assets/projects/ensamble/medica/inicio.jpeg',
      '/assets/projects/ensamble/medica/categoria.jpeg',
      '/assets/projects/ensamble/medica/home.jpeg',
      '/assets/projects/ensamble/medica/home2.jpeg',
      '/assets/projects/ensamble/medica/home3.jpeg',
      '/assets/projects/ensamble/medica/mapa.jpeg',
    ],
  },
  {
    projectName: 'SegunNet',
    company: 'Ensamble',
    macScreenshots: [
      '/assets/projects/ensamble/segunet/login.png',
      '/assets/projects/ensamble/segunet/home.png',
      '/assets/projects/ensamble/segunet/new.png',
      '/assets/projects/ensamble/segunet/bitacora.png',
    ],
  },
  {
    projectName: 'Bi',
    company: 'KC',
    macScreenshots: [
      '/assets/projects/kc/bi/login.png',
      '/assets/projects/kc/bi/home.png',
      '/assets/projects/kc/bi/h01.png',
      '/assets/projects/kc/bi/mesa.png',
      '/assets/projects/kc/bi/chart.png',
    ],
  },
  {
    projectName: 'CRM',
    company: 'KC',
    macScreenshots: [
      '/assets/projects/kc/crm/crm-login.png',
      '/assets/projects/kc/crm/crm-home.png',
      '/assets/projects/kc/crm/crm-cartera.png',
      '/assets/projects/kc/crm/crm-tickets.png',
    ],
  },
  {
    projectName: 'EoS',
    company: 'KC',
    iphoneScreenshots: [
      '/assets/projects/kc/eos/login.png',
      '/assets/projects/kc/eos/home.png',
    ],
  },
  {
    projectName: 'Titan',
    company: 'KC',
    macScreenshots: [
      '/assets/projects/kc/titan/login.png',
      '/assets/projects/kc/titan/home.png',
    ],
  },
  {
    projectName: 'Atlas de la Biodiversidad',
    company: 'LEMU',
    iphoneScreenshots: [
      '/assets/projects/lemu/1.png',
      '/assets/projects/lemu/2.png',
      '/assets/projects/lemu/3.png',
      '/assets/projects/lemu/4.png',
    ],
  },
];

export default projectsData;
