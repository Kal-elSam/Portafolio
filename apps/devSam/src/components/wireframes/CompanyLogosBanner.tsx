/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image';

import SectionContent from '@/components/sections/SectionContent';

const companies = [
  {
    src: '/assets/empresas/kairo-systems.png',
    alt: 'Kairo Systems Logo',
  },
  {
    src: '/assets/empresas/logo-lemu-2021.webp',
    alt: 'Lemu Logo 2021',
  },
  {
    src: '/assets/empresas/grupo-kc-logo.jpeg',
    alt: 'Grupo KC Logo',
  },
  {
    src: '/assets/empresas/ensamble-logo.png',
    alt: 'Ensamble Logo',
  },
  {
    src: '/assets/empresas/lumston_logo.jpeg',
    alt: 'Lumston Logo',
  },
];

function CollaborativeCompaniesBanner(): JSX.Element {
  return (
    <SectionContent>
      <div className="pt-8">
        {/* Título */}
        <h2 className="mb-8 text-center text-3xl text-slate-800 dark:text-white">
          Collaborative Companies
        </h2>

        {/* Descripción */}
        <p className="mb-10 text-center text-slate-600 dark:text-gray-300">
          These are some of the distinguished companies we've had the pleasure
          to collaborate with.
        </p>

        {/* Logos */}
        <div className="flex flex-wrap justify-center gap-8">
          {companies.map((company) => (
            <div
              key={company.src}
              className="relative h-32 w-32 rounded-md bg-white shadow-lg dark:bg-slate-800"
            >
              <Image
                src={company.src}
                alt={company.alt}
                fill
                sizes="128px"
                className="object-contain p-4"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionContent>
  );
}

export default CollaborativeCompaniesBanner;
