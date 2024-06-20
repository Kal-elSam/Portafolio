type ProjectType = {
  projectName: string;
  company: string;
  iphoneScreenshots?: string[] | null;
  macScreenshots?: string[] | null;
  iconPath?: string;
};


const projectsData: ProjectType[] = [
  {
    projectName: 'Cinemapedia',
    company: 'Personal',
    iconPath: '/assets/superman.ico',
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
    projectName: 'DashBoard Next14',
    company: 'Personal',
    iconPath: '/assets/superman.ico',
    macScreenshots: [
      '/assets/projects/personal/Admin Dashboard/dashboard.png',
      '/assets/projects/personal/Admin Dashboard/login.png',
      '/assets/projects/personal/Admin Dashboard/table.png',
      '/assets/projects/personal/Admin Dashboard/form.png',
    ],
  },
  {
    projectName: 'Vacunas',
    company: 'Ensamble',
    iconPath: '/assets/empresas/ensamble-logo.png',
    macScreenshots: [
      '/assets/projects/ensamble/covid/home.png',
      '/assets/projects/ensamble/covid/cards.png',
      '/assets/projects/ensamble/covid/cards2.png',
      '/assets/projects/ensamble/covid/confirmacion.png',
      '/assets/projects/ensamble/covid/soporte.png',
      '/assets/projects/ensamble/covid/admin.png',
      '/assets/projects/ensamble/covid/tabla1.png',
      '/assets/projects/ensamble/covid/tabla2.png',
    ],
  },
  {
    projectName: 'Admin Vacunas',
    company: 'Ensamble',
    iconPath: '/assets/empresas/ensamble-logo.png',
    macScreenshots: [
      '/assets/projects/ensamble/vacuna/login.png',
      '/assets/projects/ensamble/vacuna/home1.png',
      '/assets/projects/ensamble/vacuna/modal.png',
    ],
  },
  {
    projectName: 'Red Medica',
    company: 'Ensamble',
    iconPath: '/assets/empresas/ensamble-logo.png',
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
    iconPath: '/assets/empresas/ensamble-logo.png',
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
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: [
      '/assets/projects/kc/bi/login.png',
      '/assets/projects/kc/bi/h01.png',
      '/assets/projects/kc/bi/mesa.png',
      '/assets/projects/kc/bi/chart.png',
    ],
  },
  {
    projectName: 'CRM',
    company: 'KC',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: [
      '/assets/projects/kc/crm/crm-login.png',
      '/assets/projects/kc/crm/crm-home.png',
      '/assets/projects/kc/crm/crm-notification.png',
      '/assets/projects/kc/crm/crm-notification2.png',
      '/assets/projects/kc/crm/crm-ratios.png',
      '/assets/projects/kc/crm/crm-cartera.png',
      '/assets/projects/kc/crm/crm-tickets.png',
    ],
  },
  {
    projectName: 'EoS',
    company: 'KC',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    iphoneScreenshots: [
      '/assets/projects/kc/eos/login.png',
      '/assets/projects/kc/eos/home.png',
    ],
  },
  {
    projectName: 'Titan',
    company: 'KC',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: [
      '/assets/projects/kc/titan/login.png',
      '/assets/projects/kc/titan/home.png',
    ],
  },
  {
    projectName: 'Atlas de la Biodiversidad',
    company: 'LEMU',
    iconPath: '/assets/empresas/logo-lemu-2021.webp',
    iphoneScreenshots: [
      '/assets/projects/lemu/1.png',
      '/assets/projects/lemu/2.png',
      '/assets/projects/lemu/3.png',
      '/assets/projects/lemu/4.png',
    ],
  },
  {
    projectName: 'Maximus',
    company: 'KC',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: [
      '/assets/projects/kc/maximus/login.png',
      '/assets/projects/kc/maximus/landing.png',
      '/assets/projects/kc/maximus/dashboard.png',
      '/assets/projects/kc/maximus/home.png',
      '/assets/projects/kc/maximus/home1.png',
      '/assets/projects/kc/maximus/home2.png',
      '/assets/projects/kc/maximus/home3.png',
      '/assets/projects/kc/maximus/home4.png',
      '/assets/projects/kc/maximus/registro.png',
      '/assets/projects/kc/maximus/registro1.png',
      '/assets/projects/kc/maximus/importar.png',
    ],
  },
];

export default projectsData;
