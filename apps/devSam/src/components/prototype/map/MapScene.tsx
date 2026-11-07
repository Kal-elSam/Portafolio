/* eslint-disable react/no-unknown-property -- react-three-fiber JSX props */
/* eslint-disable no-param-reassign -- three.js objects are mutated by design */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';

import Environment from '../scene3d/Environment';
import { AREAS, metaLine, PROJECTS, projectsByArea } from './data';
import { BLOCK, BLOCK_H, LANE_W, LAYOUT } from './layout';
import { mapStore } from './store';

import type { MapProject } from './data';

import styles from './map.module.css';

const ACCENT = '#c8ff2e';
const LINE = '#3a463a';
const LINE_SOFT = '#1f2820';
const FOV = 12;
const NARROW = 900;
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

const { bounds, placed, lanes, years, undated } = LAYOUT;
const zMid = (bounds.zFront + bounds.zBack) / 2;
const depth = bounds.zFront + 0.9 - bounds.zBack;
const width = bounds.xMax - bounds.xMin;

type Key = {
  tx: number;
  yaw: number;
  pitch: number;
  halfW: number;
  halfH: number;
};

const KEYS: Key[] = [
  {
    tx: -1.8,
    yaw: -0.16,
    pitch: 0.72,
    halfW: width / 2 + 3.8,
    halfH: (depth * Math.sin(0.72)) / 2 + 1.1,
  },
  ...lanes.map(
    (lane, i): Key => ({
      tx: lane.x,
      yaw: -0.14 + i * 0.05,
      pitch: 0.8,
      halfW: 3.1,
      halfH: (depth * Math.sin(0.8)) / 2 + 2.6,
    })
  ),
];

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 1 when the lane is the focus of the tour (or the overview is showing). */
const laneWeight = (f: number, lane: number) => {
  const overview = Math.min(1, Math.max(0, 1 - f * 2));
  const near = 1 - Math.min(1, Math.abs(f - (lane + 1)) * 1.25);
  return Math.max(overview, near);
};

type Detail = 'high' | 'low';

const pickQuality = () => {
  const w = window.innerWidth;
  const detail: Detail = w < 768 ? 'low' : 'high';
  const ratio = window.devicePixelRatio || 1;
  const wanted =
    detail === 'low' ? Math.min(ratio, 1.5) : Math.max(1.5, Math.min(2, ratio));
  const area = w * window.innerHeight;
  return {
    detail,
    dpr: Math.max(1, Math.min(wanted, Math.sqrt(3_400_000 / area))),
  };
};

/* ---------- landscape ---------- */

function Ground() {
  const { plateGeo, plateMat, lineGeo, lineMat, accentGeo, accentMat } =
    useMemo(() => {
      const segs: number[] = [];
      const accent: number[] = [];
      const seg = (out: number[], a: number[], b: number[]) =>
        out.push(...a, ...b);

      lanes.forEach((lane, i) => {
        const x0 = lane.x - LANE_W / 2;
        const x1 = lane.x + LANE_W / 2;
        const out = AREAS[i].featured ? accent : segs;
        const zf = bounds.zFront;
        const zb = bounds.zBack;
        seg(out, [x0, 0.004, zf], [x1, 0.004, zf]);
        seg(out, [x1, 0.004, zf], [x1, 0.004, zb]);
        seg(out, [x1, 0.004, zb], [x0, 0.004, zb]);
        seg(out, [x0, 0.004, zb], [x0, 0.004, zf]);
      });
      const soft: number[] = [];
      years.forEach(({ z }) => {
        seg(soft, [bounds.xMin - 0.2, 0.004, z], [bounds.xMax, 0.004, z]);
      });
      seg(
        soft,
        [bounds.xMin - 0.2, 0.004, undated.back - 0.9],
        [bounds.xMax, 0.004, undated.back - 0.9]
      );
      const toGeo = (data: number[]) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(data, 3));
        return g;
      };
      const all = toGeo([...segs, ...soft]);
      // Soft grid lines get their own colour through vertex colours.
      const colors: number[] = [];
      const cLine = new THREE.Color(LINE);
      const cSoft = new THREE.Color(LINE_SOFT);
      for (let i = 0; i < segs.length / 3; i += 1)
        colors.push(cLine.r, cLine.g, cLine.b);
      for (let i = 0; i < soft.length / 3; i += 1)
        colors.push(cSoft.r, cSoft.g, cSoft.b);
      all.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      return {
        plateGeo: new THREE.BoxGeometry(
          LANE_W,
          0.06,
          bounds.zFront - bounds.zBack
        ),
        plateMat: new THREE.MeshStandardMaterial({
          color: '#0d1311',
          roughness: 0.62,
          metalness: 0.5,
        }),
        lineGeo: all,
        lineMat: new THREE.LineBasicMaterial({ vertexColors: true }),
        accentGeo: toGeo(accent),
        accentMat: new THREE.LineBasicMaterial({ color: ACCENT }),
      };
    }, []);

  useEffect(
    () => () => {
      [plateGeo, plateMat, lineGeo, lineMat, accentGeo, accentMat].forEach(
        (d) => d.dispose()
      );
    },
    [plateGeo, plateMat, lineGeo, lineMat, accentGeo, accentMat]
  );

  return (
    <group>
      {lanes.map((lane) => (
        <mesh
          key={lane.id}
          geometry={plateGeo}
          material={plateMat}
          position={[lane.x, -0.03, (bounds.zFront + bounds.zBack) / 2]}
          receiveShadow
        />
      ))}
      <lineSegments geometry={lineGeo} material={lineMat} />
      <lineSegments geometry={accentGeo} material={accentMat} />
    </group>
  );
}

const TONE = new THREE.Color('#8b968f');
const HOVER = new THREE.Color(ACCENT);
const FEAT = new THREE.Color(ACCENT);

function Blocks({ onOpen }: { onOpen: (p: MapProject) => void }) {
  const normalRef = useRef<THREE.InstancedMesh>(null);
  const featRef = useRef<THREE.InstancedMesh>(null);
  const { invalidate } = useThree();

  const { geo, normalMat, featMat, normal, feat } = useMemo(() => {
    const s = BLOCK - 0.1;
    const shape = new THREE.Shape();
    shape.moveTo(-s / 2, -s / 2);
    shape.lineTo(s / 2, -s / 2);
    shape.lineTo(s / 2, s / 2);
    shape.lineTo(-s / 2, s / 2);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: BLOCK_H - 0.08,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.05,
      bevelSegments: 2,
      curveSegments: 1,
    });
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0.04, 0);
    return {
      geo: g,
      normalMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        metalness: 0.9,
        roughness: 0.3,
      }),
      featMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        metalness: 0.35,
        roughness: 0.42,
        emissive: ACCENT,
        emissiveIntensity: 0.12,
      }),
      normal: PROJECTS.filter((p) => !p.featured),
      feat: PROJECTS.filter((p) => p.featured),
    };
  }, []);

  const anim = useMemo(
    () => ({
      normal: {
        lift: new Float32Array(normal.length),
        bright: new Float32Array(normal.length).fill(1),
        mix: new Float32Array(normal.length),
      },
      feat: {
        lift: new Float32Array(feat.length),
        bright: new Float32Array(feat.length).fill(1),
        mix: new Float32Array(feat.length),
      },
    }),
    [normal.length, feat.length]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    [
      [normalRef.current, normal],
      [featRef.current, feat],
    ].forEach(([mesh, list]) => {
      const m = mesh as THREE.InstancedMesh | null;
      const items = list as MapProject[];
      if (!m) return;
      items.forEach((p, i) => {
        const at = placed[p.id];
        dummy.position.set(at.x, 0, at.z);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        m.setColorAt(i, color.copy(p.featured ? FEAT : TONE));
      });
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
      m.computeBoundingSphere();
    });
    invalidate();
  }, [normal, feat, dummy, color, invalidate]);

  useEffect(
    () => () => {
      geo.dispose();
      normalMat.dispose();
      featMat.dispose();
    },
    [geo, normalMat, featMat]
  );

  useFrame((_, delta) => {
    const f = mapStore.progress * 4;
    const k = 1 - Math.exp(-delta * 9);
    let moving = false;
    const run = (
      mesh: THREE.InstancedMesh | null,
      items: MapProject[],
      st: { lift: Float32Array; bright: Float32Array; mix: Float32Array },
      base: THREE.Color
    ) => {
      if (!mesh) return;
      items.forEach((p, i) => {
        const at = placed[p.id];
        const on = mapStore.active === p.id;
        const tBright = 0.14 + 0.86 * laneWeight(f, at.lane);
        const tLift = on ? 0.18 : 0;
        const tMix = on ? 1 : 0;
        const dL = tLift - st.lift[i];
        const dB = tBright - st.bright[i];
        const dM = tMix - st.mix[i];
        if (Math.abs(dL) + Math.abs(dB) + Math.abs(dM) < 0.002) return;
        st.lift[i] += dL * k;
        st.bright[i] += dB * k;
        st.mix[i] += dM * k;
        moving = true;
        dummy.position.set(at.x, st.lift[i], at.z);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        color
          .copy(base)
          .lerp(HOVER, st.mix[i] * 0.85)
          .multiplyScalar(st.bright[i]);
        mesh.setColorAt(i, color);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };
    run(normalRef.current, normal, anim.normal, TONE);
    run(featRef.current, feat, anim.feat, FEAT);
    if (moving) invalidate();
  });

  const handlers = (items: MapProject[]) => ({
    onPointerMove: (e: {
      instanceId?: number;
      stopPropagation: () => void;
    }) => {
      e.stopPropagation();
      const p = e.instanceId === undefined ? undefined : items[e.instanceId];
      if (p) {
        mapStore.setActive(p.id);
        document.body.style.cursor = 'pointer';
      }
    },
    onPointerOut: () => {
      mapStore.setActive(null);
      document.body.style.cursor = '';
    },
    onClick: (e: { instanceId?: number; stopPropagation: () => void }) => {
      e.stopPropagation();
      const p = e.instanceId === undefined ? undefined : items[e.instanceId];
      if (p) onOpen(p);
    },
  });

  return (
    <>
      <instancedMesh
        ref={normalRef}
        args={[geo, normalMat, normal.length]}
        castShadow
        receiveShadow
        {...handlers(normal)}
      />
      <instancedMesh
        ref={featRef}
        args={[geo, featMat, feat.length]}
        castShadow
        receiveShadow
        {...handlers(feat)}
      />
    </>
  );
}

/* ---------- camera ---------- */

function Rig({ onFirstFrame }: { onFirstFrame: () => void }) {
  const damped = useRef({ x: 0, y: 0, region: 0 });
  const first = useRef(true);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const { camera, size, invalidate } = state;
    const p = Math.min(1, Math.max(0, mapStore.progress));
    const f = p * 4;
    const i = Math.min(3, Math.floor(f));
    const t = smooth(0.18, 0.82, f - i);
    const a = KEYS[i];
    const b = KEYS[i + 1];

    const aspect = size.width / size.height;
    const narrow = size.width < NARROW;
    const d = damped.current;
    d.region += (mapStore.regionTop - d.region) * (1 - Math.exp(-delta * 8));
    if (Math.abs(mapStore.regionTop - d.region) > 0.5) invalidate();
    const top = narrow ? Math.min(d.region, size.height * 0.7) : 0;
    const vFrac = narrow ? (size.height - top) / size.height : 1;
    const left = narrow ? 0 : Math.min(mapStore.regionLeft, size.width * 0.6);
    const hFrac = (size.width - left) / size.width;
    const need = (k: Key) =>
      Math.max(
        (k.halfH + (narrow ? 1.6 : 0)) / (TAN * vFrac),
        k.halfW / (TAN * aspect * hFrac)
      );
    const dist = lerp(need(a), need(b), t);
    const tx = lerp(a.tx, b.tx, t);
    const yaw = lerp(a.yaw, b.yaw, t);
    const pitch = lerp(a.pitch, b.pitch, t);

    const k = 1 - Math.exp(-delta * 4);
    d.x += (mapStore.pointerX - d.x) * k;
    d.y += (mapStore.pointerY - d.y) * k;
    if (
      Math.abs(mapStore.pointerX - d.x) + Math.abs(mapStore.pointerY - d.y) >
      0.002
    ) {
      invalidate();
    }

    target.set(tx, 0, zMid);
    camera.position.set(
      target.x + Math.sin(yaw) * Math.cos(pitch) * dist + d.x * 0.9,
      target.y + Math.sin(pitch) * dist + d.y * -0.5,
      target.z + Math.cos(yaw) * Math.cos(pitch) * dist
    );
    camera.lookAt(target);
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = FOV;
    cam.near = 5;
    cam.far = 220;
    if (narrow) {
      cam.setViewOffset(
        size.width,
        size.height,
        0,
        -(top / 2),
        size.width,
        size.height
      );
    } else {
      cam.setViewOffset(
        size.width,
        size.height,
        -(left / 2),
        0,
        size.width,
        size.height
      );
    }
    camera.updateMatrixWorld();

    if (first.current) {
      first.current = false;
      onFirstFrame();
    }
  }, -1);

  return null;
}

/* ---------- DOM labels projected from world positions ---------- */

type LabelDef = {
  key: string;
  pos: [number, number, number];
  anchor: string;
};

const LABELS: LabelDef[] = [
  ...lanes.map((lane, i) => ({
    key: `lane-${i}`,
    pos: [lane.x, 0, bounds.zFront + 0.15] as [number, number, number],
    anchor: 'translate(-50%, 0)',
  })),
  ...years.map(({ year, z }) => ({
    key: `year-${year}`,
    pos: [bounds.xMin - 0.35, 0, z] as [number, number, number],
    anchor: 'translate(-100%, -50%)',
  })),
  {
    key: 'band',
    pos: [bounds.xMin - 0.35, 0, undated.back / 2],
    anchor: 'translate(-100%, -50%)',
  },
];

type LabelRefs = Record<string, HTMLElement | null>;

function Projector({ refs }: { refs: { current: LabelRefs } }) {
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }) => {
    const project = (x: number, y: number, z: number) => {
      v.set(x, y, z).project(camera);
      return {
        px: (v.x * 0.5 + 0.5) * size.width,
        py: (-v.y * 0.5 + 0.5) * size.height,
        visible: v.z < 1,
      };
    };
    const f = mapStore.progress * 4;
    LABELS.forEach((def) => {
      const el = refs.current[def.key];
      if (!el) return;
      const { px, py, visible } = project(...def.pos);
      el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(
        1
      )}px, 0) ${def.anchor}`;
      el.style.visibility = visible ? 'visible' : 'hidden';
      if (!def.key.startsWith('lane-')) {
        // Year and band labels sit left of the first lane: keep them only
        // while that lane or the overview is on screen.
        el.style.opacity = String(laneWeight(f, 0) > 0.5 ? 1 : 0);
      }
      if (def.key.startsWith('lane-')) {
        const lane = Number(def.key.slice(5));
        el.dataset.focus = laneWeight(f, lane) > 0.6 && f > 0.2 ? '1' : '0';
        el.dataset.dim = laneWeight(f, lane) < 0.45 ? '1' : '0';
      }
    });

    const { tip } = refs.current;
    const id = mapStore.active;
    if (tip && id) {
      const at = placed[id];
      const { px, py } = project(at.x, BLOCK_H + 0.25, at.z);
      const w = tip.offsetWidth;
      const h = tip.offsetHeight;
      const x = Math.min(Math.max(px - w / 2, 8), size.width - w - 8);
      const above = py - h - 16 > 8;
      const y = above ? py - h - 16 : py + 22;
      tip.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(
        1
      )}px, 0)`;
    }
  });

  return null;
}

function Tip({ refs }: { refs: { current: LabelRefs } }) {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setId(mapStore.active);
    sync();
    return mapStore.subscribe(sync);
  }, []);
  const project = id ? PROJECTS.find((p) => p.id === id) : undefined;
  const meta = project ? metaLine(project) : '';
  return (
    <div
      ref={(el) => {
        refs.current.tip = el;
      }}
      className={styles.tip}
      data-open={project ? '1' : '0'}
      aria-hidden="true"
    >
      {project && (
        <>
          <p className={styles.tipName}>{project.name}</p>
          <p className={styles.tipBlurb}>{project.blurb}</p>
          <p className={styles.tipMeta}>
            {meta}
            {project.year ? ` · ${project.year}` : ' · Year not stated'}
          </p>
        </>
      )}
    </div>
  );
}

/* ---------- scene ---------- */

type MapSceneProps = {
  ready: boolean;
  onReady: () => void;
  onFail: () => void;
  onLane: (lane: number) => void;
};

function KeyLight() {
  const { scene } = useThree();
  const ref = useRef<THREE.DirectionalLight>(null);
  useEffect(() => {
    const light = ref.current;
    if (!light) return undefined;
    light.target.position.set(0, 0, zMid);
    scene.add(light.target);
    return () => {
      scene.remove(light.target);
    };
  }, [scene]);
  return (
    <directionalLight
      ref={ref}
      position={[-6, 24, zMid + 16]}
      intensity={2.3}
      color="#e8eef2"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-13}
      shadow-camera-right={13}
      shadow-camera-top={13}
      shadow-camera-bottom={-13}
      shadow-camera-near={2}
      shadow-camera-far={70}
      shadow-bias={-0.0005}
      shadow-normalBias={0.02}
    />
  );
}

export default function MapScene({
  ready,
  onReady,
  onFail,
  onLane,
}: MapSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<LabelRefs>({});
  const [quality, setQuality] = useState(pickQuality);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onResize = () => setQuality(pickQuality());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) mapStore.invalidate();
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const open = useCallback((p: MapProject) => {
    // No public destination: nothing to open.
    if (p.href) window.open(p.href, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={styles.sceneWrap}
      data-ready={ready ? '1' : '0'}
      aria-hidden="true"
    >
      <Canvas
        frameloop={visible ? 'demand' : 'never'}
        dpr={quality.dpr}
        shadows={quality.detail === 'high' ? 'percentage' : false}
        camera={{ fov: FOV, near: 5, far: 220, position: [0, 30, 40] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ touchAction: 'pan-y' }}
        onCreated={({ gl, invalidate }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
          mapStore.invalidate = invalidate;
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            onFail();
          });
        }}
      >
        <Environment />
        <ambientLight intensity={0.05} />
        <KeyLight />
        <directionalLight
          position={[8, 4, -6]}
          intensity={1.4}
          color="#cfe0f2"
        />
        <directionalLight
          position={[0, 6, 12]}
          intensity={0.5}
          color="#e6eef8"
        />

        <Ground />
        <Blocks onOpen={open} />
        <Rig onFirstFrame={onReady} />
        <Projector refs={labelRefs} />
      </Canvas>

      {LABELS.map((def) => {
        const [kind, rest] = def.key.split('-');
        const lane = kind === 'lane' ? Number(rest) : -1;
        if (kind === 'lane') {
          const area = AREAS[lane];
          return (
            <button
              key={def.key}
              ref={(el) => {
                labelRefs.current[def.key] = el;
              }}
              type="button"
              tabIndex={-1}
              className={styles.laneLabel}
              onClick={() => onLane(lane)}
            >
              <span className={styles.laneFull}>{area.name}</span>
              <span className={styles.laneShort}>{area.short}</span>
              <span className={styles.laneCount}>
                {projectsByArea(area.id).length}
              </span>
            </button>
          );
        }
        return (
          <span
            key={def.key}
            ref={(el) => {
              labelRefs.current[def.key] = el;
            }}
            className={kind === 'year' ? styles.yearLabel : styles.bandLabel}
          >
            {kind === 'year' ? rest : 'Year not stated'}
          </span>
        );
      })}
      <Tip refs={labelRefs} />
    </div>
  );
}
