/* eslint-disable react/no-unknown-property -- react-three-fiber JSX props */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { gsap } from '../gsap';
import { BACKDROP, MAX_LIFT, PIECES, UNIT, WIN } from './pieces';
import {
  BACKDROP_FRAG,
  FLAT_VERT,
  GLOW_FRAG,
  PIECE_FRAG,
  PIECE_VERT,
  SHADOW_FRAG,
} from './shaders';
import { layersStore, PHASE } from './store';
import { disposeTextures, loadTextures } from './textures';

import type { PieceDef } from './pieces';
import type { TextureMap } from './textures';

import styles from './layers.module.css';

const BG = '#06080a';
const FOV = 30;
const CAMERA_Z = 30;
/** Middle of the open stack: the whole stack turns about this depth. */
const Z_MID = 2.1;
const PIXEL_BUDGET = 3_000_000;
const MAX_KIDS = 12;
const scratch = new THREE.Vector3();

type LayersSceneProps = {
  ready: boolean;
  onReady: () => void;
  onFail: () => void;
};

/* ---------- helpers ---------- */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const pickDpr = () => {
  const ratio = window.devicePixelRatio || 1;
  // DPR 1 screens render at 1.5x and are downsampled, so small text keeps its
  // edges; the pixel budget caps large displays.
  const wanted = Math.max(1.5, Math.min(ratio, 2));
  const area = window.innerWidth * window.innerHeight;
  return Math.max(1, Math.min(wanted, Math.sqrt(PIXEL_BUDGET / area)));
};

/* ---------- runtime structures ---------- */

type PieceRT = {
  def: PieceDef;
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  receiver: THREE.Mesh | null;
  recMat: THREE.ShaderMaterial | null;
  kids: PieceRT[];
  cx: number;
  cy: number;
  w: number;
  h: number;
  scatter: THREE.Vector3;
  spin: THREE.Vector3;
  anim: { ent: number; reveal: number };
  entered: boolean;
  hasTexture: boolean;
  pos: THREE.Vector3;
  alpha: number;
  rank: number;
};

type BackdropRT = {
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  base: THREE.Vector3;
  width: number;
  anim: { fade: number };
  hasTexture: boolean;
  phase: number;
};

type World = {
  group: THREE.Group;
  pieces: PieceRT[];
  backdrop: BackdropRT[];
  glow: THREE.Mesh;
  glowMat: THREE.ShaderMaterial;
  geometry: THREE.PlaneGeometry;
  textures: TextureMap;
};

/** Where the backdrop screens sit, far behind the stack. */
const BACKDROP_PLACES = [
  { x: -17.5, y: 7.2, z: -15, w: 15 },
  { x: 16.5, y: 8.4, z: -19, w: 19 },
  { x: -15, y: -11.5, z: -18, w: 20 },
  { x: 22, y: -5.5, z: -13, w: 13 },
  { x: -24, y: -5, z: -20, w: 17 },
  { x: 3, y: 14.5, z: -25, w: 21 },
] as const;

const piecePosition = (def: PieceDef) => {
  const [x, y, w, h] = def.rect;
  return {
    cx: (x + w / 2 - WIN.w / 2) / UNIT,
    cy: -(y + h / 2 - WIN.h / 2) / UNIT,
    w: w / UNIT,
    h: h / UNIT,
  };
};

const buildWorld = (): World => {
  const group = new THREE.Group();
  group.rotation.order = 'YXZ';
  const geometry = new THREE.PlaneGeometry(1, 1);
  const textures: TextureMap = new Map();

  // Painter's order: parents always sit below their children, so rank by lift.
  const ranked = [...PIECES].sort((a, b) => a.lift - b.lift);
  const pieces: PieceRT[] = PIECES.map((def, index) => {
    const { cx, cy, w, h } = piecePosition(def);
    const mat = new THREE.ShaderMaterial({
      vertexShader: PIECE_VERT,
      fragmentShader: PIECE_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uMap: { value: null },
        uCenter: { value: new THREE.Vector2(cx, cy) },
        uSize: { value: new THREE.Vector2(def.rect[2], def.rect[3]) },
        uRadius: { value: def.radius },
        uOpacity: { value: 0 },
        uOpen: { value: 1 },
        uShade: { value: 1 },
        uReveal: { value: def.plot ? 0 : 1 },
        uPlot: { value: def.plot ? 1 : 0 },
        uTravel: { value: -20 },
        uTravelAmp: { value: 1 },
        uLightPos: { value: new THREE.Vector2() },
      },
    });
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.scale.set(w, h, 1);
    mesh.visible = false;
    const rank = ranked.indexOf(def);
    mesh.frustumCulled = false;
    group.add(mesh);
    const isPlate = def.id === 'plate';
    return {
      def,
      mesh,
      mat,
      receiver: null,
      recMat: null,
      kids: [],
      cx,
      cy,
      w,
      h,
      scatter: isPlate
        ? new THREE.Vector3(0, -1.2, -5)
        : new THREE.Vector3(
            (rnd(index) - 0.5) * 17,
            (rnd(index + 9) - 0.4) * 9,
            -5 + rnd(index + 17) * 10
          ),
      spin: new THREE.Vector3(
        (rnd(index + 3) - 0.5) * 1.3,
        (rnd(index + 5) - 0.5) * 1.6,
        (rnd(index + 7) - 0.5) * 0.9
      ),
      anim: { ent: 0, reveal: 0 },
      entered: false,
      hasTexture: false,
      pos: new THREE.Vector3(),
      alpha: 0,
      rank,
    };
  });

  // Shadow receivers: one per piece that carries other pieces.
  pieces.forEach((rt) => {
    const kids = pieces.filter((o) => o.def.parent === rt.def.id);
    if (!kids.length) return;
    const holder = rt;
    holder.kids = kids;
    holder.recMat = new THREE.ShaderMaterial({
      vertexShader: FLAT_VERT,
      fragmentShader: SHADOW_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uSize: { value: new THREE.Vector2(rt.def.rect[2], rt.def.rect[3]) },
        uRadius: { value: rt.def.radius },
        uStrength: { value: 1 },
        uDir: { value: new THREE.Vector2(0.55, -0.82) },
        uCount: { value: kids.length },
        uRect: {
          value: Array.from({ length: MAX_KIDS }, () => new THREE.Vector4()),
        },
        uInfo: {
          value: Array.from({ length: MAX_KIDS }, () => new THREE.Vector4()),
        },
      },
    });
    holder.receiver = new THREE.Mesh(geometry, holder.recMat);
    holder.receiver.renderOrder = rt.mesh.renderOrder + 1;
    holder.receiver.frustumCulled = false;
    holder.mesh.add(holder.receiver);
  });
  // Receivers sit between a parent and its children in the sort order.
  pieces.forEach((rt) => {
    const holder = rt;
    holder.mesh.renderOrder = rt.rank * 2 + (rt.def.id === 'plate' ? 0 : 1);
    if (holder.receiver) {
      holder.receiver.renderOrder = holder.mesh.renderOrder + 0.5;
    }
  });

  const backdrop: BackdropRT[] = BACKDROP.map((b, i) => {
    const place = BACKDROP_PLACES[i];
    const mat = new THREE.ShaderMaterial({
      vertexShader: FLAT_VERT,
      fragmentShader: BACKDROP_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uMap: { value: null },
        uOpacity: { value: 0 },
        uDist: { value: 40 },
      },
    });
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.visible = false;
    mesh.renderOrder = -30 + i;
    mesh.frustumCulled = false;
    group.add(mesh);
    return {
      mesh,
      mat,
      base: new THREE.Vector3(place.x, place.y, place.z),
      width: place.w,
      anim: { fade: 0 },
      hasTexture: false,
      phase: i * 1.7,
    };
  });

  const glowMat = new THREE.ShaderMaterial({
    vertexShader: FLAT_VERT,
    fragmentShader: GLOW_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uStrength: { value: 0 } },
  });
  const glow = new THREE.Mesh(geometry, glowMat);
  glow.renderOrder = -10;
  glow.scale.set(30, 17, 1);
  glow.position.set(0, 0, -3);
  glow.frustumCulled = false;
  group.add(glow);

  return { group, pieces, backdrop, glow, glowMat, geometry, textures };
};

const disposeWorld = (world: World) => {
  world.pieces.forEach((rt) => {
    gsap.killTweensOf(rt.anim);
    rt.mat.dispose();
    rt.recMat?.dispose();
  });
  world.backdrop.forEach((b) => {
    gsap.killTweensOf(b.anim);
    b.mat.dispose();
  });
  world.glowMat.dispose();
  world.geometry.dispose();
  disposeTextures(world.textures);
};

/* ---------- the rig ---------- */

type RigProps = {
  ready: boolean;
  onLoaded: () => void;
  onFirstFrame: () => void;
  onFail: () => void;
};

const CORE = PIECES.filter((p) => p.priority <= 2).map((p) => p.id);

function Rig({ ready, onLoaded, onFirstFrame, onFail }: RigProps) {
  const { gl, camera, size } = useThree();
  const world = useMemo(buildWorld, []);
  const readyRef = useRef(ready);
  const first = useRef(false);
  const dyn = useRef({
    sp: 0,
    px: 0,
    py: 0,
    lastX: 0,
    lastY: 0,
    energy: 0,
  });

  const enter = useCallback(
    (rt: PieceRT, order: number, late: boolean) => {
      if (rt.entered) return;
      const holder = rt;
      holder.entered = true;
      const isPlate = rt.def.id === 'plate';
      gsap.to(rt.anim, {
        ent: 1,
        duration: isPlate ? 1.2 : 1.7,
        delay: late ? 0.05 : 0.15 + order * 0.05,
        ease: 'power3.out',
      });
      if (rt.def.plot) {
        // The chart wipes in on the real pixels once its pane has landed.
        gsap.to(rt.anim, {
          reveal: 1,
          duration: 1.2,
          delay: (late ? 0.05 : 0.15 + order * 0.05) + 1.05,
          ease: 'power2.inOut',
        });
      }
    },
    []
  );

  const startEntrance = useCallback(
    (late: boolean) => {
      const order = [...world.pieces].sort((a, b) => a.rank - b.rank);
      order.forEach((rt, i) => {
        if (rt.hasTexture) enter(rt, i, late);
      });
    },
    [enter, world]
  );

  // Textures: progressive, in priority order; the first group is the plate.
  useEffect(() => {
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    const cancel = loadTextures(
      aniso,
      world.textures,
      (key) => {
        if (key.startsWith('bg:')) {
          const i = BACKDROP.findIndex((b) => `bg:${b.id}` === key);
          const rt = world.backdrop[i];
          const tex = world.textures.get(key);
          if (!rt || !tex) return;
          const img = tex.image as HTMLImageElement;
          rt.mat.uniforms.uMap.value = tex;
          rt.mesh.scale.set(rt.width, (rt.width * img.height) / img.width, 1);
          rt.hasTexture = true;
          rt.mesh.visible = true;
          gsap.to(rt.anim, { fade: 1, duration: 2.2, ease: 'power2.out' });
          return;
        }
        const rt = world.pieces.find((p) => p.def.id === key);
        const tex = world.textures.get(key);
        if (!rt || !tex) return;
        rt.mat.uniforms.uMap.value = tex;
        rt.hasTexture = true;
        rt.mesh.visible = true;
        if (readyRef.current) startEntrance(true);
        if (CORE.every((id) => world.textures.has(id))) onLoaded();
      },
      (key) => {
        if (key === 'plate') onFail();
      }
    );
    return cancel;
  }, [gl, onFail, onLoaded, startEntrance, world]);

  useEffect(() => {
    readyRef.current = ready;
    if (ready) startEntrance(false);
  }, [ready, startEntrance]);

  useEffect(() => {
    const dom = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFail();
    };
    dom.addEventListener('webglcontextlost', lost);
    return () => dom.removeEventListener('webglcontextlost', lost);
  }, [gl, onFail]);

  useEffect(() => () => disposeWorld(world), [world]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const d = dyn.current;
    const k = (rate: number) => 1 - Math.exp(-rate * dt);

    d.sp += (layersStore.progress - d.sp) * k(7);
    d.px += (layersStore.pointerX - d.px) * k(4);
    d.py += (layersStore.pointerY - d.py) * k(4);
    const speed =
      Math.hypot(layersStore.pointerX - d.lastX, layersStore.pointerY - d.lastY) /
      Math.max(dt, 1e-3);
    d.lastX = layersStore.pointerX;
    d.lastY = layersStore.pointerY;
    const target = Math.min(1, speed * 0.3);
    d.energy += (target - d.energy) * k(target > d.energy ? 10 : 1.8);

    const t = state.clock.elapsedTime;
    const visH = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const visW = visH * (size.width / size.height);
    const screenW = WIN.w / UNIT;
    const screenH = WIN.h / UNIT;

    const aLin = clamp(
      (d.sp - PHASE.assembleStart) / (PHASE.assembleEnd - PHASE.assembleStart)
    );
    const aG = easeInOut(aLin);
    const open = 1 - aG;
    const exit = smooth(0, 1, clamp((d.sp - PHASE.exitStart) / (1 - PHASE.exitStart)));
    const fade = 1 - smooth(0.4, 1, exit);

    // Group: tilted and right of the copy when open, flat and centred when
    // assembled, then a short rise and recede for the exit.
    const sOpen = Math.min(
      (0.55 * visW) / screenW,
      (0.74 * visH) / screenH
    );
    const sFull = Math.min((0.9 * visW) / screenW, (0.78 * visH) / screenH);
    const s = lerp(sOpen, sFull, aG) * (1 - 0.1 * exit);
    const { group } = world;
    group.scale.setScalar(s);
    group.position.set(
      lerp(visW * 0.158, 0, aG),
      lerp(-visH * 0.01, visH * 0.015, aG) + exit * visH * 0.3,
      -exit * 4
    );
    const idle = Math.sin(t * 0.45) * 0.014 * open;
    group.rotation.set(
      lerp(0.38, 0, aG) - d.py * (0.07 * open + 0.006) + exit * 0.45 + idle,
      lerp(-0.5, 0, aG) + d.px * (0.11 * open + 0.008) + idle * 0.8,
      lerp(0.025, 0, aG)
    );

    const openBoost = 1 + 0.2 * Math.hypot(d.px, d.py) * 0.7 + 0.3 * d.energy;
    const lightX = d.px * 8.5;
    const lightY = -d.py * 3.8;

    const sweep = (t * 0.085) % 1.3;
    const travelIdle = -12 + sweep * 24;
    const travel = lerp(travelIdle, -11 + 22 * aLin, smooth(0, 0.05, aLin));
    const travelAmp = 1 - smooth(0.82, 1, aLin);

    world.pieces.forEach((piece) => {
      const rt = piece;
      const { def, mesh, mat } = rt;
      if (!rt.hasTexture) return;
      const tp = clamp(aLin / (1 - 0.3 * (1 - def.lift / MAX_LIFT)));
      const e = easeInOut(tp);
      const o = 1 - e;
      const lift = def.lift * o * openBoost;
      const inv = 1 - rt.anim.ent;
      // Entrance: pieces fly in from scattered positions, turning as they land.
      const inEase = inv * inv;
      rt.pos.set(
        rt.cx + def.drift[0] * o * openBoost + d.px * 0.17 * def.lift * o +
          rt.scatter.x * inEase,
        rt.cy + def.drift[1] * o * openBoost - d.py * 0.1 * def.lift * o +
          rt.scatter.y * inEase,
        lift - Z_MID * open + rt.scatter.z * inEase
      );
      mesh.position.copy(rt.pos);
      mesh.rotation.set(
        rt.spin.x * inEase,
        rt.spin.y * inEase,
        rt.spin.z * inEase
      );
      rt.alpha = smooth(0, 0.4, rt.anim.ent) * fade;
      const u = mat.uniforms;
      u.uOpacity.value = rt.alpha;
      u.uOpen.value = o;
      u.uShade.value = 1 - 0.5 * (1 - def.lift / MAX_LIFT) * o;
      u.uReveal.value = rt.anim.reveal;
      u.uTravel.value = travel;
      u.uTravelAmp.value = travelAmp;
      u.uLightPos.value.set(lightX, lightY);
    });

    // Soft shadows: each parent receives its children's shadows, offset by how
    // far the child hovers above it.
    world.pieces.forEach((rt) => {
      if (!rt.recMat || !rt.hasTexture) return;
      const u = rt.recMat.uniforms;
      const rects = u.uRect.value as THREE.Vector4[];
      const infos = u.uInfo.value as THREE.Vector4[];
      let n = 0;
      rt.kids.forEach((kid) => {
        if (!kid.hasTexture || n >= MAX_KIDS) return;
        const dx = (kid.pos.x - rt.pos.x) * UNIT;
        const dy = (kid.pos.y - rt.pos.y) * UNIT;
        rects[n].set(dx, dy, kid.def.rect[2] / 2, kid.def.rect[3] / 2);
        infos[n].set(kid.pos.z - rt.pos.z, kid.def.radius, kid.alpha, 0);
        n += 1;
      });
      u.uCount.value = n;
      u.uStrength.value = rt.alpha;
      u.uDir.value.set(0.55 + d.px * 0.3, -0.82).normalize();
    });

    // Backdrop screens: slow drift, shallow parallax, receding as it closes.
    world.backdrop.forEach((item, i) => {
      const b = item;
      if (!b.hasTexture) return;
      const depth = Math.abs(b.base.z) / 20;
      b.mesh.position.set(
        b.base.x + Math.sin(t * 0.06 + b.phase) * 0.5 - d.px * 1.6 * depth,
        b.base.y + Math.cos(t * 0.05 + b.phase) * 0.35 + d.py * 1.0 * depth,
        b.base.z - aG * 3 - exit * 6
      );
      b.mesh.rotation.y = (i % 2 === 0 ? 0.22 : -0.22) + d.px * 0.03;
      b.mesh.updateWorldMatrix(true, false);
      const dist = camera.position.distanceTo(
        scratch.setFromMatrixPosition(b.mesh.matrixWorld)
      );
      const u = b.mat.uniforms;
      u.uDist.value = dist;
      u.uOpacity.value = b.anim.fade * 0.85 * fade * (0.8 + 0.2 * open);
    });

    // Focus glow: faint while open, a little stronger once assembled.
    world.glowMat.uniforms.uStrength.value =
      (0.04 + 0.07 * aG * (1 - smooth(0.6, 1, exit))) * smooth(0, 1, world.pieces[0].anim.ent) * fade;

    if (!first.current && world.pieces[0].hasTexture) {
      first.current = true;
      onFirstFrame();
    }
  });

  return <primitive object={world.group} />;
}

/* ---------- the canvas ---------- */

export default function LayersScene({
  ready,
  onReady,
  onFail,
}: LayersSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(pickDpr);
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [firstFrame, setFirstFrame] = useState(false);
  const [grace, setGrace] = useState(false);
  const reported = useRef(false);

  useEffect(() => {
    const onResize = () => setDpr(pickDpr());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting)
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Ready when the main pieces are on the GPU and a frame has been drawn; on a
  // slow connection, show what exists after a short grace period.
  useEffect(() => {
    if (reported.current || !firstFrame) return;
    if (loaded || grace) {
      reported.current = true;
      onReady();
    }
  }, [firstFrame, loaded, grace, onReady]);

  useEffect(() => {
    const graceTimer = window.setTimeout(() => setGrace(true), 3500);
    const failTimer = window.setTimeout(() => {
      if (!reported.current) onFail();
    }, 14000);
    return () => {
      window.clearTimeout(graceTimer);
      window.clearTimeout(failTimer);
    };
  }, [onFail]);

  const handleLoaded = useCallback(() => setLoaded(true), []);
  const handleFirst = useCallback(() => setFirstFrame(true), []);

  return (
    <div
      ref={wrapRef}
      className={styles.sceneWrap}
      data-ready={ready ? '1' : '0'}
      aria-hidden="true"
    >
      <Canvas
        flat
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr}
        camera={{ fov: FOV, near: 1, far: 140, position: [0, 0, CAMERA_Z] }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ touchAction: 'pan-y' }}
      >
        <color attach="background" args={[BG]} />
        <Rig
          ready={ready}
          onLoaded={handleLoaded}
          onFirstFrame={handleFirst}
          onFail={onFail}
        />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.75}
            luminanceThreshold={1.02}
            luminanceSmoothing={0.03}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
