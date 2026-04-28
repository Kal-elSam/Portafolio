type ProjectType = {
  projectName: string;
  company: string;
  description?: string;
  role?: string;
  impact?: string;
  iphoneScreenshots?: string[] | null;
  macScreenshots?: string[] | null;
  iconPath?: string;
  technologies?: string[];
  link?: string;
};

const projectsData: ProjectType[] = [
  {
    projectName: 'AI Lead Qualification Platform',
    company: 'Kairo Systems',
    role: 'Founder · Software Engineer · AI Systems',
    impact:
      'Built AI-powered workflows for lead qualification and scheduling, reducing response time by ~50% and improving lead-to-booking conversion by ~25%.',
    description:
      'Kairo Systems is my AI-driven product company focused on automating customer communication and operational workflows. I designed and implemented a full platform that connects LLM workflows with WhatsApp, Meta, and Google Calendar, using state-machine orchestration to keep asynchronous conversations consistent. The system includes internal dashboards, scheduling flows, and deployment infrastructure built for real production usage.',
    link: 'https://www.kairosystems.dev/',
    iconPath: '/assets/empresas/kairo-systems.png',
    technologies: [
      'Next.js',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'LLM Function Calling',
      'WhatsApp API',
      'Meta API',
      'Google Calendar API',
      'Vercel',
      'Railway',
    ],
  },
  {
    projectName: 'GitHub Search',
    company: 'Personal',
    description:
      'GitHub Search is a web application developed using React, Next.js, and TypeScript, designed to interact with the GitHub API for searching users and repositories. This project demonstrates proficiency in API integration and state management, allowing users to search for GitHub profiles, view repository details, and navigate through search results efficiently. Additionally, GitHub Search emphasizes UI responsiveness and accessibility, ensuring a seamless user experience across various devices.',
    link: 'https://github-search-app-nu.vercel.app/',
    iconPath: '/assets/superman.ico',
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
    iconPath: '/assets/superman.ico',
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
      'Sharp',
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
    projectName: 'NEXUS / Riesgos Amparados',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Built a dark-theme sales enablement platform and related operational views for agent activation, support workflows, and opportunity management.',
    description:
      'NEXUS is a commercial platform for Grupo KC focused on activating a second source of income for agents through guided operational flows and centralized business tools. The experience spans brand-facing landing screens, login, and internal modules for commercial enablement and emission/service processes.',
    link: 'https://nexus.grupokc.com.mx/',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/current/nexus-panel.png'],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Enterprise Dashboard UI',
      'Authentication Flows',
    ],
  },
  {
    projectName: 'Solcrédito Autos',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Delivered a conversion-oriented insurance quotation flow optimized for lead capture and self-service from the public web.',
    description:
      'Solcrédito Autos is a public insurance landing and quotation flow focused on auto policies. The interface combines a marketing-first hero section with a lightweight multi-step quote experience designed to reduce friction and improve acquisition.',
    link: 'https://www.solcreditoautos.com/',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/current/solcredito-autos.png'],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Lead Generation UX',
      'Responsive Web Design',
    ],
  },
  {
    projectName: 'Seguros KC',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Built a clearer public-facing product discovery and quotation interface for multiple insurance offerings and agent access points.',
    description:
      'Seguros KC is a public insurance site that presents multiple policy categories, value propositions, and direct entry points for prospects and agents. It is designed to simplify discovery while supporting a cleaner quoting journey.',
    link: 'https://www.seguroskc.com/',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/current/seguros-kc.png'],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Public Marketing Site',
      'Component-Based UI',
    ],
  },
  {
    projectName: 'Grupo KC Corporate Site',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Supported the modernization of Grupo KC’s public digital presence with a more polished hero experience and clearer navigation for corporate visitors.',
    description:
      'This corporate website presents Grupo KC’s brand, recruitment messaging, insurance offerings, and institutional information. The focus was on modernizing the visual experience while keeping the site approachable for broad public audiences.',
    link: 'https://www2.grupokc.com.mx/',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/current/grupo-kc-site.png'],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Marketing Website',
      'Responsive Layouts',
    ],
  },
  {
    projectName: 'CRM Comercial',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Built a CRM experience for sales visibility, qualified opportunities, pipeline tracking, and day-to-day task execution.',
    description:
      'CRM Comercial centralizes leads, opportunities, conversion metrics, and commercial activities for Grupo KC teams. The platform is designed to help agents and internal teams track pipeline health, prioritize work, and act on qualified opportunities from a unified dashboard.',
    link: 'https://crm.grupokc.com.mx/auth',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/current/crm-web.png'],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Dashboard UI',
      'Pipeline Management',
      'Business Metrics',
    ],
  },
  {
    projectName: 'CRM Mobile',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Extended the CRM ecosystem into a mobile-first experience tailored for agents working on the move.',
    description:
      'CRM Mobile translates Grupo KC’s commercial workflows into a compact mobile interface focused on cartera opportunities, prospecting, indicators, and generated tasks. It prioritizes fast access and operational clarity for field usage.',
    link: 'https://crm-m.vercel.app/',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    iphoneScreenshots: ['/assets/projects/kc/current/crm-mobile.png'],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Mobile-First UI',
      'Operational Workflows',
    ],
  },
  {
    projectName: 'Maximus',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Created a data-heavy performance dashboard for promotories and agents with ranking, goals, growth, and sales mix visibility.',
    description:
      'Maximus is an internal performance and analytics platform used to monitor annual goals, sales mix, ranking, and growth across teams and promotories. It turns complex commercial data into accessible visual reporting for decision-making.',
    link: 'https://maximus.grupokc.com.mx/auth',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/current/maximus-dashboard.png'],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Charts & Reporting',
      'Business Intelligence UI',
    ],
  },
  {
    projectName: 'Titan',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Delivered internal modules for indicators, account status, persistence, emission and services, and operational agent support.',
    description:
      'Titan is an internal operational platform that consolidates indicators, account information, persistence metrics, and administrative modules for Grupo KC agents and internal users. It supports detailed data review and day-to-day follow-up across insurance processes.',
    link: 'https://titan.grupokc.com.mx/auth',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/current/titan-indicators.png'],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Internal Tooling',
      'Tabular Data UI',
      'Operational Dashboards',
    ],
  },
  {
    projectName: 'Portal BI',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Built data visualization workflows for commercial analysis with exports, dashboards, and decision-support views for business teams.',
    description:
      'Portal BI is a business intelligence interface for Grupo KC that centralizes charts, operational metrics, and commercial insights. It was designed to make reporting easier to consume for internal users and decision-makers.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/bi/chart.png'],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Power BI',
      'Charts & Reports',
      'xlsx',
    ],
  },
  {
    projectName: 'EoS Mobile',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Extended performance, bonus, and indicator visibility into a mobile experience for agents and promoters.',
    description:
      'EoS Mobile is a cross-platform experience that gives agents and promoters access to key information such as performance, bonuses, and operational dashboards from mobile devices.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    iphoneScreenshots: ['/assets/projects/kc/eos/login.png'],
    technologies: [
      'Ionic Framework',
      'Angular',
      'Chart.js',
      'Mobile Dashboards',
    ],
  },
  {
    projectName: 'Card Tu Agente',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Delivered a digital profile and quotation entrypoint for agents with stronger self-presentation and contact conversion paths.',
    description:
      'Card Tu Agente is a personalized digital card and quotation entrypoint for insurance agents, connecting profile information, communication channels, and product access in a responsive format.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    iphoneScreenshots: ['/assets/projects/kc/cardAgente/card.png'],
    technologies: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Zustand',
      'Responsive UI',
    ],
  },
  {
    projectName: 'Batalla vs Thanos',
    company: 'KC',
    role: 'Frontend Engineer',
    impact:
      'Created a gamified internal experience to motivate commercial teams around short-term sales goals and progress visibility.',
    description:
      'Batalla vs Thanos is a themed motivational platform used to drive sales engagement through a more playful progress-tracking experience tied to campaign objectives.',
    iconPath: '/assets/empresas/grupo-kc-logo.jpeg',
    macScreenshots: ['/assets/projects/kc/thanos/battle.png'],
    technologies: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'Gamified UI',
      'Campaign Tracking',
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
    projectName: 'Volaris Analytics',
    company: 'Lumston',
    role: 'Senior Frontend Engineer',
    impact:
      'Improved real-time dashboard usability through stronger role management, authentication flows, and data visualization UX.',
    description:
      'Business Intelligence platform developed for Volaris providing real-time data analysis and interactive dashboard management. Integrates Power BI for advanced visualizations, authentication system with AWS Cognito and Azure AD, granular role management, and dashboard categorization by business areas. The application offers a modern user experience with dark/light mode, real-time notifications, and responsive design.',
    iconPath: '/assets/empresas/lumston_logo.jpeg',
    macScreenshots: ['/assets/projects/lumston/volaris/volarislog.png'],
    technologies: [
      'React 18',
      'TypeScript',
      'Vite',
      'Material-UI (MUI)',
      'Tailwind CSS',
      'Redux Toolkit',
      'Power BI Client',
      'AWS Cognito',
      'Azure AD',
      'Framer Motion',
      'React Hook Form',
      'Zod',
      'i18next',
      'Vitest',
      'React Testing Library',
    ],
  },
  {
    projectName: 'Acolyte Health',
    company: 'Lumston',
    role: 'Senior Frontend Engineer',
    impact:
      'Delivered product-facing features in a complex SaaS environment combining personalization, media workflows, and multi-tenant UX.',
    description:
      'Advanced SaaS platform for interactive video marketing that enables companies to create, manage, and distribute personalized video campaigns with digital avatars and interactive content. Features include video campaign management, digital avatar integration with D-ID, interactive surveys, landing page builder, and advanced video studio with Remotion. The platform supports real-time chat capabilities, multi-tenant architecture, and provides immersive experiences for marketing, training, and corporate communication.',
    iconPath: '/assets/empresas/lumston_logo.jpeg',
    macScreenshots: ['/assets/projects/lumston/acolyte/acolytelog.png'],
    technologies: [
      'Next.js 15',
      'React 18',
      'TypeScript',
      'Material-UI (MUI)',
      'Ant Design',
      'Tailwind CSS',
      'TanStack React Query',
      'React Hook Form',
      'Zod',
      'AWS Amplify',
      'AWS Cognito',
      'Remotion',
      'D-ID Client SDK',
      'React Konva',
      'Jest',
      'Styled Components',
      'Emotion',
    ],
  },
];

export default projectsData;
