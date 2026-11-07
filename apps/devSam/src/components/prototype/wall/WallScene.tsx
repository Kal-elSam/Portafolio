/* eslint-disable react/no-unknown-property -- react-three-fiber JSX props */
/* eslint-disable no-param-reassign -- three.js objects are mutated by design */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { metaLine } from '../map/data';
import Environment from '../scene3d/Environment';
import { arcPoint, KEYS, POSES, R, roleWeight } from './layout';
import { screenById, SCREENS } from './screens';
import { wallStore } from './store';
import { HERO_COUNT, WallTextures } from './textures';

import type { MapProject } from '../map/data';
import type { Key, Pose } from './layout';
import type { Screen } from './screens';

import styles from './wall.module.css';

const BG = '#06080a';
const ACID = '#c8ff2e';
/** Brightness of a screen: far from the stop, a supporting one, the lead. */
const LEVEL = { far: 0.13, support: 0.72, lead: 0.96 };
const FOV = 26;
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const BEZEL = 0.03;
/** Mip bias for screens: slightly sharper than trilinear, held by anisotropy. */
const MIP_BIAS = -0.45;
/** Pixel budget of the canvas: supersampling stops at this many pixels. */
const PIXEL_BUDGET = 4_600_000;

type ShaderParams = Parameters<THREE.Material['onBeforeCompile']>[0];

/** Samples the screen texture with a negative LOD bias, with a soft vignette. */
const sharpen = (shader: ShaderParams) => {
  // eslint-disable-next-line no-param-reassign
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <map_fragment>',
    `#ifdef USE_MAP
      vec4 sampledDiffuseColor = texture2D( map, vMapUv, ${MIP_BIAS.toFixed(
        2
      )} );
      diffuseColor *= sampledDiffuseColor;
      vec2 vq = vMapUv * 2.0 - 1.0;
      diffuseColor.rgb *= 1.0 - 0.15 * smoothstep(0.6, 1.5, length(vq));
    #endif`
  );
};

const ACID_COLOR = new THREE.Color(ACID);

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Quality = { dpr: number; narrow: boolean; fullSize: boolean };

const pickQuality = (): Quality => {
  const w = window.innerWidth;
  const ratio = window.devicePixelRatio || 1;
  const narrow = w < 900;
  // Supersample: DPR 1 screens render at 1.5x and are downsampled, so the
  // minified screens keep their edges. The budget caps large displays.
  const wanted = narrow
    ? Math.max(1.35, Math.min(ratio, 1.75))
    : Math.max(1.6, Math.min(ratio, 2));
  const area = w * window.innerHeight;
  return {
    narrow,
    fullSize: w >= 768,
    dpr: Math.max(1, Math.min(wanted, Math.sqrt(PIXEL_BUDGET / area))),
  };
};

/* ---------- camera rig ---------- */

type Rig = {
  u: number;
  ty: number;
  alpha: number;
  dist: number;
  lift: number;
  px: number;
  py: number;
};

/** Distance at which the stop's span fits the free region of the stage. */
const distFor = (stop: Key, h: number, rw: number, rh: number) =>
  Math.max(
    (stop.spanW * h) / (2 * TAN * rw),
    (stop.spanH * h) / (2 * TAN * rh)
  );

function CameraRig({ onFirstFrame }: { onFirstFrame: () => void }) {
  const { camera, size, invalidate } = useThree();
  const cur = useRef<Rig | null>(null);
  const first = useRef(true);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const w = size.width;
    const h = size.height;
    const rLeft = Math.min(wallStore.regionLeft, w * 0.7);
    const rTop = Math.min(wallStore.regionTop, h * 0.7);
    const rw = Math.max(200, w - rLeft);
    const rh = Math.max(200, h - rTop);

    const f = wallStore.progress * (KEYS.length - 1);
    const i = Math.min(KEYS.length - 2, Math.floor(f));
    const t = smooth(0, 1, f - i);
    const a = KEYS[i];
    const b = KEYS[i + 1];
    const da = distFor(a, h, rw, rh);
    const db = distFor(b, h, rw, rh);
    const swing = a.group === b.group ? 0 : Math.sin(Math.PI * t);
    const target: Rig = {
      u: a.u + (b.u - a.u) * t,
      ty: a.ty + (b.ty - a.ty) * t,
      alpha: a.alpha + (b.alpha - a.alpha) * t,
      // The flight through depth: the camera backs off between stops and
      // closes in on each one, so every move crosses the layers of the wall.
      dist: (da + (db - da) * t) * (1 + 0.34 * swing),
      lift: a.lift + (b.lift - a.lift) * t,
      px: wallStore.pointerX,
      py: wallStore.pointerY,
    };

    if (!cur.current) cur.current = { ...target };
    const c = cur.current;
    const k = first.current ? 1 : 1 - Math.exp(-delta * 5.5);
    const kp = first.current ? 1 : 1 - Math.exp(-delta * 3);
    let moving = 0;
    (['u', 'ty', 'alpha', 'dist', 'lift'] as const).forEach((key) => {
      const d = target[key] - c[key];
      moving = Math.max(moving, Math.abs(d));
      c[key] += d * k;
    });
    (['px', 'py'] as const).forEach((key) => {
      const d = target[key] - c[key];
      moving = Math.max(moving, Math.abs(d) * 0.4);
      c[key] += d * kp;
    });

    const at = arcPoint(c.u);
    const psi = -c.u / R + c.alpha;
    const sin = Math.sin(psi);
    const cos = Math.cos(psi);
    // Damped pointer parallax: the camera slides and rises while it keeps
    // looking at the wall, so layers at different depths shift by different
    // amounts (real parallax, scaled with the distance).
    const slide = c.px * 0.17 * c.dist;
    const rise = -c.py * 0.07 * c.dist;
    cam.position.set(
      at.x + sin * c.dist + cos * slide,
      c.ty + c.lift + rise,
      at.z + cos * c.dist - sin * slide
    );
    look.set(at.x, c.ty, at.z);
    cam.lookAt(look);
    cam.fov = FOV;
    cam.near = 1;
    cam.far = 120;
    // Centre the scene in the free region of the stage.
    const cx = rLeft + rw / 2;
    const cy = rTop + rh / 2;
    cam.setViewOffset(w, h, -(cx - w / 2), -(cy - h / 2), w, h);
    cam.updateProjectionMatrix();

    if (moving > 0.0015) invalidate();
    if (first.current) {
      first.current = false;
      onFirstFrame();
    }
  }, -1);

  return null;
}

/* ---------- panels ---------- */

function useGlowTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.55, 'rgba(255,255,255,0.35)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

type PanelProps = {
  screen: Screen;
  pose: Pose;
  textures: WallTextures;
  glowTexture: THREE.Texture;
  version: number;
  onOpen: (project: MapProject) => void;
};

function Panel({
  screen,
  pose,
  textures,
  glowTexture,
  version,
  onOpen,
}: PanelProps) {
  const { invalidate, gl } = useThree();
  const group = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const frameMat = useRef<THREE.MeshBasicMaterial>(null);
  const state = useRef({ lift: 0, dim: 0, edge: 0 });
  const centre = useMemo(() => new THREE.Vector3(), []);
  const edge = useMemo(() => new THREE.Vector3(), []);
  const entry = textures.get(screen.id);

  const bodyGeo = useMemo(
    () => new THREE.BoxGeometry(pose.w + BEZEL * 2, pose.h + BEZEL * 2, 0.06),
    [pose.w, pose.h]
  );
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(bodyGeo), [bodyGeo]);
  // A thin acid frame around the active screen (a plane with a hole).
  const frameGeo = useMemo(() => {
    const hw = pose.w / 2 + BEZEL;
    const hh = pose.h / 2 + BEZEL;
    const t = 0.013;
    const outer = new THREE.Shape();
    outer.moveTo(-hw, -hh);
    outer.lineTo(hw, -hh);
    outer.lineTo(hw, hh);
    outer.lineTo(-hw, hh);
    outer.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-hw + t, -hh + t);
    hole.lineTo(-hw + t, hh - t);
    hole.lineTo(hw - t, hh - t);
    hole.lineTo(hw - t, -hh + t);
    hole.closePath();
    outer.holes.push(hole);
    return new THREE.ShapeGeometry(outer);
  }, [pose.w, pose.h]);
  useEffect(
    () => () => {
      bodyGeo.dispose();
      edgeGeo.dispose();
      frameGeo.dispose();
    },
    [bodyGeo, edgeGeo, frameGeo]
  );

  useFrame(({ camera, size }, delta) => {
    const g = group.current;
    if (!g) return;
    const s = state.current;
    const f = wallStore.progress * (KEYS.length - 1);
    const hovered = wallStore.active === screen.id;
    const { set, lead } = roleWeight(f, screen.id);
    // Screens never sit behind the copy: the left edge of the panel must clear
    // the copy column (wide layouts) and the bottom edge the active block
    // (stacked layouts), or the panel fades out completely.
    const half = pose.w / 2;
    const ax = Math.cos(pose.yaw);
    const az = -Math.sin(pose.yaw);
    const px = pose.x + pose.nx * s.lift;
    const pz = pose.z + pose.nz * s.lift;
    edge.set(px - ax * half, pose.y, pz - az * half).project(camera);
    const sxLeft = (edge.x * 0.5 + 0.5) * size.width;
    edge.set(px, pose.y - pose.h / 2, pz).project(camera);
    const syBottom = (-edge.y * 0.5 + 0.5) * size.height;
    centre.set(px, pose.y, pz).project(camera);
    const fadeX =
      wallStore.copyRight > 0
        ? smooth(wallStore.copyRight - 40, wallStore.copyRight + 30, sxLeft)
        : 1;
    const fadeY =
      wallStore.regionTop > 0
        ? smooth(wallStore.regionTop, wallStore.regionTop + 70, syBottom)
        : 1;
    const fade = fadeX * fadeY;
    // Layers behind the focal plane sit a little darker: depth reads. The
    // set piece in view is lit, its lead the most; the rest of the wall waits
    // in the dark.
    const depth = Math.min(1, Math.max(0.74, 1 + 0.06 * pose.dz));
    const support = LEVEL.support * depth;
    const level =
      LEVEL.far + set * (support - LEVEL.far + lead * (LEVEL.lead - support));
    const targetDim = hovered ? fade * LEVEL.lead : level * fade;
    const targetEdge = Math.max(hovered ? 1 : 0, lead) * fade;
    const targetLift = hovered ? pose.lift : 0;
    const k = 1 - Math.exp(-delta * 9);
    const dl = targetLift - s.lift;
    const dd = targetDim - s.dim;
    const de = targetEdge - s.edge;
    s.lift += dl * k;
    s.dim += dd * k;
    s.edge += de * k;
    g.position.set(
      pose.x + pose.nx * s.lift,
      pose.y,
      pose.z + pose.nz * s.lift
    );
    const sc = 1 + 0.03 * (s.lift / pose.lift);
    g.scale.set(sc, sc, sc);
    g.visible = s.dim > 0.03;
    screenMat.current?.color.setScalar(s.dim);
    // Acid-tinted spill behind the screen, strongest on the lead and on hover.
    if (glowMat.current) {
      glowMat.current.opacity =
        (0.07 * set + (hovered ? 0.34 : 0.2) * s.edge) * Math.min(1, fade);
    }
    if (frameMat.current) frameMat.current.opacity = 0.9 * s.edge;
    if (frameMat.current) frameMat.current.visible = s.edge > 0.02;
    if (Math.abs(dl) > 0.004 || Math.abs(dd) > 0.004 || Math.abs(de) > 0.004) {
      invalidate();
    }
  });

  // Re-run when textures arrive.
  const map = entry?.map ?? null;
  useEffect(() => {
    if (screenMat.current) {
      screenMat.current.map = map;
      screenMat.current.needsUpdate = true;
    }
    if (glowMat.current && entry) {
      glowMat.current.color.copy(entry.glow).lerp(ACID_COLOR, 0.72);
    }
    invalidate();
  }, [map, version, entry, invalidate]);

  if (!entry || entry.failed || !map) return null;

  return (
    <group
      ref={group}
      position={[pose.x, pose.y, pose.z]}
      rotation={[0, pose.yaw, 0]}
    >
      <mesh position={[0, 0, -0.032]} geometry={bodyGeo} castShadow={false}>
        <meshStandardMaterial
          color="#0c0f0e"
          metalness={0.85}
          roughness={0.34}
        />
      </mesh>
      <lineSegments position={[0, 0, -0.032]} geometry={edgeGeo}>
        <lineBasicMaterial color="#cfd9c8" transparent opacity={0.22} />
      </lineSegments>
      <mesh position={[0, 0, 0.012]} geometry={frameGeo}>
        <meshBasicMaterial
          ref={frameMat}
          color={ACID}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          fog={false}
        />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[pose.w * 1.4, pose.h * 1.55]} />
        <meshBasicMaterial
          ref={glowMat}
          map={glowTexture}
          color={entry.glow}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          fog={false}
        />
      </mesh>
      <mesh
        position={[0, 0, 0.002]}
        onPointerOver={(event) => {
          event.stopPropagation();
          wallStore.setActive(screen.id);
          gl.domElement.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (wallStore.active === screen.id) wallStore.setActive(null);
          gl.domElement.style.cursor = '';
        }}
        onClick={(event) => {
          event.stopPropagation();
          onOpen(screen.project);
        }}
      >
        <planeGeometry args={[pose.w, pose.h]} />
        <meshBasicMaterial
          ref={screenMat}
          map={map}
          toneMapped={false}
          fog
          onBeforeCompile={sharpen}
        />
      </mesh>
    </group>
  );
}

/* ---------- DOM tooltip projected from the active panel ---------- */

function Projector({ tipRef }: { tipRef: { current: HTMLElement | null } }) {
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }) => {
    const tip = tipRef.current;
    const id = wallStore.active;
    if (!tip || !id) return;
    const pose = POSES[id];
    if (!pose) return;
    // The panel's top edge, where it sits after the forward move.
    v.set(
      pose.x + pose.nx * pose.lift,
      pose.y + pose.h / 2 + 0.08,
      pose.z + pose.nz * pose.lift
    ).project(camera);
    const px = (v.x * 0.5 + 0.5) * size.width;
    const py = (-v.y * 0.5 + 0.5) * size.height;
    const wd = tip.offsetWidth;
    const ht = tip.offsetHeight;
    const x = Math.min(Math.max(px - wd / 2, 8), size.width - wd - 8);
    const above = py - ht - 12 > 8;
    const y = above ? py - ht - 12 : Math.min(py + 24, size.height - ht - 8);
    tip.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(
      1
    )}px, 0)`;
  });

  return null;
}

function Tip({ tipRef }: { tipRef: { current: HTMLElement | null } }) {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setId(wallStore.active);
    sync();
    return wallStore.subscribe(sync);
  }, []);
  const project = id ? screenById(id)?.project : undefined;
  const hasScreen = Boolean(project);
  return (
    <div
      ref={(el) => {
        tipRef.current = el;
      }}
      className={styles.tip}
      data-open={project && hasScreen ? '1' : '0'}
      aria-hidden="true"
    >
      {project && (
        <>
          <p className={styles.tipName}>{project.name}</p>
          <p className={styles.tipBlurb}>{project.blurb}</p>
          <p className={styles.tipMeta}>{metaLine(project)}</p>
        </>
      )}
    </div>
  );
}

/* ---------- scene ---------- */

type Probe = { gpuMB: number; fullCount: number; loaded: number };

declare global {
  interface Window {
    wallProbe?: { probe: () => Probe };
  }
}

type WallSceneProps = {
  ready: boolean;
  onReady: () => void;
  onFail: () => void;
};

function Panels({
  onOpen,
  onLoaded,
  fullSize,
  fontFamily,
}: {
  onOpen: (p: MapProject) => void;
  onLoaded: (count: number, hero: number) => void;
  fullSize: boolean;
  fontFamily: string;
}) {
  const { gl, invalidate } = useThree();
  const [version, setVersion] = useState(0);
  const glowTexture = useGlowTexture();
  const textures = useMemo(
    () =>
      new WallTextures(gl.capabilities.getMaxAnisotropy(), () =>
        setVersion((v) => v + 1)
      ),
    [gl]
  );

  useEffect(() => {
    textures.start(fullSize, fontFamily);
    window.wallProbe = {
      probe: () => {
        let fullCount = 0;
        let loaded = 0;
        SCREENS.forEach((s) => {
          const e = textures.get(s.id);
          if (e?.map) loaded += 1;
          if (e?.full) fullCount += 1;
        });
        return { gpuMB: textures.gpuMB(), fullCount, loaded };
      },
    };
    return () => {
      textures.dispose();
      delete window.wallProbe;
    };
    // fullSize and fontFamily are read once, at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textures]);

  useEffect(() => {
    let loaded = 0;
    let hero = 0;
    SCREENS.forEach((s) => {
      const e = textures.get(s.id);
      if (e?.map) loaded += 1;
      if (e?.full && s.priority < HERO_COUNT) hero += 1;
    });
    onLoaded(loaded, hero);
    invalidate();
  }, [version, textures, onLoaded, invalidate]);

  return (
    <>
      {SCREENS.map((screen) => (
        <Panel
          key={screen.id}
          screen={screen}
          pose={POSES[screen.id]}
          textures={textures}
          glowTexture={glowTexture}
          version={version}
          onOpen={onOpen}
        />
      ))}
    </>
  );
}

export default function WallScene({ ready, onReady, onFail }: WallSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLElement | null>(null);
  const [quality, setQuality] = useState(pickQuality);
  const [visible, setVisible] = useState(true);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [firstFrame, setFirstFrame] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [heroFull, setHeroFull] = useState(0);
  const [grace, setGrace] = useState(false);
  const reported = useRef(false);

  useEffect(() => {
    const onResize = () => setQuality(pickQuality());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return undefined;
    const raw = getComputedStyle(node).getPropertyValue('--font-proto-mono');
    setFontFamily(raw.trim() || 'ui-monospace, monospace');
    const io = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) wallStore.invalidate();
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Ready when the first panels are on screen; failed when nothing loads.
  useEffect(() => {
    if (!firstFrame || reported.current) return;
    // Show the wall when the hero screens are sharp, or after a short grace
    // period once the small derivatives are in (slow connections).
    if (
      loaded >= Math.min(6, SCREENS.length) &&
      (heroFull >= HERO_COUNT || grace)
    ) {
      reported.current = true;
      onReady();
    }
  }, [firstFrame, loaded, heroFull, grace, onReady]);

  useEffect(() => {
    const timer = window.setTimeout(() => setGrace(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!reported.current) onFail();
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [onFail]);

  const open = useCallback((p: MapProject) => {
    // No public destination: nothing to open.
    if (p.href) window.open(p.href, '_blank', 'noopener,noreferrer');
  }, []);

  const handleFirst = useCallback(() => setFirstFrame(true), []);
  const handleLoaded = useCallback((n: number, hero: number) => {
    setLoaded(n);
    setHeroFull(hero);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={styles.sceneWrap}
      data-ready={ready ? '1' : '0'}
      aria-hidden="true"
    >
      <Canvas
        flat
        frameloop={visible ? 'demand' : 'never'}
        dpr={quality.dpr}
        camera={{ fov: FOV, near: 1, far: 120, position: [0, 3, 30] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ touchAction: 'pan-y' }}
        onCreated={({ gl, invalidate }) => {
          wallStore.invalidate = invalidate;
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            onFail();
          });
        }}
      >
        <fog attach="fog" args={[BG, 26, 76]} />
        <Environment />
        <ambientLight intensity={0.1} />
        <directionalLight
          position={[-6, 14, 22]}
          intensity={2.2}
          color="#e8eef2"
        />
        <directionalLight
          position={[10, 4, 14]}
          intensity={1.2}
          color="#cfe0f2"
        />
        {fontFamily && (
          <Panels
            onOpen={open}
            onLoaded={handleLoaded}
            fullSize={quality.fullSize}
            fontFamily={fontFamily}
          />
        )}
        <CameraRig onFirstFrame={handleFirst} />
        <Projector tipRef={tipRef} />
      </Canvas>
      <Tip tipRef={tipRef} />
    </div>
  );
}
