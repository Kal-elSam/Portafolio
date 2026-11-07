import dynamic from 'next/dynamic';
import { Component, useEffect, useState } from 'react';

import type { ReactNode } from 'react';

// Loaded only after the client has confirmed it can run the scene, so no page
// that lacks 3D (and no first paint) waits on three.
const Scene3D = dynamic(() => import('./scene3d/Scene3D'), { ssr: false });

// Below 1280px the annotation columns no longer fit beside the assembly; the
// SVG drawing (already pinned from 1024px) carries those widths instead.
const QUERY = '(min-width: 1280px) and (prefers-reduced-motion: no-preference)';

export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export class Boundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  constructor(props: { onError: () => void; children: ReactNode }) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    const { onError } = this.props;
    onError();
  }

  render() {
    const { failed } = this.state;
    const { children } = this.props;
    return failed ? null : children;
  }
}

type SceneLayerProps = {
  ready: boolean;
  onReady: () => void;
  onFail: () => void;
};

export default function SceneLayer({
  ready,
  onReady,
  onFail,
}: SceneLayerProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    let supported: boolean | null = null;
    const update = () => {
      if (mq.matches && supported === null) supported = hasWebGL();
      const next = mq.matches && supported === true;
      setEnabled(next);
      if (!next) onFail();
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
    // onFail is stable (useCallback in the page).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;
  return (
    <Boundary onError={onFail}>
      <Scene3D ready={ready} onReady={onReady} onFail={onFail} />
    </Boundary>
  );
}
