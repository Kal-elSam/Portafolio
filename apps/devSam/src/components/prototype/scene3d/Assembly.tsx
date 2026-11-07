/* eslint-disable react/no-unknown-property -- react-three-fiber JSX props */
/* eslint-disable no-param-reassign -- refs are filled by callback refs on purpose */
import { createContext, useContext, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

import {
  closedY,
  CORNERS,
  PART_COUNT,
  PLATE_T,
  ROD_SITES,
  TOP,
} from './layout';

import type { Resources } from './resources';

type V3 = [number, number, number];

export type AssemblyRefs = {
  plates: (THREE.Group | null)[];
  rods: THREE.InstancedMesh | null;
  pads: (THREE.Mesh | null)[];
};

type Item = { p: V3; s?: V3; ry?: number };

function Inst({
  geometry,
  material,
  items,
  shadow = true,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  items: Item[];
  shadow?: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    items.forEach((it, k) => {
      o.position.set(...it.p);
      o.scale.set(...(it.s ?? [1, 1, 1]));
      o.rotation.set(0, it.ry ?? 0, 0);
      o.updateMatrix();
      mesh.setMatrixAt(k, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, items.length]}
      castShadow={shadow}
      receiveShadow={shadow}
    />
  );
}

const SCREWS: Item[] = CORNERS.map(([x, z]) => ({
  p: [x, TOP + 0.02, z],
  s: [1, 1, 1],
}));
/** Interposer board hangs under each plate when assembled and seats into it as the plate lifts away. */
export const PAD_REST = -PLATE_T / 2 - 0.1;
export const PAD_SEATED = -PLATE_T / 2 + 0.025;

// Joint collars on the underside: where the guide rods seat into each plate.
const COLLARS: Item[] = CORNERS.map(([x, z]) => ({
  p: [x, -PLATE_T / 2 - 0.02, z],
}));
const TICKS: Item[] = Array.from({ length: 11 }, (_, k) => ({
  p: [-1.5 + k * 0.3, TOP + 0.025, 0.25],
}));
const DASHES: Item[] = Array.from({ length: 7 }, (_, k) => ({
  p: [0.2 + k * 0.19, TOP + 0.007, -0.35],
}));

const PILLAR_X = [-1.2, -0.6, 0, 0.6, 1.2];
const PILLAR_H = [0.22, 0.41, 0.6, 0.35, 0.5];
const PORT_X = [-1.36, -0.68, 0, 0.68, 1.36];

const ResCtx = createContext<Resources | null>(null);

function useRes() {
  const res = useContext(ResCtx);
  if (!res) throw new Error('Assembly resources missing');
  return res;
}

function M({
  g,
  m = undefined,
  p,
  r = undefined,
}: {
  g: THREE.BufferGeometry;
  m?: THREE.Material;
  p: V3;
  r?: V3;
}) {
  const res = useRes();
  return (
    <mesh
      geometry={g}
      material={m ?? res.mats.detail}
      position={p}
      rotation={r}
      castShadow
      receiveShadow
    />
  );
}

/** Emissive trace: `k` picks the module's primary ('p') or secondary ('s') tier. */
function T({
  i,
  p,
  s,
  r = undefined,
  k = 's',
}: {
  i: number;
  p: V3;
  s: V3;
  r?: V3;
  k?: 'p' | 's';
}) {
  const res = useRes();
  return (
    <mesh
      geometry={res.geo.unit}
      material={res.trace[i][k]}
      position={p}
      scale={s}
      rotation={r}
    />
  );
}

export default function Assembly({
  res,
  refs,
}: {
  res: Resources;
  refs: AssemblyRefs;
}) {
  const { geo, mats, trace } = res;

  const details = [
    // 0: plugin, three hook connectors and one gate bar
    <>
      {[-1.0, 0, 1.0].map((x) => (
        <group key={x}>
          <M g={geo.connector} p={[x, TOP + 0.1, -0.28]} />
          <T i={0} p={[x, TOP + 0.206, -0.28]} s={[0.36, 0.012, 0.05]} />
        </group>
      ))}
      <M g={geo.gate} p={[0, TOP + 0.035, 0.4]} />
      <T i={0} k="p" p={[0, TOP + 0.076, 0.4]} s={[2.5, 0.012, 0.02]} />
    </>,
    // 1: router, one hub fanning to three terminals
    <>
      <M g={geo.hub} p={[-1.15, TOP + 0.065, 0]} />
      <mesh
        geometry={geo.hubCore}
        material={trace[1].p}
        position={[-1.15, TOP + 0.138, 0]}
      />
      <mesh
        geometry={geo.ring}
        material={trace[1].p}
        position={[-1.15, TOP + 0.012, 0]}
      />
      <T i={1} k="p" p={[0.075, TOP + 0.007, 0]} s={[1.9, 0.014, 0.035]} />
      <T i={1} p={[-0.1, TOP + 0.007, 0]} s={[0.035, 0.014, 1.035]} />
      {[-0.5, 0.5].map((z) => (
        <T key={z} i={1} p={[0.475, TOP + 0.007, z]} s={[1.15, 0.014, 0.035]} />
      ))}
      {[-0.5, 0, 0.5].map((z) => (
        <group key={z}>
          <M g={geo.terminal} p={[1.2, TOP + 0.05, z]} />
          <mesh
            geometry={geo.terminalCore}
            material={trace[1].s}
            position={[1.2, TOP + 0.107, z]}
          />
        </group>
      ))}
    </>,
    // 2: capability, five measured columns
    <>
      {PILLAR_X.map((x, k) => (
        <group key={x}>
          <M g={geo.pillars[k]} p={[x, TOP + PILLAR_H[k] / 2, 0]} />
          <T
            i={2}
            k={k === 2 ? 'p' : 's'}
            p={[x, TOP + PILLAR_H[k] + 0.006, 0]}
            s={[0.26, 0.012, 0.26]}
          />
        </group>
      ))}
      <T i={2} p={[0, TOP + 0.006, 0.64]} s={[3.0, 0.012, 0.02]} />
    </>,
    // 3: quota, a gauge rail with a filled span and a marker
    <>
      <M g={geo.rail} p={[0, TOP + 0.03, -0.02]} />
      <Inst geometry={geo.tick} material={mats.steel} items={TICKS} />
      <T i={3} k="p" p={[-0.65, TOP + 0.072, -0.02]} s={[1.7, 0.024, 0.09]} />
      <M g={geo.marker} p={[0.2, TOP + 0.08, -0.02]} r={[0, Math.PI / 4, 0]} />
      <T
        i={3}
        p={[0.2, TOP + 0.166, -0.02]}
        s={[0.1, 0.012, 0.1]}
        r={[0, Math.PI / 4, 0]}
      />
    </>,
    // 4: fallback, the live path, its dashed continuation and a bypass
    <>
      <T i={4} k="p" p={[-0.75, TOP + 0.007, -0.35]} s={[1.3, 0.014, 0.05]} />
      <Inst
        geometry={geo.dash}
        material={mats.dim}
        items={DASHES}
        shadow={false}
      />
      <M g={geo.stop} p={[1.5, TOP + 0.07, -0.35]} />
      <T i={4} k="p" p={[-0.1, TOP + 0.007, 0]} s={[0.05, 0.014, 0.75]} />
      <T i={4} k="p" p={[0.575, TOP + 0.007, 0.35]} s={[1.35, 0.014, 0.05]} />
      <M g={geo.cube} p={[1.35, TOP + 0.07, 0.35]} />
      <T i={4} p={[1.35, TOP + 0.146, 0.35]} s={[0.12, 0.012, 0.12]} />
    </>,
    // 5: adapters, five differently shaped ports for the five adapter files
    <>
      {res.geo.ports.map((port, k) => (
        <group key={port.kind} position={[PORT_X[k], TOP, 0.05]}>
          <M g={port.frame} m={mats.steel} p={[0, 0.065, 0]} />
          <mesh
            geometry={port.contact}
            material={trace[5].p}
            position={[0, 0.0125, 0]}
          />
          <T i={5} p={[0, 0.007, 0.62]} s={[0.07, 0.012, 0.07]} />
        </group>
      ))}
    </>,
  ];

  return (
    <ResCtx.Provider value={res}>
      <group>
        {Array.from({ length: PART_COUNT }, (_, i) => (
          <group
            key={i}
            ref={(el) => {
              refs.plates[i] = el;
            }}
            position={[0, closedY(i), 0]}
          >
            <mesh
              geometry={geo.plate}
              material={i % 2 === 0 ? mats.plateA : mats.plateB}
              castShadow
              receiveShadow
            />
            <Inst geometry={geo.screw} material={mats.steel} items={SCREWS} />
            {i < PART_COUNT - 1 && (
              <mesh
                ref={(el) => {
                  refs.pads[i] = el;
                }}
                geometry={geo.pad}
                material={mats.pad}
                position={[0, PAD_REST, 0]}
                castShadow
                receiveShadow
              >
                {/* Lit edge of the interposer board: interior light from the first frame. */}
                <T i={i} k="p" p={[0, 0, 0.855]} s={[3.2, 0.03, 0.025]} />
                <T i={i} p={[1.645, 0, 0]} s={[0.025, 0.03, 1.6]} />
              </mesh>
            )}
            {i < PART_COUNT - 1 && (
              <Inst
                geometry={geo.collar}
                material={mats.steel}
                items={COLLARS}
              />
            )}
            {details[i]}
          </group>
        ))}
        <instancedMesh
          ref={(el) => {
            refs.rods = el;
            if (el) el.frustumCulled = false;
          }}
          args={[geo.rod, res.rodMat, (PART_COUNT - 1) * ROD_SITES.length]}
          castShadow
        />
      </group>
    </ResCtx.Provider>
  );
}
