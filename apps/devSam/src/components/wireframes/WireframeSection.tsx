import React from 'react';

import { IphoneShowcase,MacShowcase } from './DeviceShowcase'

function WireframeSection() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
            <div className="w-full md:w-1/2 lg:w-1/3">
                <h3 className="text-xl mb-4">Vista iPhone</h3>
                <IphoneShowcase />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3">
                <h3 className="text-xl mb-4">Vista Web</h3>
                <MacShowcase />
            </div>
        </div>
    );
}

export default WireframeSection;
