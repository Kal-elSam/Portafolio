/* eslint-disable react/no-unknown-property, no-param-reassign -- react-three-fiber JSX props and in-place scene mutation */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import {
  claudeQuota,
  claudeShare,
  codexQuota,
  ROLES,
  smoothstep,
  STILL_PROGRESS,
  TASKS,
} from './data';
import { ribbon, taperPrism, taperTube } from './geometry';
import {
  CABLE_FRAG,
  CONDUIT_VERT,
  CORE_FRAG,
  FLOOR_FRAG,
  FLOOR_VERT,
  GLASS_FRAG,
  GLOW_FRAG,
  GLOW_VERT,
  HAZE_FRAG,
  PLANE_VERT,
  RAIL_FRAG,
  SHAFT_FRAG,
} from './shaders';
import { kairoStore } from './store';

import styles from './kairo.module.css';

const BG = '#06080a';
const FOV = 36;
const PIXEL_BUDGET = 4_200_000;
// postprocessing ToneMappingMode.NEUTRAL, written as its number on purpose.
const TONE_NEUTRAL = 8;

/* ---------- the world ---------- */

const FLOOR_Y = -1.7;
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

// Kairo: a large machine that reads each incoming work item. Everything else is
// laid out around it: work in from the upper left, four roles to its right, two
// providers beyond them.
const CORE = new THREE.Vector3(2.3, 1.15, 2.0);
const CORE_R = 2.0;
const CORE_YAW = -0.3;
const coreEdge = (sign: number, lift = 0) =>
  new THREE.Vector3(sign * CORE_R, lift, 0).applyAxisAngle(Y_AXIS, CORE_YAW).add(CORE);

const ROLE_POS = [
  new THREE.Vector3(5.5, 4.45, 0.5),
  new THREE.Vector3(5.8, 2.5, 1.0),
  new THREE.Vector3(5.8, 0.55, 1.0),
  new THREE.Vector3(5.5, -1.4, 0.5),
] as const;
const STATION_R = 0.5;
const PLINTH_H = CORE.y - CORE_R - FLOOR_Y + 0.25;

// Two providers as two different conduits, tapering to a point in the distance:
// Claude a round tube above, Codex a hexagonal prism below. Straight runs with a
// gentle bend, never a hook, never a rounded tip.
const CONDUITS = [
  {
    id: 'claude',
    r0: 0.68,
    sides: 0,
    pts: [
      [7.9, 3.0, -0.4],
      [11.2, 3.6, -3.4],
      [14.4, 4.3, -8.4],
    ],
  },
  {
    id: 'codex',
    r0: 0.68,
    sides: 6,
    pts: [
      [7.9, -0.05, 1.4],
      [11.2, 0.1, -1.6],
      [14.4, 0.35, -6.4],
    ],
  },
] as const;

const radiusAt = (r0: number, t: number) => r0 * (1 - t) ** 1.05 + 0.012;

const PACKETS = 22;
const PERIOD = 15;
const STILL_TIME = 3.1;
const GOV_PERIOD = 9;
const STILL_GOV = 4.45;
const CABLE_COUNT = 2 + 4 + 8;

// Where a work item is, as one path position tau: lane in (0..0.30), read inside
// Kairo (to 0.40), out to its role (0.52), role to provider (0.66), along the
// provider conduit to the end.
const T_CORE_IN = 0.3;
const T_CORE_OUT = 0.4;
const T_ROLE = 0.52;
const T_PROV = 0.66;

const ACID = new THREE.Color('#c8ff2e');
const STEEL = new THREE.Color('#9aa6b2');
const PALE = new THREE.Color('#d3dbe2');
const BG_COLOR = new THREE.Color(BG);

const scaledAcid = (k: number) => ACID.clone().multiplyScalar(k);
// Scratch for projecting the work-item slabs to canvas pixels.
const SCRATCH = {
  m: new THREE.Matrix4(),
  c: new THREE.Vector3(),
  s: new THREE.Vector3(),
  r: new THREE.Vector3(),
  o: new THREE.Vector3(),
};

const damp = (current: number, target: number, rate: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-rate * dt));
const fract = (x: number) => x - Math.floor(x);
const hash = (x: number) => fract(Math.sin(x * 12.9898) * 43758.5453);

const pickDpr = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const budget = Math.sqrt(PIXEL_BUDGET / Math.max(1, w * h));
  return Math.max(1, Math.min(2, window.devicePixelRatio || 1, budget));
};

// One authored event, played on its own: a short rest, drain, hand-over, hold,
// recovery. The rest is 1.5 s so the re-route begins as the hero appears.
const LOOP = 12.5;
const REST = 1.5;
const loopEvent = (t: number) => {
  const m = t % LOOP;
  if (m < REST) return 0;
  if (m < REST + 3.6) return 0.1 + ((m - REST) / 3.6) * 0.3;
  if (m < REST + 5) return 0.4 + ((m - REST - 3.6) / 1.4) * 0.14;
  if (m < REST + 9) return 0.54;
  const k = (m - REST - 9) / 2;
  return 0.54 * (1 - k * k * (3 - 2 * k));
};

// A denied launch: an unlisted agent approaches Kairo, meets a shield, and is
// turned away. Returns where it is along its lane and how strongly the shield
// shows.
const govern = (h: number) => {
  let u = 0;
  let flash = 0;
  let vis = 0;
  let label = 0;
  if (h > 1.6 && h < 6.6) {
    if (h < 4.2) {
      const x = (h - 1.6) / 2.6;
      u = 0.86 * (1 - (1 - x) ** 2);
      vis = smoothstep(0, 0.12, x);
    } else if (h < 4.9) {
      u = 0.86 + 0.015 * Math.sin((h - 4.2) * 40);
      flash = Math.sin(((h - 4.2) / 0.7) * Math.PI);
      vis = 1;
    } else {
      const x = (h - 4.9) / 1.7;
      u = 0.86 - 0.5 * x * x;
      vis = 1 - smoothstep(0.35, 1, x);
    }
    label = smoothstep(3.7, 4.2, h) * (1 - smoothstep(6.0, 6.6, h));
  }
  return { u, flash, vis, label };
};

/* ---------- materials ---------- */

type U = Record<string, { value: unknown }>;

const shader = (
  vertexShader: string,
  fragmentShader: string,
  uniforms: U,
  extra: Partial<THREE.ShaderMaterialParameters> = {}
) =>
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms as THREE.ShaderMaterialParameters['uniforms'],
    ...extra,
  });

const colors = (): U => ({
  uAcid: { value: ACID.clone() },
  uSteel: { value: STEEL.clone() },
});

const basic = (color: THREE.Color, opacity = 1) =>
  new THREE.MeshBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    toneMapped: false,
  });

const SHAFTS = [
  { x: -4, z: -9, w: 4.4, tilt: 0.2, amp: 0.045, tint: [0.55, 0.68, 0.8], phase: 0.2 },
  { x: 6.5, z: -14, w: 5.6, tilt: 0.14, amp: 0.05, tint: [0.5, 0.64, 0.78], phase: 1.7 },
] as const;

type Rig = {
  glass: THREE.ShaderMaterial[];
  core: THREE.ShaderMaterial[];
  rail: THREE.ShaderMaterial[];
  cable: THREE.ShaderMaterial[];
  shaft: THREE.ShaderMaterial[];
  floor: THREE.ShaderMaterial;
  haze: THREE.ShaderMaterial;
  lens: THREE.ShaderMaterial;
  stationLens: THREE.ShaderMaterial[];
  stationRing: THREE.MeshBasicMaterial[];
  ringMats: THREE.MeshBasicMaterial[];
  pale: THREE.MeshBasicMaterial;
  stripe: THREE.MeshBasicMaterial;
  rogue: THREE.MeshBasicMaterial;
  rogueStripe: THREE.MeshBasicMaterial;
  shield: THREE.MeshBasicMaterial;
  crystalEdge: THREE.LineBasicMaterial;
  crystalCore: THREE.MeshBasicMaterial;
  scan: THREE.MeshBasicMaterial;
  rings: (THREE.Mesh | null)[];
  crystal: THREE.Group | null;
  crystalGlow: THREE.Mesh | null;
  scanMesh: THREE.Mesh | null;
  packets: THREE.InstancedMesh | null;
  stripes: THREE.InstancedMesh | null;
  rogueGroup: THREE.Group | null;
  shieldMesh: THREE.Mesh | null;
  stations: (THREE.Group | null)[];
  lights: (THREE.PointLight | null)[];
  coreLight: THREE.PointLight | null;
};

function useRig(): Rig {
  const rig = useMemo<Rig>(() => {
    const additive = {
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    };
    const cableUniforms = (): U => ({
      ...colors(),
      uTime: { value: 0 },
      uActive: { value: 0 },
      uSurge: { value: -1 },
      uSurgeAmt: { value: 0 },
      uScan: { value: -1 },
      uScanAmt: { value: 0 },
      uSpeed: { value: 1 },
    });
    return {
      glass: CONDUITS.map(() =>
        shader(
          CONDUIT_VERT,
          GLASS_FRAG,
          { ...colors(), uActive: { value: 0 }, uLen: { value: 1 } },
          { transparent: true, depthWrite: false, side: THREE.DoubleSide }
        )
      ),
      core: CONDUITS.map(() =>
        shader(
          CONDUIT_VERT,
          CORE_FRAG,
          {
            ...colors(),
            uTime: { value: 0 },
            uFront: { value: 0 },
            uActive: { value: 0 },
            uSpeed: { value: 1 },
            uFlare: { value: 0 },
            uSurge: { value: -1 },
            uSurgeAmt: { value: 0 },
            uLen: { value: 1 },
          },
          { ...additive, side: THREE.DoubleSide }
        )
      ),
      rail: CONDUITS.map(() =>
        shader(
          CONDUIT_VERT,
          RAIL_FRAG,
          { ...colors(), uFront: { value: 0 }, uActive: { value: 0 } },
          { ...additive, side: THREE.DoubleSide }
        )
      ),
      cable: Array.from({ length: CABLE_COUNT }, () =>
        shader(CONDUIT_VERT, CABLE_FRAG, cableUniforms(), additive)
      ),
      shaft: SHAFTS.map((sh) =>
        shader(
          PLANE_VERT,
          SHAFT_FRAG,
          {
            uColor: { value: new THREE.Vector3(...sh.tint) },
            uAmp: { value: sh.amp },
            uPhase: { value: sh.phase },
            uTime: { value: 0 },
          },
          { ...additive, side: THREE.DoubleSide }
        )
      ),
      floor: shader(
        FLOOR_VERT,
        FLOOR_FRAG,
        {
          ...colors(),
          uBg: { value: BG_COLOR.clone() },
          uSeg: { value: [new THREE.Vector4(), new THREE.Vector4()] },
          uAmt: { value: new THREE.Vector2() },
        },
        { depthWrite: false }
      ),
      haze: shader(
        PLANE_VERT,
        HAZE_FRAG,
        {
          uBg: { value: BG_COLOR.clone() },
          uTint: { value: new THREE.Vector3(0.011, 0.016, 0.021) },
          uFloorY: { value: FLOOR_Y },
        },
        { depthWrite: false }
      ),
      lens: shader(
        GLOW_VERT,
        GLOW_FRAG,
        { uColor: { value: ACID.clone() }, uIntensity: { value: 0 } },
        additive
      ),
      stationLens: ROLES.map(() =>
        shader(GLOW_VERT, GLOW_FRAG, { uColor: { value: ACID.clone() }, uIntensity: { value: 0 } }, additive)
      ),
      stationRing: ROLES.map(() => basic(STEEL.clone().multiplyScalar(0.55))),
      ringMats: [0, 1, 2].map(() => basic(STEEL.clone().multiplyScalar(0.6))),
      pale: basic(PALE.clone().multiplyScalar(0.8)),
      stripe: basic(scaledAcid(0.92)),
      rogue: basic(new THREE.Color('#79828c')),
      rogueStripe: basic(new THREE.Color('#e8edf2')),
      shield: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#e8edf2'),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
      crystalEdge: new THREE.LineBasicMaterial({ color: scaledAcid(0.85), toneMapped: false }),
      crystalCore: basic(scaledAcid(0.92)),
      scan: new THREE.MeshBasicMaterial({
        color: scaledAcid(0.8),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
      rings: [null, null, null],
      crystal: null,
      crystalGlow: null,
      scanMesh: null,
      packets: null,
      stripes: null,
      rogueGroup: null,
      shieldMesh: null,
      stations: [null, null, null, null],
      lights: [null, null],
      coreLight: null,
    };
  }, []);
  useEffect(
    () => () => {
      const mats: THREE.Material[] = [
        ...rig.glass,
        ...rig.core,
        ...rig.rail,
        ...rig.cable,
        ...rig.shaft,
        ...rig.stationLens,
        ...rig.stationRing,
        ...rig.ringMats,
        rig.floor,
        rig.haze,
        rig.lens,
        rig.pale,
        rig.stripe,
        rig.rogue,
        rig.rogueStripe,
        rig.shield,
        rig.crystalEdge,
        rig.crystalCore,
        rig.scan,
      ];
      mats.forEach((m) => m.dispose());
    },
    [rig]
  );
  return rig;
}

/* ---------- geometry built once ---------- */

const bezier = (a: THREE.Vector3, b: THREE.Vector3, bend: number) =>
  new THREE.CubicBezierCurve3(
    a.clone(),
    a.clone().add(new THREE.Vector3(bend, 0, 0)),
    b.clone().add(new THREE.Vector3(-bend, 0, 0)),
    b.clone()
  );

const buildWorld = () => {
  const curves = CONDUITS.map(
    (c) =>
      new THREE.CatmullRomCurve3(
        c.pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
        false,
        'centripetal'
      )
  );
  const intake = curves.map((cv) => cv.getPointAt(0));
  const leftA = coreEdge(-1, 0.4);
  const leftB = coreEdge(-1, -0.4);
  const leftC = coreEdge(-1, -0.95);
  const lanes = [
    new THREE.CatmullRomCurve3(
      [new THREE.Vector3(-2.6, 5.3, 0.8), new THREE.Vector3(-0.5, 3.6, 1.5), leftA],
      false,
      'centripetal'
    ),
    new THREE.CatmullRomCurve3(
      [new THREE.Vector3(-1.4, 6.0, -1.6), new THREE.Vector3(0.2, 4.2, 0.3), leftB],
      false,
      'centripetal'
    ),
  ];
  // The unlisted agent comes in low on the left, by itself.
  const rogue = new THREE.CatmullRomCurve3(
    [new THREE.Vector3(-1.9, -0.9, 3.9), new THREE.Vector3(-0.6, -0.5, 3.0), leftC],
    false,
    'centripetal'
  );
  const exit = coreEdge(1, 0);
  const toRole = ROLE_POS.map((p) => {
    const a = new THREE.Vector3(-1, 0, 0).multiplyScalar(STATION_R + 0.06).add(p);
    return bezier(exit, a, 1.1);
  });
  const toProv: THREE.CubicBezierCurve3[] = [];
  ROLE_POS.forEach((p) => {
    const a = new THREE.Vector3(STATION_R + 0.06, 0, 0).add(p);
    intake.forEach((to) => toProv.push(bezier(a, to.clone().add(new THREE.Vector3(-0.35, 0, 0)), 1.2)));
  });
  const lens = curves.map((cv) => cv.getLength());
  const tube = (cv: THREE.Curve<THREE.Vector3>, r: number) => new THREE.TubeGeometry(cv, 56, r, 6, false);
  return {
    curves,
    lanes,
    rogue,
    toRole,
    toProv,
    intake,
    exit,
    lens,
    cableGeos: [
      ...lanes.map((c) => tube(c, 0.06)),
      ...toRole.map((c) => tube(c, 0.05)),
      ...toProv.map((c) => tube(c, 0.04)),
    ],
    glass: curves.map((cv, i) =>
      CONDUITS[i].sides
        ? taperPrism(cv, 80, CONDUITS[i].sides, (t) => radiusAt(CONDUITS[i].r0, t))
        : taperTube(cv, 80, 56, (t) => radiusAt(CONDUITS[i].r0, t))
    ),
    core: curves.map((cv, i) =>
      CONDUITS[i].sides
        ? taperPrism(cv, 80, CONDUITS[i].sides, (t) => radiusAt(CONDUITS[i].r0, t) * 0.7)
        : taperTube(cv, 80, 40, (t) => radiusAt(CONDUITS[i].r0, t) * 0.7)
    ),
    rail: curves.map((cv, i) =>
      ribbon(cv, 80, (t) => new THREE.Vector3(0, -(radiusAt(CONDUITS[i].r0, t) + 0.5), 0.12), 0.34)
    ),
  };
};

const metal = <meshStandardMaterial color="#141b21" metalness={0.9} roughness={0.34} />;
const darkMetal = <meshStandardMaterial color="#232c34" metalness={0.92} roughness={0.3} />;
const archMat = <meshBasicMaterial color="#030507" />;

// A calm hall: a few broad, dark masses far back, no thin verticals.
const PILLARS: [number, number, number][] = [
  [-20, -16, 5],
  [-6, -26, 6],
  [8, -30, 6.5],
  [-16, -34, 7],
];

/* ---------- the living system ---------- */

type WorldProps = {
  still: boolean;
  onFirstFrame: () => void;
  onLost: () => void;
};

function World({ still, onFirstFrame, onLost }: WorldProps) {
  const rig = useRig();
  const { gl, scene, camera, size, invalidate } = useThree();
  const frames = useRef(0);
  const evt = useRef({
    shown: still ? STILL_PROGRESS : 0,
    prevQ: [0, 0],
    flare: [0, 0],
  });
  const camBase = useRef({ d: 12.5, shift: 0 });
  const envRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const state = useRef({
    prov: new Int8Array(PACKETS),
    decided: new Int32Array(PACKETS).fill(-1),
    acc: 0.5,
    heat: new Float32Array(CABLE_COUNT),
    roleHeat: new Float32Array(ROLES.length),
    pulse: 0,
  });

  const built = useMemo(buildWorld, []);
  const { curves } = built;
  const slabGeo = useMemo(() => new RoundedBoxGeometry(0.84, 0.48, 0.12, 3, 0.04), []);
  const stripeGeo = useMemo(() => new THREE.BoxGeometry(0.62, 0.06, 0.14), []);
  const crossGeo = useMemo(() => new THREE.BoxGeometry(0.62, 0.05, 0.14), []);
  const crystalGeo = useMemo(() => new THREE.IcosahedronGeometry(0.62, 0), []);
  const crystalEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.64, 0)), []);
  const glowGeo = useMemo(() => new THREE.SphereGeometry(0.26, 24, 16), []);
  const scanGeo = useMemo(() => new THREE.TorusGeometry(0.9, 0.014, 6, 64), []);
  const ringGeos = useMemo(
    () => [
      new THREE.TorusGeometry(1.62, 0.04, 8, 120, Math.PI * 1.55),
      new THREE.TorusGeometry(1.36, 0.032, 8, 120, Math.PI * 1.25),
      new THREE.TorusGeometry(1.12, 0.028, 8, 120, Math.PI * 1.05),
    ],
    []
  );
  const shieldGeo = useMemo(() => new THREE.TorusGeometry(2.42, 0.07, 8, 64, Math.PI * 0.62), []);
  const stationGeos = useMemo(
    () => [
      new THREE.TorusGeometry(STATION_R, 0.07, 12, 56),
      new THREE.TorusGeometry(STATION_R + 0.13, 0.03, 8, 56),
    ],
    []
  );
  const intakeGeos = useMemo(
    () =>
      CONDUITS.map((c) => new THREE.TorusGeometry(c.r0 * 1.22, 0.09, 12, c.sides ? c.sides : 56)),
    []
  );
  const pillarGeo = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 3, 0.09), []);
  const shaftGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const boltGeo = useMemo(() => new THREE.CylinderGeometry(0.07, 0.07, 0.09, 10), []);
  const plinthGeo = useMemo(() => new THREE.CylinderGeometry(0.85, 1.15, 1, 48), []);

  useEffect(
    () => () => {
      const all: THREE.BufferGeometry[] = [
        ...built.glass,
        ...built.core,
        ...built.rail,
        ...built.cableGeos,
        slabGeo,
        stripeGeo,
        crossGeo,
        crystalGeo,
        crystalEdges,
        glowGeo,
        scanGeo,
        shieldGeo,
        pillarGeo,
        shaftGeo,
        boltGeo,
        plinthGeo,
        ...ringGeos,
        ...stationGeos,
        ...intakeGeos,
      ];
      all.forEach((g) => g.dispose());
    },
    [
      built,
      slabGeo,
      stripeGeo,
      crossGeo,
      crystalGeo,
      crystalEdges,
      glowGeo,
      scanGeo,
      shieldGeo,
      pillarGeo,
      shaftGeo,
      boltGeo,
      plinthGeo,
      ringGeos,
      stationGeos,
      intakeGeos,
    ]
  );

  // Static uniforms that depend on the built curves.
  useEffect(() => {
    built.lens.forEach((len, i) => {
      rig.glass[i].uniforms.uLen.value = len;
      rig.core[i].uniforms.uLen.value = len;
    });
    const seg = rig.floor.uniforms.uSeg.value as THREE.Vector4[];
    curves.forEach((cv, i) => {
      const a = cv.getPointAt(0);
      const b = cv.getPointAt(0.95);
      seg[i].set(a.x, a.z, b.x, b.z);
    });
  }, [built, curves, rig]);

  // Image-based light for the metal. Built once and rebuilt after a context
  // restore, because render targets do not survive it.
  const buildEnv = useCallback(() => {
    envRef.current?.dispose();
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.3;
    envRef.current = target;
    room.dispose();
    pmrem.dispose();
  }, [gl, scene]);

  useEffect(() => {
    buildEnv();
    return () => {
      envRef.current?.dispose();
      envRef.current = null;
      scene.environment = null;
    };
  }, [buildEnv, scene]);

  // A still renders on demand, so ask for a few frames until the first lands.
  useEffect(() => {
    if (!still) return undefined;
    const ids = [0, 90, 240, 600].map((ms) => window.setTimeout(invalidate, ms));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [still, invalidate]);

  useEffect(() => {
    const dom = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    // On loss the stage swaps in the static drawing and mounts a fresh canvas
    // once the browser can create a context again.
    dom.addEventListener('webglcontextlost', lost);
    return () => {
      dom.removeEventListener('webglcontextlost', lost);
    };
  }, [gl, onLost]);

  // Full-bleed camera. On wide layouts the copy takes the left; when it covers
  // more than ~40% of the width the whole system slides right and steps back.
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const wide = size.width >= 1100;
    const copy = wide ? gl.domElement.closest('section')?.querySelector('[data-copy]') : null;
    const copyFrac = copy ? copy.getBoundingClientRect().right / size.width : 0;
    const copyRight = copyFrac * size.width;
    // Fit the whole system (about 12.8 by 9.4 world units) into the part of the
    // frame the copy leaves free.
    const availW = Math.max(240, size.width - copyRight - (wide ? 40 : 0));
    const pxu = Math.min(availW / 12.8, (size.height * 0.92) / 9.4);
    const d = size.height / 2 / (Math.tan((FOV * Math.PI) / 360) * pxu);
    const shift = wide ? copyRight / 2 : 0;
    camBase.current = { d, shift };
    cam.setViewOffset(size.width, size.height, -shift, 0, size.width, size.height);
    cam.updateProjectionMatrix();
    invalidate();
    return () => {
      cam.clearViewOffset();
      cam.updateProjectionMatrix();
    };
  }, [camera, gl, size.width, size.height, invalidate]);

  const tmp = useMemo(
    () => ({
      dummy: new THREE.Object3D(),
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      xAxis: new THREE.Vector3(1, 0, 0),
      look: new THREE.Vector3(),
      anchor: new THREE.Vector3(),
      phase: Float32Array.from({ length: PACKETS }, (_, i) => {
        const jitter = hash(i + 1.7);
        return (i + (jitter - 0.5) * 0.5) / PACKETS;
      }),
      lane: Int8Array.from({ length: PACKETS }, (_, i) => i % 2),
    }),
    []
  );

  // Cable index: lanes 0-1, core-to-role 2-5, role-to-provider 6-13.
  const place = useCallback(
    (out: THREE.Vector3, tau: number, lane: number, role: number, prov: number) => {
      if (tau < T_CORE_IN) {
        built.lanes[lane].getPointAt(tau / T_CORE_IN, out);
      } else if (tau < T_CORE_OUT) {
        const k = (tau - T_CORE_IN) / (T_CORE_OUT - T_CORE_IN);
        built.lanes[lane].getPointAt(1, out).lerp(built.exit, k);
      } else if (tau < T_ROLE) {
        built.toRole[role].getPoint((tau - T_CORE_OUT) / (T_ROLE - T_CORE_OUT), out);
      } else if (tau < T_PROV) {
        built.toProv[role * 2 + prov].getPoint((tau - T_ROLE) / (T_PROV - T_ROLE), out);
      } else {
        curves[prov].getPointAt(Math.min(1, ((tau - T_PROV) / (1 - T_PROV)) * 0.62), out);
      }
      return out;
    },
    [built, curves]
  );

  useFrame((frame, delta) => {
    const dt = Math.min(delta, 0.05);
    const k = kairoStore;
    const time = still ? STILL_TIME : frame.clock.elapsedTime;
    const ev = evt.current;
    const st = state.current;

    // The event: the authored loop, or the finished state for a still.
    ev.shown = still ? STILL_PROGRESS : loopEvent(time);
    const e = ev.shown;
    k.shown = e;

    const share = claudeShare(e);
    const q = [claudeQuota(e), codexQuota()];
    const act = [Math.min(1, share * 1.5), Math.min(1, (1 - share) * 1.5)];

    // Providers: lit length is quota, light is where the work is going.
    CONDUITS.forEach((_, i) => {
      const rate = Math.abs(q[i] - ev.prevQ[i]) / Math.max(dt, 1e-3);
      ev.prevQ[i] = q[i];
      ev.flare[i] = damp(ev.flare[i], Math.min(1, rate * 2.2), 9, dt);
      const flare = ev.flare[i];
      const core = rig.core[i];
      core.uniforms.uTime.value = time;
      core.uniforms.uFront.value = q[i];
      core.uniforms.uActive.value = act[i];
      core.uniforms.uSpeed.value = 0.6 + 0.9 * act[i] + 2.4 * flare;
      core.uniforms.uFlare.value = flare;
      rig.glass[i].uniforms.uActive.value = act[i];
      rig.rail[i].uniforms.uFront.value = q[i];
      rig.rail[i].uniforms.uActive.value = act[i];
      const light = rig.lights[i];
      if (light) light.intensity = 1 + 38 * act[i];
      (rig.floor.uniforms.uAmt.value as THREE.Vector2).setComponent(
        i,
        act[i] * (0.35 + 0.65 * Math.min(1, q[i] * 2))
      );
    });
    rig.shaft.forEach((m) => {
      m.uniforms.uTime.value = time;
    });

    // Work items: instanced, each on a path lane, role, provider.
    const { packets, stripes } = rig;
    const target = new Float32Array(CABLE_COUNT);
    const roleTarget = [0, 0, 0, 0];
    let pulse = 0;
    const slotBest = [-1, -1, -1];
    const slotTau = [0, 0, 0];
    const slotRole = [0, 0, 0];
    const slotName = ['', '', ''];
    if (packets && stripes) {
      const { dummy, a, b, q: quat, xAxis, phase, lane } = tmp;
      for (let n = 0; n < PACKETS; n += 1) {
        const sum = time / PERIOD + phase[n];
        const tau = fract(sum);
        const cyc = Math.floor(sum);
        const h1 = hash(n * 7.13 + cyc * 3.31);
        const role = Math.floor(h1 * ROLES.length) % ROLES.length;
        if (tau >= T_CORE_IN && st.decided[n] !== cyc) {
          st.decided[n] = cyc;
          st.acc += share;
          if (st.acc >= 1) {
            st.prov[n] = 0;
            st.acc -= 1;
          } else {
            st.prov[n] = 1;
          }
        }
        const prov = st.prov[n];
        const ln = lane[n];
        place(a, tau, ln, role, prov);
        place(b, Math.min(1, tau + 0.004), ln, role, prov);
        b.sub(a);
        if (b.lengthSq() < 1e-10) b.set(1, 0, 0);
        dummy.position.copy(a);
        quat.setFromUnitVectors(xAxis, b.normalize());
        dummy.quaternion.copy(quat);
        const hide = smoothstep(T_CORE_IN - 0.035, T_CORE_IN, tau) * (1 - smoothstep(T_CORE_OUT, T_CORE_OUT + 0.035, tau));
        const shrink = 1 - 0.42 * smoothstep(T_CORE_OUT, T_ROLE, tau) - 0.5 * smoothstep(T_PROV, 1, tau);
        const s = smoothstep(0, 0.04, tau) * (1 - smoothstep(0.93, 1, tau)) * (1 - hide);
        dummy.scale.setScalar(Math.max(0.0001, s * shrink * 1.15));
        dummy.updateMatrix();
        packets.setMatrixAt(n, dummy.matrix);
        stripes.setMatrixAt(n, dummy.matrix);

        if (tau < T_CORE_IN) target[ln] = 1;
        else if (tau < T_CORE_OUT) pulse = Math.max(pulse, Math.sin(((tau - T_CORE_IN) / (T_CORE_OUT - T_CORE_IN)) * Math.PI));
        else if (tau < T_ROLE) {
          target[2 + role] = 1;
          roleTarget[role] = 1;
        } else if (tau < T_PROV) {
          target[6 + role * 2 + prov] = 1;
          roleTarget[role] = Math.max(roleTarget[role], 0.7);
        }

        // Three moving labels, one per slot, on items still on their lane.
        const sl = Math.floor(n / 2) % 3;
        if (ln === 0 && tau > 0.05 && tau < 0.2 && slotBest[sl] < 0) {
          slotBest[sl] = n;
          slotTau[sl] = tau;
          slotRole[sl] = role;
          slotName[sl] = TASKS[role][Math.floor(hash(n * 1.7 + cyc * 5.1) * 2) % 2];
        }
      }
      packets.instanceMatrix.needsUpdate = true;
      stripes.instanceMatrix.needsUpdate = true;
    }
    for (let c = 0; c < CABLE_COUNT; c += 1) {
      st.heat[c] = damp(st.heat[c], target[c], target[c] > st.heat[c] ? 14 : 3.2, dt);
      const m = rig.cable[c];
      m.uniforms.uTime.value = time;
      m.uniforms.uActive.value = st.heat[c];
      m.uniforms.uSpeed.value = 0.8 + st.heat[c];
    }
    st.pulse = damp(st.pulse, pulse, pulse > st.pulse ? 16 : 5, dt);

    // Governance: an unlisted agent is turned away at the shield.
    const gh = still ? STILL_GOV : time % GOV_PERIOD;
    const gv = govern(gh);
    if (rig.rogueGroup) {
      built.rogue.getPointAt(Math.min(1, gv.u), tmp.a);
      rig.rogueGroup.position.copy(tmp.a);
      built.rogue.getTangentAt(Math.min(1, gv.u), tmp.b);
      rig.rogueGroup.quaternion.setFromUnitVectors(tmp.xAxis, tmp.b);
      rig.rogueGroup.scale.setScalar(Math.max(0.0001, gv.vis * 1.15));
      rig.rogueGroup.visible = gv.vis > 0.01;
    }
    rig.shield.opacity = 0.08 * gv.vis * (gv.u > 0.5 ? 1 : 0) + 0.85 * gv.flash;
    if (rig.shieldMesh) rig.shieldMesh.visible = rig.shield.opacity > 0.01;

    // Kairo: the crystal turns faster while it reads, rings brighten.
    const reading = Math.max(st.pulse, gv.flash * 0.8);
    if (rig.crystal) {
      rig.crystal.rotation.y = time * (0.35 + 1.4 * st.pulse);
      rig.crystal.rotation.x = time * 0.22;
      rig.crystal.scale.setScalar(1 + 0.08 * reading);
    }
    rig.crystalCore.color.copy(ACID).multiplyScalar(0.55 + 0.45 * Math.min(1, reading + 0.2));
    if (rig.crystalGlow) rig.crystalGlow.scale.setScalar(0.9 + 0.5 * reading);
    rig.rings.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.z = time * (0.2 + i * 0.15) * (i % 2 ? -1 : 1);
      rig.ringMats[i].color
        .copy(STEEL)
        .multiplyScalar(0.6)
        .lerp(scaledAcid(0.9), Math.min(1, 0.35 + reading * 0.9));
    });
    rig.lens.uniforms.uIntensity.value = 0.22 + 0.5 * reading;
    if (rig.coreLight) rig.coreLight.intensity = 8 + 40 * reading;
    // The decision scan: a band around the core while it reads.
    if (rig.scanMesh) {
      rig.scanMesh.scale.setScalar(1 + 0.9 * st.pulse);
      rig.scan.opacity = 0.8 * st.pulse;
      rig.scanMesh.visible = st.pulse > 0.02;
    }

    // Roles light up as work reaches them.
    ROLES.forEach((_, i) => {
      st.roleHeat[i] = damp(st.roleHeat[i], roleTarget[i], roleTarget[i] > st.roleHeat[i] ? 14 : 3, dt);
      const hv = st.roleHeat[i];
      rig.stationLens[i].uniforms.uIntensity.value = 0.05 + 0.6 * hv;
      rig.stationRing[i].color
        .copy(STEEL)
        .multiplyScalar(0.55)
        .lerp(scaledAcid(0.9), Math.min(1, hv * 1.1));
    });

    // Camera: low and wide, a slow sway, pointer parallax, a small push as the work moves over.
    const cam = camera as THREE.PerspectiveCamera;
    const { d } = camBase.current;
    const px = still ? 0 : k.pointerX;
    const py = still ? 0 : k.pointerY;
    const sway = still ? 0 : Math.sin(time * 0.19) * 0.35;
    const dist = d * (1 - 0.03 * Math.sin(Math.PI * Math.min(1, e / 0.54)));
    cam.position.set(2.6 + px * 1.2 + sway, 3.0 - py * 0.5, dist);
    tmp.look.set(6.1, 1.7, 0.4);
    cam.lookAt(tmp.look);
    cam.updateMatrixWorld();

    // Label anchors in canvas pixels, always clear of geometry.
    const project = (key: keyof typeof k.anchors, x: number, y: number, z: number, alpha = 1) => {
      tmp.anchor.set(x, y, z).project(cam);
      const target2 = k.anchors[key];
      target2.x = (tmp.anchor.x * 0.5 + 0.5) * size.width;
      target2.y = (-tmp.anchor.y * 0.5 + 0.5) * size.height;
      target2.on = true;
      target2.a = alpha;
    };
    // Where the slabs and the core sit on screen, so the task labels can
    // stay clear of them.
    {
      const { m, c, s: sc, r, o } = SCRATCH;
      r.setFromMatrixColumn(cam.matrixWorld, 0);
      const toPx = (v: THREE.Vector3, out: THREE.Vector3) => {
        out.copy(v).project(cam);
        out.x = (out.x * 0.5 + 0.5) * size.width;
        out.y = (-out.y * 0.5 + 0.5) * size.height;
        return out;
      };
      const unit = (v: THREE.Vector3) => {
        const a = toPx(v, o).clone();
        const b = toPx(v.clone().add(r), o);
        return Math.hypot(a.x - b.x, a.y - b.y);
      };
      let count = 0;
      if (packets) {
        for (let n = 0; n < PACKETS; n += 1) {
          packets.getMatrixAt(n, m);
          c.setFromMatrixPosition(m);
          sc.setFromMatrixScale(m);
          if (sc.x >= 0.3) {
            const u = unit(c) * sc.x;
            const p = toPx(c, o);
            k.slabs[count * 4] = p.x;
            k.slabs[count * 4 + 1] = p.y;
            k.slabs[count * 4 + 2] = 0.46 * u;
            k.slabs[count * 4 + 3] = 0.34 * u;
            count += 1;
          }
        }
      }
      k.slabCount = count;
      const cp = toPx(CORE, o);
      k.core.x = cp.x;
      k.core.y = cp.y;
      k.core.r = (CORE_R + 0.3) * unit(CORE);
    }
    project('kairo', CORE.x, CORE.y + CORE_R + 0.5, CORE.z);
    ROLES.forEach((_, i) => {
      const p = ROLE_POS[i];
      // Tight on its own ring, with a tick down to it: no label can read as the
      // neighbour's.
      project(`role${i}` as 'role0', p.x, p.y + STATION_R + 0.1, p.z);
    });
    const ic = built.intake[0];
    const ix = built.intake[1];
    project('claude', ic.x - 0.35, ic.y + CONDUITS[0].r0 * 1.2 + 0.4, ic.z);
    project('codex', ix.x - 0.35, ix.y - CONDUITS[1].r0 * 1.2 - 0.55, ix.z + 0.2);
    project('deny', CORE.x - 3.1, CORE.y - 1.75, CORE.z + 1.2, gv.label);
    for (let s = 0; s < 3; s += 1) {
      const n = slotBest[s];
      const key = `t${s}` as 't0';
      if (n < 0) {
        k.anchors[key].a = 0;
      } else {
        const tau = slotTau[s];
        const ln = tmp.lane[n];
        place(tmp.a, tau, ln, slotRole[s], 0);
        const alpha = smoothstep(0.05, 0.09, tau) * (1 - smoothstep(0.13, 0.19, tau));
        project(key, tmp.a.x, tmp.a.y + 0.55, tmp.a.z, alpha);
        k.tasks[s].name = slotName[s];
        k.tasks[s].role = slotRole[s];
      }
    }

    frames.current += 1;
    if (frames.current === (still ? 2 : 3)) onFirstFrame();
  });

  const packetRef = useCallback(
    (mesh: THREE.InstancedMesh | null) => {
      rig.packets = mesh;
      if (!mesh) return;
      mesh.frustumCulled = false;
    },
    [rig]
  );
  const stripeRef = useCallback(
    (mesh: THREE.InstancedMesh | null) => {
      rig.stripes = mesh;
      if (!mesh) return;
      mesh.frustumCulled = false;
    },
    [rig]
  );

  const gateTicks = useCallback((mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let t = 0; t < 48; t += 1) {
      const a = (t / 48) * Math.PI * 2;
      const major = t % 4 === 0;
      const len = major ? 0.22 : 0.09;
      dummy.position.set(Math.cos(a) * (CORE_R - 0.2 - len / 2), Math.sin(a) * (CORE_R - 0.2 - len / 2), 0);
      dummy.rotation.set(0, 0, a);
      dummy.scale.set(len, major ? 0.03 : 0.018, 0.02);
      dummy.updateMatrix();
      mesh.setMatrixAt(t, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  const gateBolts = useCallback((mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let t = 0; t < 16; t += 1) {
      const a = (t / 16) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * (CORE_R + 0.2), Math.sin(a) * (CORE_R + 0.2), 0.12);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(t, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  const conduitQuat = (i: number) =>
    new THREE.Quaternion().setFromUnitVectors(Z_AXIS, curves[i].getTangentAt(0));

  return (
    <>
      <fogExp2 attach="fog" args={[BG, 0.017]} />
      <ambientLight intensity={0.06} />
      <directionalLight position={[-7, 10, 11]} intensity={0.95} color="#dfe8f2" />
      <directionalLight position={[12, 5, -8]} intensity={3.0} color="#9fb6cc" />
      <directionalLight position={[-12, 6, -10]} intensity={1.4} color="#9fb6cc" />
      <pointLight
        ref={(l) => {
          rig.coreLight = l;
        }}
        position={[CORE.x, CORE.y, CORE.z + 1.4]}
        color={ACID}
        distance={10}
        decay={2}
        intensity={0}
      />
      {curves.map((cv, i) => {
        const p = cv.getPointAt(0.35);
        return (
          <pointLight
            key={CONDUITS[i].id}
            ref={(l) => {
              rig.lights[i] = l;
            }}
            position={[p.x - 1, p.y + 1.2, p.z - 1.2]}
            color={ACID}
            distance={26}
            decay={1.6}
            intensity={0}
          />
        );
      })}

      {/* floor: seams and the light each provider pools */}
      <mesh position={[0, FLOOR_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-10}>
        <planeGeometry args={[300, 240]} />
        <primitive object={rig.floor} attach="material" />
      </mesh>

      {/* horizon haze and a few soft shafts of light */}
      <mesh position={[4, 10, -40]} renderOrder={-12}>
        <planeGeometry args={[240, 90]} />
        <primitive object={rig.haze} attach="material" />
      </mesh>
      {SHAFTS.map((sh, i) => (
        <mesh
          key={sh.x}
          geometry={shaftGeo}
          position={[sh.x, 9, sh.z]}
          rotation={[0, 0, sh.tilt]}
          scale={[sh.w, 30, 1]}
          renderOrder={-5}
        >
          <primitive object={rig.shaft[i]} attach="material" />
        </mesh>
      ))}

      {/* the hall: broad dark masses far back */}
      {PILLARS.map(([x, z, w]) => (
        <mesh key={`${x}-${z}`} geometry={pillarGeo} position={[x, 14, z]} scale={[w, 33, w]}>
          {archMat}
        </mesh>
      ))}

      {/* cables: work in, Kairo to each role, each role to each provider */}
      {built.cableGeos.map((geo, i) => (
        <mesh key={geo.uuid} geometry={geo} material={rig.cable[i]} renderOrder={3} />
      ))}

      {/* the providers: a round tube and a hexagonal prism, tapering to a point */}
      {CONDUITS.map((c, i) => (
        <group key={c.id}>
          <mesh geometry={built.core[i]} material={rig.core[i]} renderOrder={3} />
          <mesh geometry={built.glass[i]} material={rig.glass[i]} renderOrder={4} />
          <mesh geometry={built.rail[i]} material={rig.rail[i]} renderOrder={5} />
          <mesh
            geometry={intakeGeos[i]}
            position={built.intake[i]}
            quaternion={conduitQuat(i)}
          >
            {darkMetal}
          </mesh>
        </group>
      ))}

      {/* the four roles */}
      {ROLES.map((role, i) => (
        <group
          key={role}
          position={ROLE_POS[i]}
          rotation={[0, CORE_YAW, 0]}
          ref={(g) => {
            rig.stations[i] = g;
          }}
        >
          <mesh geometry={stationGeos[0]} material={rig.stationRing[i]} />
          <mesh geometry={stationGeos[1]}>{metal}</mesh>
          <mesh scale={[STATION_R * 0.95, STATION_R * 0.95, 1]}>
            <planeGeometry args={[2, 2]} />
            <primitive object={rig.stationLens[i]} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Kairo: the core */}
      <mesh
        position={[CORE.x, FLOOR_Y + PLINTH_H / 2, CORE.z]}
        scale={[1, PLINTH_H, 1]}
        geometry={plinthGeo}
      >
        {metal}
      </mesh>
      <group position={CORE} rotation={[0, CORE_YAW, 0]}>
        {ringGeos.map((geo, i) => (
          <mesh
            key={geo.uuid}
            geometry={geo}
            material={rig.ringMats[i]}
            ref={(m) => {
              rig.rings[i] = m;
            }}
          />
        ))}
        <mesh>
          <torusGeometry args={[CORE_R, 0.17, 14, 120]} />
          {darkMetal}
        </mesh>
        <mesh>
          <torusGeometry args={[CORE_R - 0.16, 0.03, 8, 120]} />
          <meshStandardMaterial color="#8d98a4" metalness={0.95} roughness={0.28} />
        </mesh>
        <instancedMesh args={[undefined, undefined, 48]} ref={gateTicks} frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#7d8995" metalness={0.9} roughness={0.35} />
        </instancedMesh>
        <instancedMesh args={[boltGeo, undefined, 16]} ref={gateBolts} frustumCulled={false}>
          <meshStandardMaterial color="#9aa6b2" metalness={0.95} roughness={0.25} />
        </instancedMesh>
        <mesh scale={[CORE_R - 0.15, CORE_R - 0.15, 1]}>
          <planeGeometry args={[2, 2]} />
          <primitive object={rig.lens} attach="material" />
        </mesh>
        <group
          ref={(g) => {
            rig.crystal = g;
          }}
        >
          <mesh geometry={crystalGeo}>
            <meshStandardMaterial color="#1b232a" metalness={0.92} roughness={0.22} flatShading />
          </mesh>
          <lineSegments geometry={crystalEdges} material={rig.crystalEdge} />
        </group>
        <mesh
          geometry={glowGeo}
          material={rig.crystalCore}
          ref={(m) => {
            rig.crystalGlow = m;
          }}
        />
        <mesh
          geometry={scanGeo}
          material={rig.scan}
          rotation={[1.2, 0.3, 0]}
          ref={(m) => {
            rig.scanMesh = m;
          }}
        />
        {/* the shield that turns an unlisted agent away, on the incoming side */}
        <mesh
          geometry={shieldGeo}
          material={rig.shield}
          rotation={[0, 0, 2.6]}
          ref={(m) => {
            rig.shieldMesh = m;
          }}
        />
      </group>

      {/* work items: a pale slab with an acid stripe, bright against the dark machines */}
      <instancedMesh ref={packetRef} args={[slabGeo, rig.pale, PACKETS]} frustumCulled={false} renderOrder={6} />
      <instancedMesh ref={stripeRef} args={[stripeGeo, rig.stripe, PACKETS]} frustumCulled={false} renderOrder={7} />

      {/* the unlisted agent */}
      <group
        ref={(g) => {
          rig.rogueGroup = g;
        }}
        visible={false}
      >
        <mesh geometry={slabGeo} material={rig.rogue} />
        <mesh geometry={crossGeo} material={rig.rogueStripe} position={[0, 0, 0.02]} rotation={[0, 0, 0.62]} />
        <mesh geometry={crossGeo} material={rig.rogueStripe} position={[0, 0, 0.02]} rotation={[0, 0, -0.62]} />
      </group>
    </>
  );
}

/* ---------- the canvas ---------- */

type KairoSceneProps = {
  still: boolean;
  onReady: () => void;
  onFail: () => void;
  onLost: () => void;
};

export default function KairoScene({ still, onReady, onFail, onLost }: KairoSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(pickDpr);
  const [visible, setVisible] = useState(true);
  const reported = useRef(false);
  const live = visible ? 'always' : 'never';
  const frameloop = still ? 'demand' : live;

  useEffect(() => {
    const onResize = () => setDpr(pickDpr());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // The readiness deadline only counts while frames can advance. Offscreen the
  // loop is paused, so a scene mounted early would otherwise time out before it
  // ever rendered; it restarts when the scene becomes visible again. A still
  // renders on demand, so its deadline always counts.
  const canRender = visible || still;
  useEffect(() => {
    if (!canRender) return undefined;
    const timer = window.setTimeout(() => {
      if (!reported.current) onFail();
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [onFail, canRender]);

  const handleFirst = useCallback(() => {
    reported.current = true;
    onReady();
  }, [onReady]);

  return (
    <div ref={wrapRef} className={styles.sceneWrap} aria-hidden="true">
      <Canvas
        flat
        frameloop={frameloop}
        dpr={dpr}
        camera={{ fov: FOV, near: 0.5, far: 140, position: [1, 2, 12.5] }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ touchAction: 'pan-y' }}
      >
        <color attach="background" args={[BG]} />
        <World still={still} onFirstFrame={handleFirst} onLost={onLost} />
        <EffectComposer multisampling={dpr >= 1.5 ? 2 : 4}>
          <Bloom
            intensity={0.42}
            luminanceThreshold={0.66}
            luminanceSmoothing={0.14}
            radius={0.38}
            mipmapBlur
          />
          <ToneMapping mode={TONE_NEUTRAL} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
