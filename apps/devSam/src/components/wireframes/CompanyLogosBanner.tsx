/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image';
import React from 'react';

import SectionContent from '@/components/sections/SectionContent';

function CollaborativeCompaniesBanner(): JSX.Element {
  return (
    <SectionContent>
    <div className="pt-8">
      <h2 className="text-center text-white text-3xl mb-8">Collaborative Companies</h2>
      <p className="text-center text-gray-300 mb-10">These are some of the distinguished companies we've had the pleasure to collaborate with.</p>
      <div className="flex justify-center space-x-12">
        <div className="w-32 h-32 relative bg-white p-4 rounded-md shadow-lg">
          <Image src="/assets/empresas/logo-lemu-2021.webp" alt="Lemu Logo 2021" layout="fill" objectFit="contain" />
        </div>
        <div className="w-32 h-32 relative bg-white p-4 rounded-md shadow-lg">
          <Image src="/assets/empresas/grupo-kc-logo.jpeg" alt="Grupo KC Logo" layout="fill" objectFit="contain" />
        </div>
        <div className="w-32 h-32 relative bg-white p-4 rounded-md shadow-lg">
          <Image src="/assets/empresas/ensamble-logo.png" alt="Ensamble Logo" layout="fill" objectFit="contain" />
        </div>
      </div>
    </div>
    </SectionContent>
  );
}

export default CollaborativeCompaniesBanner;
