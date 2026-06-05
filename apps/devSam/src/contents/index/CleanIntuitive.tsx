import clsx from 'clsx';
import { useState } from 'react';

import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
import SectionTitle from '@/components/sections/SectionTitle';

import ProductDeliveryPanel, {
  deliveryPhases,
} from '@/contents/index/ProductDeliveryPanel';

import type { DeliveryPhaseId } from '@/contents/index/ProductDeliveryPanel';

function CleanIntuitive() {
  const [activePhaseId, setActivePhaseId] =
    useState<DeliveryPhaseId>('scope');

  return (
    <>
      <header className={clsx('mb-8')}>
        <SectionTitle
          title="From Scope to Shipped Systems."
          caption="Product Engineering"
          description="I build product systems end-to-end — scope, architecture, integrations, and production delivery — not isolated UI layers."
        />
      </header>
      <SectionContent>
        <div className={clsx('flex flex-col gap-8', 'lg:flex-row lg:gap-12')}>
          <div className={clsx('flex flex-col gap-3', 'lg:max-w-[22rem]')}>
            <div
              className={clsx(
                'flex gap-2 overflow-x-auto pb-1',
                'lg:flex-col lg:overflow-visible'
              )}
            >
              {deliveryPhases.map((phase, index) => (
                <SectionButton
                  key={phase.id}
                  title={phase.title}
                  description={phase.summary}
                  icon={index + 1}
                  active={activePhaseId === phase.id}
                  onClick={() => setActivePhaseId(phase.id)}
                />
              ))}
            </div>
          </div>

          <div
            className={clsx(
              'flex flex-1 items-start justify-center',
              'lg:justify-end'
            )}
          >
            <ProductDeliveryPanel phaseId={activePhaseId} />
          </div>
        </div>
      </SectionContent>
    </>
  );
}

export default CleanIntuitive;
