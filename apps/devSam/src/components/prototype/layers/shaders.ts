// GLSL for the layered screen. Prototype-only.
//
// Colours stay in the linear working space: textures are decoded from sRGB by
// the hardware, the render target is linear, and the composer converts to sRGB
// once at the end, so a flat piece at rest reproduces its source pixels.

/** Acid accent #c8ff2e in linear space, pushed above 1 where it should glow. */
const ACID = 'vec3(0.578, 1.0, 0.027)';

export const PIECE_VERT = /* glsl */ `
uniform vec2 uCenter;
uniform vec2 uSize;
varying vec2 vUv;
varying vec2 vGroup;

void main() {
  vUv = uv;
  // Position of this fragment in the rest layout, in world units.
  vGroup = uCenter + (uv - 0.5) * uSize / 100.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const PIECE_FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform vec2 uSize;
uniform float uRadius;
uniform float uOpacity;
uniform float uOpen;
uniform float uShade;
uniform float uReveal;
uniform float uPlot;
uniform float uTravel;
uniform float uTravelAmp;
uniform vec2 uLightPos;
varying vec2 vUv;
varying vec2 vGroup;

float sdBox(vec2 p, vec2 hs, float r) {
  vec2 q = abs(p) - hs + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = (vUv - 0.5) * uSize;
  float d = sdBox(p, 0.5 * uSize, uRadius);
  float aa = max(fwidth(d), 1e-4);
  float cover = clamp(0.5 - d / aa, 0.0, 1.0);

  vec3 col = texture2D(uMap, vUv).rgb;

  // Chart plots: a mask wipe over the real pixels, left to right, with a thin
  // bright front. Unrevealed pixels show the pane's own white.
  float front = 0.0;
  if (uPlot > 0.5) {
    float f = 0.07;
    float e = uReveal * (1.0 + f) - f;
    float m = 1.0 - smoothstep(e, e + f, vUv.x);
    col = mix(vec3(1.0), col, m);
    float x = vUv.x - (e + f * 0.5);
    front = exp(-x * x / 0.00012) * step(0.002, uReveal) * (1.0 - step(0.998, uReveal));
  }

  // Light response: depth shading, a soft pool of light that follows the
  // pointer and a faint diagonal sheen. All of it fades to zero when closed.
  vec2 dl = vGroup - uLightPos;
  float pool = exp(-dot(dl, dl) / (2.0 * 4.2 * 4.2));
  float band = dot(vGroup, vec2(0.82, 0.57)) - uLightPos.x * 0.8 - 1.2;
  float sheen = exp(-band * band / 6.0);
  col *= uShade + uOpen * 0.12 * pool;
  col += vec3(0.05) * sheen * uOpen * uShade;

  // Thin bright edge, brightest where it faces the light (top and left).
  float inner = -d;
  float ring = smoothstep(-aa * 0.2, aa * 0.4, inner) *
    (1.0 - smoothstep(aa * 0.9, aa * 1.9, inner));
  vec2 q = abs(p) - 0.5 * uSize + uRadius;
  vec2 n = normalize(sign(p) * max(q + vec2(1e-3), vec2(0.0)) + vec2(1e-5));
  float facing = clamp(dot(n, vec2(-0.5, 0.86)), 0.0, 1.0);
  col = mix(col, vec3(0.96, 1.0, 0.93), ring * (0.2 + 0.8 * facing) * 0.9 * uOpen);

  // Faces never exceed paper white; only the accent is allowed to glow.
  col = min(col, vec3(1.0));

  // One traveling light along the separating edges, in the accent colour.
  float tr = exp(-pow((vGroup.x - uTravel) / 1.1, 2.0));
  col += ${ACID} * ring * tr * uTravelAmp * 2.2 * uOpen;
  col += ${ACID} * front * 1.6;

  gl_FragColor = vec4(col, cover * uOpacity);
  #include <colorspace_fragment>
}
`;

/** Soft shadows of the children on their parent plane, from one pass. */
export const SHADOW_FRAG = /* glsl */ `
uniform vec2 uSize;
uniform float uRadius;
uniform float uStrength;
uniform vec2 uDir;
uniform int uCount;
uniform vec4 uRect[12];
uniform vec4 uInfo[12];
varying vec2 vUv;

float sdBox(vec2 p, vec2 hs, float r) {
  vec2 q = abs(p) - hs + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = (vUv - 0.5) * uSize;
  float acc = 0.0;
  for (int i = 0; i < 12; i++) {
    if (i >= uCount) break;
    vec4 r = uRect[i];
    vec4 inf = uInfo[i];
    float h = max(inf.x, 0.0);
    float k = clamp(h * 0.9, 0.0, 1.0) * inf.z;
    vec2 off = uDir * (6.0 + h * 34.0);
    float blur = 6.0 + h * 30.0;
    float s = 1.0 - smoothstep(-blur * 0.55, blur, sdBox(p - r.xy - off, r.zw, inf.y));
    acc = 1.0 - (1.0 - acc) * (1.0 - s * 0.36 * k / (1.0 + 0.1 * h));
    float c = 1.0 - smoothstep(-1.0, 4.0 + h * 2.0, sdBox(p - r.xy - off * 0.18, r.zw, inf.y));
    acc = 1.0 - (1.0 - acc) * (1.0 - c * 0.3 * k);
  }
  float dp = sdBox(p, 0.5 * uSize, uRadius);
  float aa = max(fwidth(dp), 1e-4);
  float cover = clamp(0.5 - dp / aa, 0.0, 1.0);
  gl_FragColor = vec4(vec3(0.004, 0.007, 0.012), acc * cover * uStrength);
  #include <colorspace_fragment>
}
`;

export const FLAT_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Backdrop screens: whites are pulled down to deep dark surfaces, hue is kept
 * (dimmed and partly desaturated), contrast is reduced, and distance plus a
 * soft border make each one dissolve into the dark world.
 */
export const BACKDROP_FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform float uOpacity;
uniform float uDist;
varying vec2 vUv;

void main() {
  vec3 c = texture2D(uMap, vUv).rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float white = smoothstep(0.55, 0.92, min(min(c.r, c.g), c.b));
  vec3 surface = vec3(0.012, 0.0145, 0.017);
  vec3 ink = mix(vec3(l), c, 0.78) * 0.3;
  vec3 col = mix(ink, surface, white);
  col = mix(vec3(0.02), col, 0.8);
  // Even dark sources stay a quiet texture, never a readable competitor.
  col = col / (1.0 + col * 9.0);
  float fog = 1.0 - smoothstep(34.0, 92.0, uDist);
  vec2 e = min(vUv, 1.0 - vUv);
  float edge = smoothstep(0.0, 0.1, e.x) * smoothstep(0.0, 0.14, e.y);
  gl_FragColor = vec4(col * (0.35 + 0.65 * fog), uOpacity * edge * (0.25 + 0.75 * fog));
  #include <colorspace_fragment>
}
`;

/** A very soft acid haze behind the screen: the focus glow. */
export const GLOW_FRAG = /* glsl */ `
uniform float uStrength;
varying vec2 vUv;

void main() {
  vec2 p = (vUv - 0.5) * vec2(1.0, 1.25) * 2.0;
  float g = exp(-dot(p, p) * 3.4);
  gl_FragColor = vec4(${ACID} * 0.5, g * uStrength);
  #include <colorspace_fragment>
}
`;
