type ProjectType = {
  projectName: string;
  company: string;
  description?: string; 
  iphoneScreenshots?: string[] | null;
  macScreenshots?: string[] | null;
  iconPath?: string;
  technologies?: string[];
};

const projectsData: ProjectType[] = [
  {
    projectName: 'Github Search',
    company: 'Personal',
    description: 'Github Search is a web application built with React, Next.js, and TypeScript, designed to interact with the GitHub API for searching users and repositories. This project showcases proficiency in API integration and state management, allowing users to search for GitHub profiles, view repository details, and navigate through search results efficiently. Github Search also demonstrates a strong focus on UI responsiveness and accessibility, ensuring a seamless user experience across different devices.',
    iconPath: '/public/assets/superman.ico',
    macScreenshots: [
      '/assets/projects/personal/github-search/home.png',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'GitHub API'],
  },
  {
    projectName: 'Cinemapedia',
    company: 'Personal',
    description: 'Cinemapedia is a movie and series directory application developed with React, Next.js, and Tailwind CSS, designed to enhance content discovery. By leveraging dynamic routing and server-side rendering, this app provides users with detailed information on movies and TV shows, including personalized recommendations. Cinemapedia focuses on providing a smooth, visually appealing user experience, with efficient data fetching and real-time search capabilities that make browsing enjoyable and engaging.',
    iconPath: '/assets/superman.ico',
    iphoneScreenshots: [
      '/assets/projects/personal/cinemapedia/1.png',
    ],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Dynamic Routing', 'Server-Side Rendering'],
  },
  {
    projectName: 'DashBoard Next14',
    company: 'Personal',
    description:'DashBoard Next14 is a practice project utilizing Next.js 14 to build a fully interactive and responsive dashboard interface. This tutorial project demonstrates best practices in component-driven development, data fetching, and server-side rendering, offering an insight into how modern dashboards are created. It incorporates state management and dynamic updates, providing a foundation for building scalable data-driven applications in a professional environment.',
    iconPath: '/assets/superman.ico',
    macScreenshots: [
      '/assets/projects/personal/Admin Dashboard/dashboard.png',
    ],
    technologies: ['Next.js 14', 'React', 'TypeScript', 'Server-Side Rendering', 'State Management'],
  },
  {
    projectName: 'Vacunas',
    company: 'Ensamble',
    description:'Vacunas is a user-facing registration platform built with Next.js, React, and Tailwind CSS, designed to simplify the vaccination appointment process. Users can register for vaccines, select preferred locations, schedule dates, and add family members for group appointments. With form handling through Formik and Yup for validation, as well as smooth transitions enabled by Framer Motion, Vacunas offers a secure, responsive, and user-friendly experience. It also integrates with @vercel/postgres to manage data efficiently.',
    iconPath: '/assets/empresas/ensamble-logo.png',
    macScreenshots: [
      '/assets/projects/ensamble/covid/cards.png',
    ],
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Formik', 'Yup', 'Framer Motion', '@vercel/postgres'],
  },
  {
    projectName: 'Admin Vacunas',
    company: 'Ensamble',
    description:'Admin Vacunas is an administrative dashboard developed using Next.js, React, and NextUI, tailored to manage vaccination data across multiple locations. This platform allows administrators to monitor user registrations, manage dose allocation, and schedule appointments by site. It includes features for secure data handling, role-based access, and data export using xlsx. By leveraging Tailwind CSS for responsive design and next-auth for authentication, Admin Vacunas ensures a streamlined and secure workflow for managing high-volume vaccination logistics.',
    iconPath: '/assets/empresas/ensamble-logo.png',
    macScreenshots: [
      '/assets/projects/ensamble/vacuna/modal.png',
    ],
    technologies: ['Next.js', 'React', 'NextUI', 'Tailwind CSS', 'next-auth', 'xlsx'],
  },
  {
    projectName: 'Red Medica',
    company: 'Ensamble',
    description:'Red Medica is a cross-platform medical directory app built with Flutter and Riverpod, designed to facilitate the search and localization of healthcare providers across Mexico. The app integrates Google Maps for navigation and uses Flutter Map for rendering detailed location data. With advanced search capabilities powered by Dio and state management handled by Riverpod, Red Medica delivers a seamless user experience. The application also supports responsive design and utilizes Flutter Native Splash for a polished look on both iOS and Android platforms.',
    iconPath: '/assets/empresas/ensamble-logo.png',
    iphoneScreenshots: [
      '/assets/projects/ensamble/medica/inicio.jpeg',
    ],
    technologies: ['Flutter', 'Riverpod', 'Google Maps API', 'Flutter Map', 'Dio', 'Flutter Native Splash'],
  },
  {
    projectName: 'SegunNet',
    company: 'Ensamble',
    description:'SegunNet is a ticket management platform for customer support, built with React and Node.js. The app allows users to create, view, and manage support tickets in a centralized system. Designed with a responsive UI and efficient state management, SegunNet provides a seamless experience for tracking issues from creation to resolution. The backend, implemented in Node.js, ensures data consistency and reliability, supporting various ticket statuses and priority levels to streamline customer service workflows.',
    iconPath: '/assets/empresas/ensamble-logo.png',
    macScreenshots: [
      '/assets/projects/ensamble/segunet/home.png',
    ],
    technologies: ['React', 'Node.js'],
  },
  {
    projectName: 'Bi',
    company: 'KC',
    description:'Bi is a business intelligence platform built with Next.js, React, and Tailwind CSS, designed to integrate seamlessly with Power BI for advanced data visualization. The platform allows users to generate interactive charts using echarts-for-react and export reports in PDF or Excel formats through jspdf and xlsx. With responsive design and efficient state management, Bi provides a streamlined experience for querying and analyzing critical business data. Authentication and secure access are handled using NextAuth, ensuring data confidentiality and reliability.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: [
      '/assets/projects/kc/bi/chart.png',
    ],
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Power BI', 'echarts-for-react', 'jspdf', 'xlsx', 'NextAuth'],
  },
  {
    projectName: 'CRM',
    company: 'KC',
    description:'This CRM platform is developed with React and a custom API to manage client relationships effectively. It offers features such as lead tracking, client communication, and data management in a streamlined interface. By implementing modular components and efficient state management, the CRM provides a smooth and responsive user experience. It supports role-based access and real-time notifications, making it a robust solution for sales and support teams to improve customer interactions.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: [
      '/assets/projects/kc/crm/crm-notification.png',
    ],
    technologies: ['React', 'Custom API'],
  },
  {
    projectName: 'EoS',
    company: 'KC',
    description:'EoS is an information and resource management app specifically built for insurance agents and promoters, utilizing the Ionic Framework and Angular for a seamless cross-platform experience on iOS and Android. The app offers agents access to essential data on their performance, bonuses, and other metrics, presented through interactive charts powered by Chart.js. EoS also features real-time updates via ngx-socket-io, ensuring that users are always up-to-date with the latest information.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    iphoneScreenshots: [
      '/assets/projects/kc/eos/login.png',
    ],
    technologies: ['Ionic Framework', 'Angular', 'Chart.js', 'ngx-socket-io'],
  },
  {
    projectName: 'Titan',
    company: 'KC',
    description:'Titan is a modular platform integrating an agent dashboard and a help desk module. Built with Next.js, React, and TypeScript, it provides tools for ticket management, performance tracking, and real-time collaboration. Featuring data visualization with ApexCharts, responsive UI with Chakra UI, and advanced file handling with xlsx, Titan streamlines operations for insurance agents and support teams.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: [
      '/assets/projects/kc/titan/login.png',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'ApexCharts', 'Chakra UI', 'xlsx'],
  },
  {
    projectName: 'Atlas de la Biodiversidad',
    company: 'LEMU',
    description:'Developed by Lemu, the Atlas of Biodiversity is a cross-platform app using Flutter, Firebase, and mapping technologies, providing the worlds first comprehensive atlas of the biosphere. The app is designed to raise environmental awareness by offering users access to rich biodiversity data and ecological insights. This platform integrates geolocation features and real-time data updates, allowing users to explore the planets biodiversity and gain insights into efforts for environmental preservation.',
    iconPath: '/assets/empresas/logo-lemu-2021.webp',
    iphoneScreenshots: [
      '/assets/projects/lemu/1.png',
    ],
    technologies: ['Flutter', 'Firebase', 'Google Maps API', 'Geolocation', 'Real-time Data'],
  },
  {
    projectName: 'Maximus',
    company: 'KC',
    description:'Maximus is a data dashboard built with Next.js, React, and TypeScript, specifically designed for tracking and analyzing agent performance across different regions. The platform incorporates interactive charts and visualizations using react-chartjs-2 and ApexCharts, providing insights into key performance metrics and yearly goals. Maximus supports secure data export to Excel, role-based access, and real-time data updates, making it an essential tool for regional managers and promoters to monitor targets, optimize performance, and achieve strategic objectives.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: [
      '/assets/projects/kc/maximus/dashboard.png',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'react-chartjs-2', 'ApexCharts', 'xlsx'],
  },
];

export default projectsData;
