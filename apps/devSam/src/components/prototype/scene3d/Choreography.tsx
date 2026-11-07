import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { SEPARATION_ORDER } from '../parts';
import { stage } from '../stage';
import { PAD_REST, PAD_SEATED } from './Assembly';
import {
  closedY,
  openY,
  PART_COUNT,
  PITCH_CLOSED,
  PLATE_D,
  PLATE_T,
  PLATE_W,
  ROD_SITES,
} from './layout';
import { setTrace, TRACE } from './resources';

import type { AssemblyRefs } from './Assembly';
import type { Resources } from './resources';
import type { RefObject } from 'react';

const FOV = 30;
const AZ0 = -0.8;
const AZ1 = 0.55;
const EL0 = 0.66;
const EL1 = 0.37;
const STEP = 0.1;
const SPAN = 0.38;
const COL_EDGE = 32;
const LEADER_GAP = 16;
const DIM = 0.8;

const { lerp, damp } = THREE.MathUtils;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const out3 = (t: number) => 1 - (1 - t) ** 3;

const separation = (index: number, progress: number) => {
  const order = SEPARATION_ORDER.indexOf(index);
  return out3(clamp01((progress - order * STEP) / SPAN));
};

type Dom = {
  root: HTMLElement;
  stage: HTMLElement;
  heroArt: HTMLElement | null;
  bar: HTMLElement | null;
  title: HTMLElement | null;
  left: HTMLElement[];
  right: HTMLElement[];
  paths: SVGPathElement[];
  ends: SVGRectElement[];
};

/** Order index the camera and focus follow while scrolling (0..5, fractional). */
const activeFloat = (progress: number) =>
  clamp01(progress / (5 * STEP + SPAN)) * (PART_COUNT - 1);

type Props = {
  res: Resources;
  refs: AssemblyRefs;
  wrapperRef: RefObject<HTMLDivElement>;
  onFirstFrame: () => void;
};

export default function Choreography({
  res,
  refs,
  wrapperRef,
  onFirstFrame,
}: Props) {
  const { invalidate, size } = useThree();
  const dom = useRef<Dom | null>(null);
  const hero = useRef({ x: 0, y: 0, w: 480 });
  const cur = useRef({ p: 0, g: 0, px: 0, py: 0, frames: 0 });
  const tmp = useRef({
    v: new THREE.Vector3(),
    o: new THREE.Object3D(),
  });

  useEffect(() => {
    const root = document.getElementById('kairo-scene');
    const stageEl = root?.querySelector<HTMLElement>('[data-stage]');
    if (!root || !stageEl) return undefined;

    const query = <T extends Element>(selector: string) =>
      Array.from(root.querySelectorAll<T>(selector));
    const annots = query<HTMLElement>('[data-annot]');
    dom.current = {
      root,
      stage: stageEl,
      heroArt: document.querySelector<HTMLElement>('[data-hero-art]'),
      bar: root.querySelector<HTMLElement>('[data-progress]'),
      title: root.querySelector<HTMLElement>('[data-title]'),
      left: annots.filter((el) => el.dataset.annot === 'left'),
      right: annots.filter((el) => el.dataset.annot === 'right'),
      paths: query<SVGPathElement>('[data-leader]'),
      ends: query<SVGRectElement>('[data-leader-end]'),
    };

    const measure = () => {
      const art = dom.current?.heroArt;
      if (!art) return;
      const r = art.getBoundingClientRect();
      hero.current = {
        x: r.left + r.width / 2 + window.scrollX,
        y: r.top + r.height / 2 + window.scrollY,
        w: r.width,
      };
      invalidate();
    };
    measure();
    document.fonts?.ready.then(measure);

    const onPointer = (e: PointerEvent) => {
      stage.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      stage.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
      invalidate();
    };
    const wake = () => invalidate();

    stage.invalidate = invalidate;
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', measure);
    invalidate();

    return () => {
      stage.invalidate = () => undefined;
      stage.pointerX = 0;
      stage.pointerY = 0;
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', measure);
      dom.current = null;
    };
  }, [invalidate]);

  useFrame((state, delta) => {
    const d = dom.current;
    if (!d) return;
    const dt = Math.min(delta, 0.05);
    const c = cur.current;
    const { v, o } = tmp.current;

    c.p = damp(c.p, stage.progress, 5.5, dt);
    c.g = damp(c.g, stage.glide, 5.5, dt);
    c.px = damp(c.px, stage.pointerX, 3, dt);
    c.py = damp(c.py, stage.pointerY, 3, dt);

    const vw = size.width;
    const vh = size.height;
    const sr = d.stage.getBoundingClientRect();
    const offsetY = Math.min(0, sr.top);
    const gone = sr.top <= -vh;

    // ---- camera: one move around the assembly, scrubbed by progress ----
    const camera = state.camera as THREE.PerspectiveCamera;
    const t = ease(c.p);
    const g = ease(c.g);
    const az = lerp(AZ0, AZ1, t) + c.px * lerp(0.1, 0.04, g);
    const elev = lerp(EL0, EL1, t) + c.py * 0.03;
    const modeOn =
      d.root.closest<HTMLElement>('[data-scene3d]')?.dataset.scene3d === 'on';
    const annotW = modeOn ? d.left[0]?.offsetWidth ?? 260 : 260;
    const fitW = (vw - 2 * (COL_EDGE + annotW + 56)) / 3.84;
    // Hero fit: width of the column and height of the stacked assembly at its rest pose.
    const heroH =
      5 * PITCH_CLOSED * Math.cos(EL0) +
      (PLATE_D * Math.cos(AZ0) + PLATE_W * Math.abs(Math.sin(AZ0))) *
        Math.sin(EL0) +
      0.6;
    const heroPpu = Math.min((hero.current.w * 1.1) / 3.76, (vh * 0.8) / heroH);
    const startPpu = Math.min(vh * 0.16, fitW);
    const endPpu = Math.min((vh * 0.76) / 6.05, fitW);
    const ppu = Math.max(lerp(lerp(heroPpu, startPpu, g), endPpu, t), 40);
    const dist = vh / (2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2) * ppu);
    camera.position.set(
      Math.sin(az) * Math.cos(elev) * dist,
      Math.sin(elev) * dist,
      Math.cos(az) * Math.cos(elev) * dist
    );
    camera.lookAt(0, 0, 0);
    // The studio reflections slide across the metal with pointer, scroll and glide.
    state.scene.environmentRotation.set(0, az * 0.9 + c.px * 0.7 + t * 0.6, 0);
    camera.near = Math.max(dist - 14, 0.5);
    camera.far = dist + 20;
    const shiftX = (1 - g) * (hero.current.x - vw / 2);
    const shiftY = (1 - g) * (hero.current.y - vh / 2);
    camera.setViewOffset(vw, vh, -shiftX, -shiftY, vw, vh);
    camera.updateMatrixWorld();

    // ---- plates, rods ----
    const ys: number[] = [];
    const seps: number[] = [];
    for (let i = 0; i < PART_COUNT; i += 1) {
      const s = separation(i, c.p);
      seps.push(s);
      ys.push(lerp(closedY(i), openY(i), s));
      const plate = refs.plates[i];
      if (plate) plate.position.y = ys[i];
      const pad = refs.pads[i];
      if (pad) pad.position.y = lerp(PAD_REST, PAD_SEATED, ease(s));
      // Traces light in sequence, each module as it separates.
      const lit = ease(s);
      setTrace(res.trace[i].p, lerp(TRACE.pRest, TRACE.pLit, lit));
      setTrace(res.trace[i].s, lerp(TRACE.sRest, TRACE.sLit, lit));
    }

    // Active module index the labels follow.
    const af = activeFloat(c.p);

    const { rods } = refs;
    if (rods) {
      let k = 0;
      for (let j = 0; j < PART_COUNT - 1; j += 1) {
        const top = ys[j] - PLATE_T / 2;
        const bottom = ys[j + 1] + PLATE_T / 2;
        const len = top - bottom;
        for (let n = 0; n < ROD_SITES.length; n += 1) {
          const [x, z] = ROD_SITES[n];
          o.position.set(x, (top + bottom) / 2, z);
          o.scale.set(1, len > 0.05 ? len : 0.0001, 1);
          o.updateMatrix();
          rods.setMatrixAt(k, o.matrix);
          k += 1;
        }
      }
      rods.instanceMatrix.needsUpdate = true;
    }

    // ---- DOM: annotations, leaders, progress (no React) ----
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.style.transform = `translate3d(0, ${offsetY}px, 0)`;
      wrapper.style.visibility = gone ? 'hidden' : 'visible';
    }

    if (modeOn && !gone) {
      if (d.bar) d.bar.style.transform = `scaleX(${c.p.toFixed(4)})`;

      const projectY = (x: number, y: number, z: number) => {
        v.set(x, y, z).project(camera);
        return { x: ((v.x + 1) / 2) * vw, y: ((1 - v.y) / 2) * vh };
      };

      const arrange = (blocks: HTMLElement[], minTop: number) => {
        const hs = blocks.map((b) => b.offsetHeight);
        const tops = hs.map(
          (h, i) => projectY(0, openY(i), PLATE_D / 2).y - h / 2
        );
        for (let i = 1; i < tops.length; i += 1) {
          tops[i] = Math.max(tops[i], tops[i - 1] + hs[i - 1] + 14);
        }
        tops[0] = Math.max(tops[0], minTop);
        for (let i = 1; i < tops.length; i += 1) {
          tops[i] = Math.max(tops[i], tops[i - 1] + hs[i - 1] + 14);
        }
        const over = tops[tops.length - 1] + hs[hs.length - 1] - (vh - 64);
        if (over > 0)
          tops.forEach((_, i) => {
            tops[i] -= over;
          });
        return { tops, hs };
      };

      const titleBottom = d.title
        ? d.title.offsetTop + d.title.offsetHeight + 18
        : 24;
      const left = arrange(d.left, titleBottom);
      const right = arrange(d.right, 24);
      const reveal = ease(clamp01((c.g - 0.92) / 0.08));
      const stageW = sr.width;

      for (let i = 0; i < PART_COUNT; i += 1) {
        const shown = reveal * ease(clamp01((seps[i] - 0.55) / 0.4));
        // Active module reads at full strength; the rest sit back but stay legible.
        const act = 1 - clamp01(Math.abs(af - SEPARATION_ORDER.indexOf(i)));
        const a = shown * (DIM + (1 - DIM) * ease(act));
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = 0;
        let maxY = 0;
        [-1, 1].forEach((sx) =>
          [-1, 1].forEach((sz) => {
            const q = projectY((sx * PLATE_W) / 2, ys[i], (sz * PLATE_D) / 2);
            if (q.x < minX) {
              minX = q.x;
              minY = q.y;
            }
            if (q.x > maxX) {
              maxX = q.x;
              maxY = q.y;
            }
          })
        );

        const sides = [
          {
            els: d.left,
            geo: left,
            x: COL_EDGE,
            edge: COL_EDGE + annotW,
            dir: 1,
            cx: minX,
            cy: minY,
          },
          {
            els: d.right,
            geo: right,
            x: stageW - COL_EDGE - annotW,
            edge: stageW - COL_EDGE - annotW,
            dir: -1,
            cx: maxX,
            cy: maxY,
          },
        ];
        sides.forEach((side, n) => {
          const block = side.els[i];
          if (!block) return;
          const top = side.geo.tops[i];
          block.style.transform = `translate3d(${side.x}px, ${top.toFixed(
            1
          )}px, 0)`;
          block.style.opacity = a.toFixed(3);
          const by = top + 15;
          const path = d.paths[i * 2 + n];
          const end = d.ends[i * 2 + n];
          if (path) {
            path.setAttribute(
              'd',
              `M${(side.edge + side.dir * LEADER_GAP).toFixed(1)} ${by.toFixed(
                1
              )}L${(side.edge + side.dir * (LEADER_GAP + 24)).toFixed(
                1
              )} ${by.toFixed(1)}L${side.cx.toFixed(1)} ${side.cy.toFixed(1)}`
            );
            path.style.opacity = a.toFixed(3);
          }
          if (end) {
            end.setAttribute('x', (side.cx - 3).toFixed(1));
            end.setAttribute('y', (side.cy - 3).toFixed(1));
            end.style.opacity = a.toFixed(3);
          }
        });
      }
    }

    c.frames += 1;
    if (c.frames === 2) onFirstFrame();

    const moving =
      Math.abs(stage.progress - c.p) > 0.0004 ||
      Math.abs(stage.glide - c.g) > 0.0004 ||
      Math.abs(stage.pointerX - c.px) > 0.002 ||
      Math.abs(stage.pointerY - c.py) > 0.002 ||
      c.frames < 4;
    if (moving && !gone) invalidate();
  });

  return null;
}
