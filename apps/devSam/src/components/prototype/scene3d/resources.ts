import * as THREE from 'three';

import {
  lathe,
  plate,
  PORT_KINDS,
  portContact,
  portFrame,
  slab,
} from './geometry';
import { ACCENT, PART_COUNT, PLATE_D, PLATE_T, PLATE_W } from './layout';

const accentLinear = new THREE.Color(ACCENT);

/** Procedural brushed-metal roughness grain, drawn once; no image assets. */
function brushedGrain() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'rgb(185,185,185)';
    ctx.fillRect(0, 0, size, size);
    // Deterministic pseudo-random so every load grinds the same way.
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let k = 0; k < 2200; k += 1) {
      const y = rnd() * size;
      const x = rnd() * size;
      const len = 40 + rnd() * 260;
      const v = 110 + Math.floor(rnd() * 145);
      ctx.strokeStyle = `rgba(${v},${v},${v},${0.2 + rnd() * 0.35})`;
      ctx.lineWidth = 0.5 + rnd() * 1.1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(0.35, 1.6);
  return tex;
}

/** Emissive levels: rest (assembled) and lit (module fully separated). */
export const TRACE = { pRest: 1.3, pLit: 1.55, sRest: 0.75, sLit: 1.05 };

/** Sets an emissive-style colour above 1.0 so only the traces catch bloom. */
export const setTrace = (mat: THREE.MeshBasicMaterial, level: number) => {
  mat.color.copy(accentLinear).multiplyScalar(level);
};

export type Resources = ReturnType<typeof createResources>;

export function createResources() {
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const grain = track(brushedGrain());
  const metal = (
    color: string,
    roughness: number,
    metalness = 1,
    roughnessMap?: THREE.Texture
  ) =>
    track(
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        ...(roughnessMap ? { roughnessMap } : {}),
      })
    );
  // Anodised plate: brushed anisotropic highlight, grain in roughness and bump.
  const anodised = (color: string, roughness: number) =>
    track(
      new THREE.MeshPhysicalMaterial({
        color,
        roughness,
        metalness: 1,
        roughnessMap: grain,
        bumpMap: grain,
        bumpScale: 0.6,
        anisotropy: 0.4,
        anisotropyRotation: 0,
      })
    );

  const mats = {
    plateA: anodised('#4a5058', 0.46),
    plateB: anodised('#3c4249', 0.5),
    detail: metal('#59606a', 0.38, 1, grain),
    steel: metal('#9aa2aa', 0.3),
    recess: metal('#0a0d0e', 0.6, 0.6),
    pad: metal('#3a4046', 0.55, 1, grain),
    dim: track(
      new THREE.MeshBasicMaterial({ color: '#4a5846', toneMapped: false })
    ),
  };

  // Two emissive tiers per module: one primary path, dimmer secondary traces.
  const trace = Array.from({ length: PART_COUNT }, () => ({
    p: track(new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false })),
    s: track(new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false })),
  }));
  trace.forEach((t) => {
    setTrace(t.p, TRACE.pRest);
    setTrace(t.s, TRACE.sRest);
  });
  // Quiet machined guide rods: not emissive, one soft highlight.
  const rodMat = metal('#aab1b8', 0.28);

  const unit = track(new THREE.BoxGeometry(1, 1, 1));
  const rod = track(new THREE.CylinderGeometry(0.02, 0.02, 1, 16));
  const collar = track(lathe(0.062, 0.05, 0.01, 20));
  const ring = track(new THREE.TorusGeometry(0.34, 0.012, 8, 72));
  ring.rotateX(Math.PI / 2);

  const geo = {
    unit,
    rod,
    collar,
    ring,
    plate: track(plate(PLATE_W, PLATE_D, PLATE_T, 0.16, 0.034)),
    screw: track(lathe(0.058, 0.04, 0.012, 6)),
    connector: track(slab(0.62, 0.2, 0.46, 0.02)),
    gate: track(slab(2.9, 0.07, 0.1, 0.014)),
    hub: track(lathe(0.26, 0.13, 0.025, 48)),
    hubCore: track(lathe(0.1, 0.016, 0.004, 32)),
    terminal: track(lathe(0.13, 0.1, 0.02, 32)),
    terminalCore: track(lathe(0.055, 0.014, 0.004, 24)),
    pillars: [0.22, 0.41, 0.6, 0.35, 0.5].map((h) =>
      track(slab(0.4, h, 0.4, 0.02))
    ),
    pad: track(slab(3.3, 0.04, 1.7, 0.01)),
    rail: track(slab(3.0, 0.06, 0.18, 0.014)),
    tick: track(slab(0.024, 0.05, 0.14, 0.006)),
    marker: track(slab(0.22, 0.16, 0.22, 0.02)),
    cube: track(slab(0.24, 0.14, 0.24, 0.018)),
    stop: track(slab(0.1, 0.14, 0.32, 0.014)),
    dash: track(slab(0.13, 0.014, 0.05, 0.004)),
    ports: PORT_KINDS.map((kind) => ({
      kind,
      frame: track(portFrame(kind, 0.13)),
      contact: track(portContact(kind)),
    })),
  };

  return {
    geo,
    mats,
    trace,
    rodMat,
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}
