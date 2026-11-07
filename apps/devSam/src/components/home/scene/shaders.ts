// GLSL for the home page's two scenes. Colours stay in the linear working space
// (textures decode from sRGB in hardware, the composer or the renderer converts
// once at the end), so a screen at rest reproduces its source pixels.

/** Acid accent #c8ff2e in linear space; pushed above 1 only where it glows. */
export const ACID = 'vec3(0.578, 1.0, 0.027)';

/* ------------------------------------------------------------------ *
 * Screens
 * ------------------------------------------------------------------ */

/**
 * Whites are pulled down to deep dark surfaces, hue is kept (dimmed and partly
 * desaturated), contrast is reduced. Same treatment as the layered-screen
 * backdrops, so white UIs never blind while they wait in the dark.
 */
const DARKEN = /* glsl */ `
vec3 darken(vec3 c) {
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float white = smoothstep(0.55, 0.92, min(min(c.r, c.g), c.b));
  vec3 surface = vec3(0.012, 0.0145, 0.017);
  vec3 ink = mix(vec3(l), c, 0.78) * 0.34;
  vec3 col = mix(ink, surface, white);
  col = mix(vec3(0.02), col, 0.82);
  return col / (1.0 + col * 7.0);
}
`;

/* ------------------------------------------------------------------ *
 * Shared: floor vertex stage and the sky
 * ------------------------------------------------------------------ */

export const FLOOR_VERT = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * p;
}
`;

/** Faint horizon light: the scene never ends in a flat colour. */
export const SKY_FRAG = /* glsl */ `
uniform vec3 uBg;
uniform vec3 uTint;
varying vec3 vDir;
void main() {
  float h = abs(vDir.y);
  float glow = exp(-h * 7.0);
  float up = exp(-max(vDir.y, 0.0) * 2.4) * 0.4;
  gl_FragColor = vec4(uBg + uTint * (glow + up * 0.5), 1.0);
  #include <colorspace_fragment>
}
`;

/* ------------------------------------------------------------------ *
 * Ring
 * ------------------------------------------------------------------ */

/**
 * Panel of the ring, bent around the viewer: the flat quad is wrapped on a
 * cylinder of radius uBend, concave toward the camera.
 */
export const RING_PANEL_VERT = /* glsl */ `
uniform vec2 uSize;
uniform float uBend;
varying vec2 vUv;
void main() {
  vUv = uv;
  float x = position.x * uSize.x;
  float a = x / uBend;
  vec3 pos = vec3(sin(a) * uBend, position.y * uSize.y, (1.0 - cos(a)) * uBend);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

/**
 * Image panels keep the whole screen (contained in the frame, never cropped);
 * typographic panels are already dark and only change brightness. Dark until
 * centred, then lit at full fidelity. uMark outlines the panels of the chosen
 * area; uDim pushes the others back.
 */
export const RING_PANEL_FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform vec2 uSize;
uniform float uRadius;
uniform float uLit;
uniform float uDim;
uniform float uMark;
uniform float uImage;
uniform float uFit;
uniform float uHasMap;
uniform float uAspect;
varying vec2 vUv;
${DARKEN}

float sdBox(vec2 p, vec2 hs, float r) {
  vec2 q = abs(p) - hs + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = (vUv - 0.5) * uSize;
  float d = sdBox(p, 0.5 * uSize, uRadius);
  float aa = max(fwidth(d), 1e-4);
  float cover = clamp(0.5 - d / aa, 0.0, 1.0);

  // Fit the picture inside the frame: uFit is image aspect / frame aspect.
  vec2 uv = vUv;
  float inside = 1.0;
  if (uImage > 0.5) {
    vec2 s = uFit >= 1.0 ? vec2(1.0, 1.0 / uFit) : vec2(uFit, 1.0);
    uv = (vUv - 0.5) / s + 0.5;
    inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    uv = clamp(uv, 0.0, 1.0);
  }
  vec3 c = uHasMap > 0.5 ? texture2D(uMap, uv).rgb : vec3(0.02);
  vec3 plate = vec3(0.012, 0.0145, 0.017);
  vec3 base = mix(plate, min(c, vec3(1.0)), inside);

  vec3 col;
  if (uImage > 0.5) {
    vec3 dark = mix(plate, darken(c), inside) * 1.5;
    col = mix(dark, base, uLit);
  } else {
    col = base * (0.5 + 0.5 * uLit);
  }
  col *= mix(1.0, 0.2, uDim);

  float inner = -d;
  float ring = smoothstep(-aa * 0.2, aa * 0.4, inner) *
    (1.0 - smoothstep(aa * 1.0, aa * 2.4, inner));
  float rim = max(uLit * 0.9, uMark);
  col += ${ACID} * ring * rim * 0.95 * (1.0 - uDim);
  col += vec3(0.07) * ring * (1.0 - rim) * (1.0 - uDim);

  gl_FragColor = vec4(col, cover);
  #include <colorspace_fragment>
}
`;

export const ringFloorFrag = () => /* glsl */ `
uniform vec3 uBg;
uniform float uRadius;
uniform float uRot;
uniform float uPool;
uniform float uTicks;
varying vec3 vWorld;

void main() {
  vec2 p = vWorld.xz;
  float r = length(p);
  float dist = length(p - cameraPosition.xz);
  vec2 gp = p * 0.25;
  vec2 g = abs(fract(gp - 0.5) - 0.5) / max(fwidth(gp), vec2(1e-4));
  float major = 1.0 - min(min(g.x, g.y), 1.0);
  float fade = 1.0 - smoothstep(10.0, 52.0, r);
  vec3 col = uBg * 1.25 + vec3(0.55, 0.62, 0.58) * major * 0.07 * fade;

  // The track under the panels, with ticks that turn with the ring.
  float ang = atan(p.x, -p.y);
  float aw = max(fwidth(r), 1e-3);
  float track = exp(-pow((r - uRadius) / (aw * 1.4 + 0.035), 2.0));
  float tick = smoothstep(0.78, 0.9, 0.5 + 0.5 * cos(ang * uTicks - uRot));
  float band = exp(-pow((r - uRadius + 0.55) / 0.22, 2.0));
  col += ${ACID} * track * 0.32;
  col += ${ACID} * band * tick * 0.02;

  // Light pooled under the centred panel.
  vec2 dc = p - vec2(0.0, -uRadius + 1.1);
  col += ${ACID} * exp(-dot(dc, dc) / (2.0 * 4.2 * 4.2)) * 0.012 * uPool;
  col += ${ACID} * track * exp(-dot(dc, dc) / (2.0 * 2.4 * 2.4)) * 0.22 * uPool;

  col = mix(uBg, col, 1.0 - smoothstep(30.0, 70.0, dist));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;
