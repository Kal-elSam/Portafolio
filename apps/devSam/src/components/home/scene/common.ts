// Helpers shared by the two WebGL scenes of the home page (insurance journey
// and project ring). Client only: imported by the lazy scene chunks.

import * as THREE from 'three';

export const BG = '#06080a';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Deterministic hash in 0..1, so the scenery never changes between runs. */
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * DPR 1 screens render at 1.5x and are downsampled so small text keeps its
 * edges; the pixel budget caps large displays.
 */
export const pickDpr = (budget: number) => {
  const ratio = window.devicePixelRatio || 1;
  const wanted = Math.max(1.5, Math.min(ratio, 2));
  const area = Math.max(1, window.innerWidth * window.innerHeight);
  return Math.max(1, Math.min(wanted, Math.sqrt(budget / area)));
};

export const decode = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`texture failed: ${src}`));
    img.src = src;
  });

export const pause = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const configure = (
  source: HTMLImageElement | HTMLCanvasElement,
  anisotropy: number
) => {
  const t = new THREE.Texture(source);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
};

/** RGBA8 plus a full mip chain, in MB. */
export const textureMB = (t: THREE.Texture | undefined | null) => {
  const img = t?.image as { width: number; height: number } | undefined;
  return img ? (img.width * img.height * 4 * (4 / 3)) / (1024 * 1024) : 0;
};

export const disposeObject = (root: THREE.Object3D) => {
  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else mat?.dispose();
  });
};
