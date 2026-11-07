/* eslint-disable react/no-unknown-property -- react-three-fiber JSX props */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { FLAT_VERT, GLOW_FRAG } from '@/components/prototype/layers/shaders';

import { PANELS } from '../ringData';
import { BG, disposeObject, lerp, pickDpr, rnd, smooth } from './common';
import { focus, makeLayout } from './ringMath';
import { ringStore } from './ringStore';
import { RingTextures } from './ringTextures';
import {
  FLOOR_VERT,
  RING_PANEL_FRAG,
  RING_PANEL_VERT,
  ringFloorFrag,
  SKY_FRAG,
  SKY_VERT,
} from './shaders';

import type { Fonts } from './ringTextures';

import styles from '../ring.module.css';

const FOV = 32;
const PIXEL_BUDGET = 4_200_000;

/** World width of an ordinary panel at rest. */
const UNIT = 2.1;
/** Share of a slot left empty between panels, so they never touch. */
const GAP = 0.16;
/** Kairo is wider than the rest: most prominent, first in the ring. */
const HERO_W = 1.3;
const FLOOR_Y = -2.45;
/** How far the front panel steps toward the viewer. */
const PULL = 1.6;
/** Panels within this many slots of the front keep a full-size texture. */
const NEAR = 2.2;
const KEEP = 4.5;

const baseWidth = (kind: string) => (kind === 'terminal' ? HERO_W : 1);

type PanelRT = {
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  dim: number;
  mark: number;
  yOff: number;
};

type RigProps = {
  fonts: Fonts;
  onFirstFrame: () => void;
  onLoaded: (mb: number) => void;
  onLost: () => void;
};

const layout = makeLayout(
  PANELS.map((p) => baseWidth(p.kind) + GAP),
  UNIT
);

function Rig({ fonts, onFirstFrame, onLoaded, onLost }: RigProps) {
  const { gl, scene, camera, invalidate } = useThree();
  const state = useRef({ first: false, px: 0, py: 0, nearKey: '' });

  const world = useMemo(() => {
    const group = new THREE.Group();
    const R = layout.radius;

    const skyMat = new THREE.ShaderMaterial({
      vertexShader: SKY_VERT,
      fragmentShader: SKY_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uBg: { value: new THREE.Color(BG) },
        uTint: { value: new THREE.Color(0.004, 0.007, 0.005) },
      },
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(120, 24, 16), skyMat);
    sky.renderOrder = -10;
    sky.frustumCulled = false;
    group.add(sky);

    const floorMat = new THREE.ShaderMaterial({
      vertexShader: FLOOR_VERT,
      fragmentShader: ringFloorFrag(),
      fog: false,
      uniforms: {
        uBg: { value: new THREE.Color(BG) },
        uRadius: { value: R },
        uRot: { value: 0 },
        uPool: { value: 1 },
        uTicks: { value: layout.total },
      },
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FLOOR_Y;
    group.add(floor);

    const glowMat = new THREE.ShaderMaterial({
      vertexShader: FLAT_VERT,
      fragmentShader: GLOW_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      uniforms: { uStrength: { value: 0.06 } },
    });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMat);
    glow.position.set(0, 0, -(R - PULL) - 0.5);
    glow.scale.set(UNIT * 3.4, UNIT * 2.4, 1);
    group.add(glow);

    const geometry = new THREE.PlaneGeometry(1, 1, 56, 1);
    const panels: PanelRT[] = PANELS.map((panel, i) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: RING_PANEL_VERT,
        fragmentShader: RING_PANEL_FRAG,
        transparent: true,
        fog: false,
        uniforms: {
          uMap: { value: null },
          uHasMap: { value: 0 },
          uSize: { value: new THREE.Vector2(UNIT, UNIT / panel.frame) },
          uBend: { value: R },
          uRadius: { value: 0.06 },
          uLit: { value: 0 },
          uDim: { value: 0 },
          uMark: { value: 0 },
          uImage: { value: panel.kind === 'image' ? 1 : 0 },
          uFit: { value: panel.fit },
          uAspect: { value: panel.frame },
        },
      });
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.frustumCulled = false;
      group.add(mesh);
      return { mesh, mat, dim: 0, mark: 0, yOff: (rnd(i * 4.7) - 0.5) * 1.1 };
    });

    return { group, panels, floorMat, glowMat, sky, geometry };
  }, []);

  const textures = useMemo(() => {
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return new RingTextures(PANELS, anisotropy, fonts, () => {
      onLoaded(textures.gpuMB());
      invalidate();
    });
  }, [fonts, gl, invalidate, onLoaded]);

  useEffect(() => {
    scene.add(world.group);
    return () => {
      scene.remove(world.group);
    };
  }, [scene, world]);

  useEffect(() => {
    ringStore.wake = invalidate;
    return () => {
      ringStore.wake = null;
    };
  }, [invalidate]);

  useEffect(() => {
    textures.start();
    // Full-size textures follow the panel at the front.
    const refresh = () => {
      const near = new Set<string>();
      const keep = new Set<string>();
      PANELS.forEach((panel, i) => {
        const raw = Math.abs(i - ringStore.active);
        const d = Math.min(raw, PANELS.length - raw);
        if (d <= NEAR) near.add(panel.id);
        if (d <= KEEP) keep.add(panel.id);
      });
      textures.want(near, keep);
    };
    refresh();
    ringStore.listeners.add(refresh);
    return () => {
      ringStore.listeners.delete(refresh);
      textures.dispose();
    };
  }, [textures]);

  useEffect(() => {
    const dom = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    dom.addEventListener('webglcontextlost', lost);
    return () => dom.removeEventListener('webglcontextlost', lost);
  }, [gl, onLost]);

  useEffect(
    () => () => {
      disposeObject(world.group);
    },
    [world]
  );

  useFrame((frame, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = state.current;
    ringStore.step(dt);

    const R = layout.radius;
    const c = layout.slotAt(ringStore.pos);
    const { area } = ringStore;
    let busy =
      ringStore.dragging ||
      ringStore.target !== null ||
      Math.abs(ringStore.vel) > 0.35 ||
      performance.now() - ringStore.lastInput < 240;

    PANELS.forEach((panel, i) => {
      const rt = world.panels[i];
      const d = layout.offset(i, c);
      const f = focus(d);
      const theta = layout.arc(d) / R;
      const w = UNIT * baseWidth(panel.kind) * f;
      const h = w / panel.frame;
      const near = Math.exp((-d * d) / 0.48);
      const r = R - PULL * near * (panel.kind === 'terminal' ? 1.15 : 1);
      rt.mesh.position.set(
        r * Math.sin(theta),
        rt.yOff * (1 - near),
        -r * Math.cos(theta)
      );
      rt.mesh.rotation.y = -theta;
      const u = rt.mat.uniforms;
      (u.uSize.value as THREE.Vector2).set(w, h);
      u.uBend.value = r;
      u.uLit.value = 1 - smooth(0.18, 0.95, Math.abs(d));

      const inArea = area ? panel.project.area === area : false;
      const dimT = area && !inArea ? 1 : 0;
      const markT = area && inArea ? 1 : 0;
      const k = 1 - Math.exp(-dt * 7);
      rt.dim = lerp(rt.dim, dimT, k);
      rt.mark = lerp(rt.mark, markT, k);
      if (
        Math.abs(rt.dim - dimT) > 0.004 ||
        Math.abs(rt.mark - markT) > 0.004
      ) {
        busy = true;
      }
      u.uDim.value = rt.dim;
      u.uMark.value = rt.mark * (1 - Math.min(1, near)) * 0.8;

      const tex = textures.get(panel.id);
      if (tex && u.uMap.value !== tex) {
        u.uMap.value = tex;
        u.uHasMap.value = 1;
      }
    });

    world.floorMat.uniforms.uRot.value = -2 * Math.PI * c;
    world.glowMat.uniforms.uStrength.value = 0.06 * (area ? 0.7 : 1);

    // A little parallax follows the pointer.
    const kp = 1 - Math.exp(-dt * 5);
    s.px = lerp(s.px, ringStore.pointerX, kp);
    s.py = lerp(s.py, ringStore.pointerY, kp);
    if (
      Math.abs(s.px - ringStore.pointerX) > 0.002 ||
      Math.abs(s.py - ringStore.pointerY) > 0.002
    ) {
      busy = true;
    }
    camera.position.set(s.px * 0.5, 0.2 - s.py * 0.12, 0);
    camera.lookAt(s.px * 0.35, -0.3 - s.py * 0.1, -R);
    world.sky.position.copy(camera.position);

    if (!s.first) {
      s.first = true;
      onFirstFrame();
    }
    if (busy) invalidate();
  });

  return null;
}

type RingSceneProps = {
  fonts: Fonts;
  onReady: () => void;
  onFail: () => void;
};

export default function RingScene({ fonts, onReady, onFail }: RingSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(() => pickDpr(PIXEL_BUDGET));
  const [visible, setVisible] = useState(true);
  const [gpu, setGpu] = useState(0);
  const reported = useRef(false);

  useEffect(() => {
    const onResize = () => setDpr(pickDpr(PIXEL_BUDGET));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Pause entirely while the stage is off screen.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting)
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!reported.current) onFail();
    }, 15000);
    return () => window.clearTimeout(timer);
  }, [onFail]);

  const handleFirst = useCallback(() => {
    if (reported.current) return;
    reported.current = true;
    onReady();
  }, [onReady]);

  return (
    <div
      ref={wrapRef}
      className={styles.canvas}
      aria-hidden="true"
      data-gpu-mb={gpu.toFixed(1)}
    >
      <Canvas
        flat
        frameloop={visible ? 'demand' : 'never'}
        dpr={dpr}
        camera={{ fov: FOV, near: 0.3, far: 200, position: [0, 0.2, 0] }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ touchAction: 'pan-y' }}
      >
        <color attach="background" args={[BG]} />
        <Rig
          fonts={fonts}
          onFirstFrame={handleFirst}
          onLoaded={setGpu}
          onLost={onFail}
        />
        <EffectComposer multisampling={dpr >= 1.5 ? 2 : 4}>
          <Bloom
            intensity={0.38}
            luminanceThreshold={1.02}
            luminanceSmoothing={0.03}
            radius={0.28}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
