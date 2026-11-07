// Progressive texture loading for the layered screen. Client only (imported by
// the lazy scene chunk). The base plate and the most visible pieces load
// first, the rest follow by priority, and the backdrop screens come last. A
// failed image only hides its own piece. Textures are disposed on unmount.

import * as THREE from 'three';

import { ASSET_DIR, BACKDROP, PIECES } from './pieces';

export type TextureMap = Map<string, THREE.Texture>;

const decode = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`texture failed: ${src}`));
    img.src = src;
  });

const configure = (image: HTMLImageElement, anisotropy: number) => {
  const t = new THREE.Texture(image);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
};

export const pieceSrc = (id: string) => `${ASSET_DIR}/maximus/${id}.webp`;
export const backdropSrc = (file: string) => `${ASSET_DIR}/bg/${file}.webp`;

type Job = { key: string; src: string };

/** Groups run one after the other; the files inside a group load together. */
const groups = (): Job[][] => {
  const out: Job[][] = [];
  const priorities = Array.from(new Set(PIECES.map((p) => p.priority))).sort(
    (a, b) => a - b
  );
  priorities.forEach((priority) => {
    out.push(
      PIECES.filter((p) => p.priority === priority).map((p) => ({
        key: p.id,
        src: pieceSrc(p.id),
      }))
    );
  });
  out.push(
    BACKDROP.map((b) => ({ key: `bg:${b.id}`, src: backdropSrc(b.file) }))
  );
  return out;
};

/**
 * Starts loading and returns a cancel function. `onTexture` runs for every
 * texture as soon as it exists; `onFail` runs for the key of a failed image.
 */
export const loadTextures = (
  anisotropy: number,
  store: TextureMap,
  onTexture: (key: string) => void,
  onFail: (key: string) => void
) => {
  const run = { cancelled: false };

  const loadJob = async (job: Job) => {
    try {
      const image = await decode(job.src);
      if (run.cancelled) return;
      store.set(job.key, configure(image, anisotropy));
      onTexture(job.key);
    } catch {
      if (!run.cancelled) onFail(job.key);
    }
  };

  // Each group starts when the previous one has settled.
  groups()
    .reduce(
      (chain, group) =>
        chain.then(() =>
          run.cancelled ? undefined : Promise.all(group.map(loadJob))
        ),
      Promise.resolve<unknown>(undefined)
    )
    .catch(() => undefined);

  return () => {
    run.cancelled = true;
  };
};

export const disposeTextures = (store: TextureMap) => {
  store.forEach((t) => t.dispose());
  store.clear();
};
