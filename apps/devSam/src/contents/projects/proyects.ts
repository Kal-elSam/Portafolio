type ProjectType = {
  projectName: string;
  company: string;
  description?: string;
  iphoneScreenshots?: string[] | null;
  macScreenshots?: string[] | null;
  iconPath?: string;
  technologies?: string[];
  link?: string;
};

const projectsData: ProjectType[] = [
  {
    projectName: 'GitHub Search',
    company: 'Personal',
    description:
      'GitHub Search is a web application developed using React, Next.js, and TypeScript, designed to interact with the GitHub API for searching users and repositories. This project demonstrates proficiency in API integration and state management, allowing users to search for GitHub profiles, view repository details, and navigate through search results efficiently. Additionally, GitHub Search emphasizes UI responsiveness and accessibility, ensuring a seamless user experience across various devices.',
      link: 'https://github-search-app-nu.vercel.app/',
    iconPath: '/public/assets/superman.ico',
    macScreenshots: ['/assets/projects/personal/github-search/home.png'],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'GitHub API',
      '@nextui-org/react',
      'Axios',
      'Framer Motion',
      'React Icons',
      'Tailwind CSS',
    ],
  },
  {
    projectName: 'CVA Church Page',
    company: 'Personal',
    description:
    'CVA Church Page is a modern and responsive web application developed using Astro.js, TailwindCSS, and TypeScript. This project serves as an official platform for CVA church, providing information about the church, events, and ministries. It leverages SEO best practices and performance optimizations to ensure quick loading times and high visibility on search engines. The application includes features like RSS feeds, a sitemap, and analytics integration for effective content management and monitoring.',
    link: 'https://cva-page.vercel.app/',
    iconPath: '/public/assets/superman.ico',
    macScreenshots: ['/assets/projects/personal/cva/home.png'],
    technologies: [
      'Astro.js',
      'TailwindCSS',
      'TypeScript',
      '@astrojs/rss',
      '@astrojs/sitemap',
      '@astrolib/analytics',
      '@astrolib/seo',
      'Prettier',
      'Lodash',
      'Sharp'
    ],
  },
  {
    projectName: 'Cinemapedia',
    company: 'Personal',
    description:
      'Cinemapedia is a comprehensive movie and series directory application developed using Flutter. It leverages the TMDB API to provide users with detailed information on a vast array of films and TV shows. The application emphasizes a smooth and visually appealing user experience, incorporating features such as dynamic routing, efficient data fetching, and real-time search capabilities. Cinemapedia also offers personalized recommendations, enhancing content discovery and user engagement.',
    iconPath: '/assets/superman.ico',
    iphoneScreenshots: ['/assets/projects/personal/cinemapedia/1.png'],
    technologies: [
      'Flutter',
      'Dart',
      'TMDB API',
      'Riverpod',
      'Isar',
      'GoRouter',
      'Dio',
      'Flutter Dotenv',
      'Flutter Staggered Grid View',
      'YouTube Player Flutter',
    ],
  },
  {
    projectName: 'DashBoard Next14',
    company: 'Personal',
    description:
      'DashBoard Next14 is a practice project developed to explore the capabilities of Next.js 14 in building fully interactive and responsive dashboard interfaces. This project adheres to best practices in component-driven development, data fetching, and server-side rendering, providing insights into modern dashboard creation. It incorporates state management and dynamic updates, serving as a foundation for building scalable, data-driven applications in a professional environment.',
    iconPath: '/assets/superman.ico',
    macScreenshots: ['/assets/projects/personal/Admin Dashboard/dashboard.png'],
    technologies: [
      'Next.js 14',
      'React',
      'TypeScript',
      'Server-Side Rendering',
      'State Management',
      'Tailwind CSS',
      'NextAuth.js',
      'Zod',
      'PostgreSQL',
    ],
  },
  {
    projectName: 'Vacunas',
    company: 'Ensamble',
    description:
      'Vacunas is a user-centric registration platform developed with Next.js, React, and Tailwind CSS, aimed at streamlining the vaccination appointment process. Users can register for vaccines, choose preferred locations, schedule dates, and add family members for group appointments. The platform employs Formik for form handling and Yup for validation, ensuring data integrity. Framer Motion enhances user experience with smooth transitions. Data management is efficiently handled through integration with @vercel/postgres. This project was developed for a leading global financial institution with a significant presence in Mexico, employing approximately 17,000 individuals and serving around 4.9 million customers. The platform was designed to meet the high standards of security and user experience expected by such a prominent organization.',
    iconPath: '/assets/empresas/ensamble-logo.png',
    macScreenshots: ['/assets/projects/ensamble/covid/cards.png'],
    technologies: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'Formik',
      'Yup',
      'Framer Motion',
      '@vercel/postgres',
    ],
  },
  {
    projectName: 'Admin Vacunas',
    company: 'Ensamble',
    description:
      'Admin Vacunas is an administrative dashboard developed using Next.js, React, and NextUI, designed to manage vaccination data across multiple locations. This platform enables administrators to monitor user registrations, manage dose allocations, and schedule appointments by site. It features secure data handling, role-based access control, and data export capabilities using xlsx. By leveraging Tailwind CSS for responsive design and next-auth for authentication, Admin Vacunas ensures a streamlined and secure workflow for managing high-volume vaccination logistics. This project was developed for a leading global financial institution with a significant presence in Mexico, employing approximately 17,000 individuals and serving around 4.9 million customers. The platform was designed to meet the high standards of security and user experience expected by such a prominent organization.',
    iconPath: '/assets/empresas/ensamble-logo.png',
    macScreenshots: ['/assets/projects/ensamble/vacuna/modal.png'],
    technologies: [
      'Next.js',
      'React',
      'NextUI',
      'Tailwind CSS',
      'next-auth',
      'xlsx',
    ],
  },
  {
    projectName: 'Red Médica',
    company: 'Ensamble',
    description:
      'Red Médica is a cross-platform medical directory application developed using Flutter and Riverpod, aimed at facilitating the search and localization of healthcare providers throughout Mexico. The app integrates Google Maps for navigation and utilizes Flutter Map for rendering detailed location data. Advanced search capabilities are powered by Dio, with state management handled by Riverpod, ensuring a seamless user experience. The application supports responsive design and employs Flutter Native Splash for a polished appearance on both iOS and Android platforms. This project was developed for a prominent financial institution in Mexico, known for its extensive workforce and large customer base, to enhance healthcare accessibility for its employees and clients.',
    iconPath: '/assets/empresas/ensamble-logo.png',
    iphoneScreenshots: ['/assets/projects/ensamble/medica/inicio.jpeg'],
    technologies: [
      'Flutter',
      'Riverpod',
      'Google Maps API',
      'Flutter Map',
      'Dio',
      'Flutter Native Splash',
    ],
  },
  {
    projectName: 'SegunNet',
    company: 'Ensamble',
    description:
      'SegunNet is a ticket management platform for customer support, built with React and Node.js. The app allows users to create, view, and manage support tickets in a centralized system. Designed with a responsive UI and efficient state management, SegunNet provides a seamless experience for tracking issues from creation to resolution. The backend, implemented in Node.js, ensures data consistency and reliability, supporting various ticket statuses and priority levels to streamline customer service workflows.',
    iconPath: '/assets/empresas/ensamble-logo.png',
    macScreenshots: ['/assets/projects/ensamble/segunet/home.png'],
    technologies: ['React', 'Node.js'],
  },
  {
    "projectName": "Batalla vs Thanos",
    "company": "KC",
    "description": "Batalla vs Thanos is a gamified platform developed for Grupo KC to motivate sales teams to achieve their bi-monthly sales goals through an epic battle-themed experience. Built with Next.js, React, and Tailwind CSS, the platform integrates SQL databases for robust data management, including custom tables, views, and stored procedures (SPs). API connections were implemented to ensure seamless data flow and real-time tracking. The application emphasizes responsive design and accessibility while leveraging Radix UI for interactive components and crypto-js for secure handling of sensitive information. Despite no data persistence for the competition, the platform delivers a visually appealing and efficient solution for monitoring team progress and results in a competitive and engaging environment.",
    "iconPath": "/assets/empresas/grupo-kc-logo.jpeg",
    "macScreenshots": [
      "/assets/projects/kc/thanos/battle.png"
    ],
    "technologies": [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Radix UI",
      "crypto-js",
      "clsx",
      "lucide-react"
    ]
  },
  {
    projectName: 'Bi',
    company: 'KC',
    description:
      'Bi is a business intelligence platform developed for Grupo KC, a leading insurance agency in Mexico with over 1,200 agents and 166 collaborators. Built with Next.js, React, and Tailwind CSS, Bi integrates seamlessly with Power BI to deliver advanced data visualization capabilities. Users can generate interactive charts using echarts-for-react and export reports in PDF or Excel formats through jspdf and xlsx. The platform emphasizes responsive design and efficient state management, providing a streamlined experience for querying and analyzing critical business data. Authentication and secure access are managed using NextAuth, ensuring data confidentiality and reliability.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/bi/chart.png'],
    technologies: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'Power BI',
      'echarts-for-react',
      'jspdf',
      'xlsx',
      'NextAuth',
    ],
  },
  {
    projectName: 'CRM',
    company: 'KC',
    description:
      'The CRM platform is a comprehensive client relationship management system developed for Grupo KC, a leading insurance agency in Mexico with over 1,200 agents and 166 collaborators. Built with React and a custom API, the platform offers features such as lead tracking, client communication, and data management within a streamlined interface. By implementing modular components and efficient state management, the CRM provides a smooth and responsive user experience. It supports role-based access and real-time notifications, making it a robust solution for sales and support teams to enhance customer interactions and improve operational efficiency.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/crm/crm-notification.png'],
    technologies: ['React', 'Custom API'],
  },
  {
    projectName: 'EoS',
    company: 'KC',
    description:
      'EoS is an information and resource management application developed for Grupo KC, a leading insurance agency in Mexico with over 1,200 agents and 166 employees. Built using the Ionic Framework and Angular, EoS provides a seamless cross-platform experience on iOS and Android devices. The app grants insurance agents and promoters access to essential data regarding their performance, bonuses, and other key metrics, presented through interactive charts powered by Chart.js. Additionally, EoS features real-time updates via ngx-socket-io, ensuring users are consistently informed with the latest information.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    iphoneScreenshots: ['/assets/projects/kc/eos/login.png'],
    technologies: ['Ionic Framework', 'Angular', 'Chart.js', 'ngx-socket-io'],
  },
  {
    projectName: 'Titan',
    company: 'KC',
    description:
      'Titan is a modular platform developed for Grupo KC, a leading insurance agency in Mexico with over 1,200 agents and 166 collaborators. The platform integrates an agent dashboard and a help desk module, offering tools for ticket management, performance tracking, and real-time collaboration. Built with Next.js, React, and TypeScript, Titan features advanced data visualization using ApexCharts, a responsive UI designed with Chakra UI, and efficient file handling with xlsx. This platform streamlines operations for insurance agents and support teams, enhancing productivity and collaboration.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/titan/login.png'],
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'ApexCharts',
      'Chakra UI',
      'xlsx',
    ],
  },
  {
    projectName: 'Atlas de la Biodiversidad',
    company: 'LEMU',
    description:
      'Developed by Lemu, the Atlas of Biodiversity is a cross-platform app using Flutter, Firebase, and mapping technologies, providing the worlds first comprehensive atlas of the biosphere. The app is designed to raise environmental awareness by offering users access to rich biodiversity data and ecological insights. This platform integrates geolocation features and real-time data updates, allowing users to explore the planets biodiversity and gain insights into efforts for environmental preservation.',
    iconPath: '/assets/empresas/logo-lemu-2021.webp',
    iphoneScreenshots: ['/assets/projects/lemu/1.png'],
    technologies: [
      'Flutter',
      'Firebase',
      'Google Maps API',
      'Geolocation',
      'Real-time Data',
    ],
  },
  {
    projectName: 'Maximus',
    company: 'KC',
    description:
      'Maximus is a data dashboard developed for Grupo KC, a leading insurance agency in Mexico, with the purpose of tracking and analyzing agent performance across various regions. Built with Next.js, React, and TypeScript, Maximus provides comprehensive insights into key performance metrics and yearly goals. It incorporates interactive charts and visualizations using react-chartjs-2 and ApexCharts, enabling data-driven decision-making. The platform supports secure data export to Excel, role-based access control, and real-time updates, making it an indispensable tool for regional managers and promoters to monitor targets, optimize performance, and achieve strategic objectives.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/maximus/dashboard.png'],
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'react-chartjs-2',
      'ApexCharts',
      'xlsx',
    ],
  },
];

export default projectsData;
