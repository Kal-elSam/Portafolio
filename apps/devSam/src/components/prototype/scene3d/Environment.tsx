import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

/** Procedural studio: dark room and a few neutral softboxes; the acid stays in the traces. No assets. */
export default function Environment() {
  const { gl, scene, invalidate } = useThree();

  useEffect(() => {
    const room = new THREE.Scene();
    const toDispose: { dispose: () => void }[] = [];

    const panel = (
      w: number,
      h: number,
      pos: [number, number, number],
      color: string,
      level: number
    ) => {
      const geo = new THREE.PlaneGeometry(w, h);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(level),
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.lookAt(0, 0, 0);
      room.add(mesh);
      toDispose.push(geo, mat);
    };

    const dome = new THREE.SphereGeometry(40, 24, 16);
    const domeMat = new THREE.MeshBasicMaterial({
      color: '#020304',
      side: THREE.BackSide,
    });
    room.add(new THREE.Mesh(dome, domeMat));
    toDispose.push(dome, domeMat);

    // Few, narrow, bright softboxes on a near-black room: reflections read as
    // hard streaks that slide across the metal instead of an even grey wash.
    panel(9, 2.2, [0, 6, -11], '#f2f6f8', 3.4); // far strip: top faces
    panel(5, 5, [0, 11, 0], '#ffffff', 1.1); // overhead, small
    panel(1.6, 13, [-11, 3, 5], '#e6eef5', 4.4); // front-left strip
    panel(1.4, 13, [11, 2, -4], '#cfe0ff', 3.4); // back-right strip
    panel(0.7, 15, [-5, 3, -11], '#d4e4ff', 4.2); // cool rim strip
    panel(0.8, 12, [6, 4, 9], '#ffffff', 3.0); // front-right strip

    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(room, 0.03);
    scene.environment = target.texture;
    scene.environmentIntensity = 1.5;
    pmrem.dispose();
    toDispose.forEach((d) => d.dispose());
    invalidate();

    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene, invalidate]);

  return null;
}
