/* eslint-disable react/no-unknown-property -- react-three-fiber JSX props */
import { Canvas } from '@react-three/fiber';
import {
  Bloom,
  EffectComposer,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing';
import { useEffect, useMemo, useRef, useState } from 'react';

import Assembly from './Assembly';
import Choreography from './Choreography';
import Environment from './Environment';
import { BG } from './layout';
import { createResources } from './resources';

import type { AssemblyRefs } from './Assembly';

// Crispness first: no depth of field (it softened the whole hero). The canvas is
// supersampled (at least 1.5x, so a DPR 1 screen still downsamples a sharper image),
// capped by a pixel budget on very large windows, and the composer keeps 4x MSAA.
const MIN_DPR = 1.5;
const MAX_DPR = 2;
const PIXEL_BUDGET = 3_400_000;

const pickQuality = () => {
  const area = window.innerWidth * window.innerHeight;
  const wanted = Math.max(
    MIN_DPR,
    Math.min(MAX_DPR, window.devicePixelRatio || 1)
  );
  return { dpr: Math.max(1, Math.min(wanted, Math.sqrt(PIXEL_BUDGET / area))) };
};

type Scene3DProps = {
  ready: boolean;
  onReady: () => void;
  onFail: () => void;
};

export default function Scene3D({ ready, onReady, onFail }: Scene3DProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState(pickQuality);
  const res = useMemo(() => createResources(), []);
  const refs = useMemo<AssemblyRefs>(
    () => ({ plates: [], rods: null, pads: [] }),
    []
  );

  const effects = [
    <Bloom
      key="bloom"
      intensity={0.9}
      luminanceThreshold={1.1}
      luminanceSmoothing={0.1}
      mipmapBlur
      radius={0.3}
    />,
    <Vignette key="vignette" offset={0.36} darkness={0.38} />,
    // 9 = ToneMappingMode.NEUTRAL: keeps the page background colour exact.
    <ToneMapping key="tone" mode={9 as never} />,
  ];

  useEffect(() => () => res.dispose(), [res]);
  useEffect(() => {
    const onResize = () => setQuality(pickQuality());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: ready ? 1 : 0,
        transition: 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <Canvas
        frameloop="demand"
        dpr={quality.dpr}
        shadows="percentage"
        camera={{ fov: 30, near: 1, far: 60, position: [0, 6, 14] }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            onFail();
          });
        }}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 24, 44]} />
        <Environment />

        <ambientLight intensity={0.03} />
        <directionalLight
          position={[5, 7, 4]}
          intensity={2.1}
          color="#e4ebf2"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-camera-near={1}
          shadow-camera-far={30}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
        />
        <directionalLight
          position={[-6, 2.5, -5]}
          intensity={2.6}
          color="#d9e4f2"
        />
        <directionalLight
          position={[6, 5, -6]}
          intensity={0.6}
          color="#e6eef8"
        />

        <Assembly res={res} refs={refs} />
        <Choreography
          res={res}
          refs={refs}
          wrapperRef={wrapperRef}
          onFirstFrame={onReady}
        />

        <EffectComposer multisampling={4}>{effects}</EffectComposer>
      </Canvas>
    </div>
  );
}
