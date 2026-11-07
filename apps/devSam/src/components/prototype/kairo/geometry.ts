import * as THREE from 'three';

/**
 * A tube that follows a curve with a radius that changes along its length.
 * uv.x is the arc-length fraction (0..1), uv.y the angle around the axis
 * (0..1). The shaders read both, so the same fraction drives quota and light.
 */
export const taperTube = (
  curve: THREE.Curve<THREE.Vector3>,
  segments: number,
  radial: number,
  radius: (t: number) => number
) => {
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const p = new THREE.Vector3();
  const dir = new THREE.Vector3();
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    curve.getPointAt(t, p);
    const n = frames.normals[i];
    const b = frames.binormals[i];
    const r = radius(t);
    for (let j = 0; j <= radial; j += 1) {
      const a = (j / radial) * Math.PI * 2;
      dir.copy(n).multiplyScalar(Math.cos(a)).addScaledVector(b, Math.sin(a));
      positions.push(p.x + dir.x * r, p.y + dir.y * r, p.z + dir.z * r);
      normals.push(dir.x, dir.y, dir.z);
      uvs.push(t, j / radial);
    }
  }
  const row = radial + 1;
  for (let i = 0; i < segments; i += 1) {
    for (let j = 0; j < radial; j += 1) {
      const a = i * row + j;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
};

/**
 * A vertical strip that follows a curve at an offset: the gauge rail.
 * uv.x is the arc-length fraction, uv.y runs from the bottom (0) to the top (1).
 */
export const ribbon = (
  curve: THREE.Curve<THREE.Vector3>,
  segments: number,
  offset: (t: number) => THREE.Vector3,
  height: number
) => {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const p = new THREE.Vector3();
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    curve.getPointAt(t, p);
    const o = offset(t);
    positions.push(p.x + o.x, p.y + o.y, p.z + o.z);
    positions.push(p.x + o.x, p.y + o.y + height, p.z + o.z);
    normals.push(0, 0, 1, 0, 0, 1);
    uvs.push(t, 0, t, 1);
  }
  for (let i = 0; i < segments; i += 1) {
    const a = i * 2;
    indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
};

/**
 * A faceted tube: like taperTube but with flat faces (hard normals), so a
 * hexagonal section reads as a prism and not as a rounded cylinder.
 * uv.x is the arc-length fraction, uv.y the face fraction.
 */
export const taperPrism = (
  curve: THREE.Curve<THREE.Vector3>,
  segments: number,
  sides: number,
  radius: (t: number) => number
) => {
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const p = new THREE.Vector3();
  const dirA = new THREE.Vector3();
  const dirB = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const ring = (i: number, a: number, out: THREE.Vector3) =>
    out
      .copy(frames.normals[i])
      .multiplyScalar(Math.cos(a))
      .addScaledVector(frames.binormals[i], Math.sin(a));
  let vi = 0;
  for (let i = 0; i < segments; i += 1) {
    const t0 = i / segments;
    const t1 = (i + 1) / segments;
    const r0 = radius(t0);
    const r1 = radius(t1);
    for (let f = 0; f < sides; f += 1) {
      const a0 = (f / sides) * Math.PI * 2;
      const a1 = ((f + 1) / sides) * Math.PI * 2;
      ring(i, (a0 + a1) / 2, mid);
      const corners: [number, number, number][] = [];
      [
        [i, t0, r0, a0],
        [i, t0, r0, a1],
        [i + 1, t1, r1, a0],
        [i + 1, t1, r1, a1],
      ].forEach(([fi, tt, rr, aa]) => {
        curve.getPointAt(tt, p);
        ring(fi, aa, dirA);
        corners.push([p.x + dirA.x * rr, p.y + dirA.y * rr, p.z + dirA.z * rr]);
      });
      dirB.copy(mid);
      corners.forEach((c, k) => {
        positions.push(c[0], c[1], c[2]);
        normals.push(dirB.x, dirB.y, dirB.z);
        uvs.push(k < 2 ? t0 : t1, (f + (k % 2)) / sides);
      });
      indices.push(vi, vi + 2, vi + 1, vi + 1, vi + 2, vi + 3);
      vi += 4;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
};
