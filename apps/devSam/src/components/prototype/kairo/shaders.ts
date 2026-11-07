// Colours arrive in linear space and leave linear: the effect composer owns the
// final colour-space conversion. Every emissive result is capped by its largest
// channel (not per channel), so the acid hue survives bloom instead of clipping
// towards yellow-white.

const SQ = /* glsl */ `
float sq(float x) { return x * x; }
`;

const CAP = /* glsl */ `
vec3 capHue(vec3 c, float limit) {
  float m = max(c.r, max(c.g, c.b));
  return c * min(1.0, limit / max(m, 1e-4));
}
`;

// Conduits, hubs and rails are built with uv.x = arc-length fraction and
// uv.y = angle (tubes) or height (rail).
export const CONDUIT_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vN;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

// The outer glass of one conduit: fresnel rim, two reflected soft-boxes,
// machined seams around it and long seams along it. It fades into the distance.
export const GLASS_FRAG = /* glsl */ `
uniform vec3 uSteel;
uniform vec3 uAcid;
uniform float uActive;
uniform float uLen;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vN;
void main() {
  vec3 n = normalize(vN);
  vec3 v = normalize(cameraPosition - vWorld);
  float ndv = clamp(abs(dot(n, v)), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 3.0);
  vec3 r = reflect(-v, n);
  float soft = smoothstep(0.88, 0.985, dot(r, normalize(vec3(-0.35, 0.9, 0.45))));
  float back = smoothstep(0.84, 0.97, dot(r, normalize(vec3(0.7, 0.25, -0.65))));
  float s = vUv.x * uLen;
  float k = fract(s / 2.2);
  float ring = 1.0 - smoothstep(0.0, 0.05, min(k, 1.0 - k) * 2.2);
  float lon = 1.0 - smoothstep(0.0, 0.02, abs(fract(vUv.y * 6.0 + 0.5) - 0.5));
  float dist = length(cameraPosition - vWorld);
  float far = 1.0 - smoothstep(20.0, 38.0, dist);
  vec3 col = uSteel * (0.04 + 0.6 * fres)
    + vec3(0.78, 0.86, 0.94) * (soft * 0.26 + back * 0.2)
    + uAcid * fres * 0.34 * uActive
    + uSteel * (ring * 0.7 + lon * 0.16);
  float a = clamp(0.06 + 0.6 * fres + 0.3 * soft + 0.24 * back + 0.55 * ring + 0.12 * lon, 0.0, 0.9);
  if (!gl_FrontFacing) a *= 0.45;
  gl_FragColor = vec4(col * far, a * far);
}
`;

// The light inside one conduit. Its lit length is the quota. Streaks travel
// along it, the axis is a thin hot core, a bright front marks the level and a
// travelling band is the surge when the work lands here.
export const CORE_FRAG = /* glsl */ `
uniform float uTime;
uniform float uFront;
uniform float uActive;
uniform float uSpeed;
uniform float uFlare;
uniform float uSurge;
uniform float uSurgeAmt;
uniform float uLen;
uniform vec3 uAcid;
uniform vec3 uSteel;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vN;
${SQ}
${CAP}
void main() {
  vec3 n = normalize(vN);
  vec3 v = normalize(cameraPosition - vWorld);
  float ndv = abs(dot(n, v));
  float xn = vUv.x;
  float ang = vUv.y * 6.2832;
  float s = xn * uLen;
  float has = step(0.0001, uFront);
  float lit = (1.0 - smoothstep(uFront - 0.012, uFront + 0.003, xn)) * has;
  float dens = pow(ndv, 3.2);
  float hot = pow(ndv, 26.0);
  float st1 = 0.5 + 0.5 * sin(s * 2.4 - uTime * uSpeed * 3.2 + sin(ang * 2.0 + s * 0.4) * 1.4);
  float st2 = 0.5 + 0.5 * sin(s * 5.5 - uTime * uSpeed * 5.4 + ang * 3.0);
  float streak = pow(st1, 4.0) * (0.5 + 0.5 * st2);
  float edge = exp(-sq((xn - uFront) * 30.0)) * has;
  vec3 base = mix(uSteel * 0.85, uAcid, uActive);
  float rim = pow(1.0 - ndv, 2.0);
  vec3 c = base * lit * (0.035 + 0.3 * dens + 0.09 * rim * uActive + 0.55 * streak * dens * (0.25 + 0.75 * uActive));
  c += uAcid * lit * hot * (0.16 + 0.75 * uActive);
  c += mix(uSteel * 0.55, uAcid, uActive) * edge * (0.22 + 0.7 * uFlare) * (0.3 + 0.7 * dens);
  float sg = exp(-sq((xn - uSurge) * 9.0)) * uSurgeAmt;
  c += uAcid * sg * (0.18 + 0.7 * dens + 0.9 * hot);
  c += uSteel * (1.0 - lit) * 0.014 * dens;
  c = capHue(c, 0.9);
  float far = 1.0 - smoothstep(20.0, 38.0, length(cameraPosition - vWorld));
  gl_FragColor = vec4(c * far, 1.0);
}
`;

// The gauge rail under a conduit: ticks, a bar that is lit up to the quota and a
// bright front.
export const RAIL_FRAG = /* glsl */ `
uniform float uFront;
uniform float uActive;
uniform vec3 uAcid;
uniform vec3 uSteel;
varying vec2 vUv;
varying vec3 vWorld;
${SQ}
${CAP}
void main() {
  float t = vUv.x;
  float v = vUv.y;
  float k1 = t * 20.0;
  float minor = 1.0 - smoothstep(0.6, 1.6, abs(fract(k1 + 0.5) - 0.5) / max(fwidth(k1), 1e-4));
  float k2 = t * 4.0;
  float major = 1.0 - smoothstep(1.0, 2.2, abs(fract(k2 + 0.5) - 0.5) / max(fwidth(k2), 1e-4));
  float bar = 1.0 - smoothstep(0.1, 0.16, v);
  float tick = max(minor * step(v, 0.5), major * step(v, 0.95));
  float lit = step(t, uFront) * step(0.0001, uFront);
  float front = exp(-sq((t - uFront) * 70.0)) * step(0.0001, uFront) * step(v, 1.0);
  vec3 col = uSteel * (bar * 0.3 + tick * 0.3);
  col = mix(col, uAcid * (0.55 + 0.4 * uActive), lit * max(bar, tick * 0.9));
  col += uAcid * front * 0.8;
  col = capHue(col, 0.9);
  float far = 1.0 - smoothstep(20.0, 38.0, length(cameraPosition - vWorld));
  gl_FragColor = vec4(col * far, 1.0);
}
`;

// A cable from the role gate to a conduit: dim steel when idle, acid pulses
// when it carries the work, a band for the decision scan and one for the surge.
export const CABLE_FRAG = /* glsl */ `
uniform float uTime;
uniform float uActive;
uniform float uSurge;
uniform float uSurgeAmt;
uniform float uScan;
uniform float uScanAmt;
uniform float uSpeed;
uniform vec3 uAcid;
uniform vec3 uSteel;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vN;
${SQ}
${CAP}
void main() {
  vec3 n = normalize(vN);
  vec3 v = normalize(cameraPosition - vWorld);
  float ndv = abs(dot(n, v));
  float hot = pow(ndv, 5.0);
  float x = vUv.x;
  float pulse = pow(0.5 + 0.5 * sin(x * 54.0 - uTime * uSpeed * 6.0), 6.0);
  vec3 c = uSteel * (0.1 + 0.05 * hot);
  c += uAcid * uActive * hot * (0.2 + 0.5 * pulse);
  float sg = exp(-sq((x - uSurge) * 7.0)) * uSurgeAmt;
  c += uAcid * sg * (0.3 + 0.8 * hot);
  float sc = exp(-sq((x - uScan) * 9.0)) * uScanAmt;
  c += vec3(0.6, 0.7, 0.8) * sc * (0.25 + 0.75 * hot) * (1.0 - 0.6 * uActive);
  c = capHue(c, 0.85);
  gl_FragColor = vec4(c, 1.0);
}
`;

export const GLOW_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// A soft pool of light, added to what is behind it. Used inside the role gate.
export const GLOW_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
varying vec2 vUv;
${SQ}
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float d = length(p);
  float g = pow(max(0.0, 1.0 - d), 2.6);
  float ring = exp(-sq((d - 0.78) * 9.0)) * 0.35;
  vec3 c = uColor * (g * 0.3 + ring) * uIntensity;
  float m = max(c.r, max(c.g, c.b));
  c *= min(1.0, 0.85 / max(m, 1e-4));
  gl_FragColor = vec4(c, 1.0);
}
`;

export const FLOOR_VERT = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

// Dark polished floor: panel seams, and light that pools under each conduit in
// proportion to the work it carries. The pool follows the conduit's footprint,
// with a wide soft spill and a tight streak where the light is brightest.
export const FLOOR_FRAG = /* glsl */ `
uniform vec3 uBg;
uniform vec3 uSteel;
uniform vec3 uAcid;
uniform vec4 uSeg[2];
uniform vec2 uAmt;
varying vec3 vWorld;
float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  vec2 p = vWorld.xz;
  float dist = length(p - cameraPosition.xz);
  vec2 gp = p * 0.25;
  vec2 g = abs(fract(gp - 0.5) - 0.5) / max(fwidth(gp), vec2(1e-4));
  float major = 1.0 - min(min(g.x, g.y), 1.0);
  vec2 gp2 = p;
  vec2 g2 = abs(fract(gp2 - 0.5) - 0.5) / max(fwidth(gp2), vec2(1e-4));
  float minor = 1.0 - min(min(g2.x, g2.y), 1.0);
  float fade = 1.0 - smoothstep(14.0, 44.0, dist);
  vec3 col = uBg * 1.2 + uSteel * (major * 0.07 + minor * 0.02) * fade;
  for (int i = 0; i < 2; i++) {
    float d = segDist(p, uSeg[i].xy, uSeg[i].zw);
    float amt = i == 0 ? uAmt.x : uAmt.y;
    float tight = exp(-d * d / 1.3);
    float wide = exp(-d * d / 22.0);
    col += uAcid * (tight * 0.07 + wide * 0.028) * amt;
    col += uSteel * wide * 0.012;
  }
  col = mix(col, uBg, smoothstep(26.0, 60.0, dist));
  gl_FragColor = vec4(col, 1.0);
}
`;

// A faint horizon haze behind the architecture, so the pillars stand as
// silhouettes against a little light.
export const HAZE_FRAG = /* glsl */ `
uniform vec3 uBg;
uniform vec3 uTint;
uniform float uFloorY;
varying vec3 vWorld;
${SQ}
void main() {
  float h = max(0.0, vWorld.y - uFloorY);
  float g = exp(-h * 0.17);
  float side = 0.55 + 0.45 * exp(-sq((vWorld.x - 4.0) / 26.0));
  gl_FragColor = vec4(uBg + uTint * g * side, 1.0);
}
`;

// A shaft of light from above: additive, soft at the sides, brightest high up.
export const SHAFT_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uAmp;
uniform float uPhase;
uniform float uTime;
varying vec2 vUv;
void main() {
  float edge = smoothstep(0.0, 1.0, clamp(1.0 - abs(vUv.x - 0.5) * 2.0, 0.0, 1.0));
  float side = edge * edge;
  float up = smoothstep(0.0, 1.0, clamp(vUv.y, 0.0, 1.0));
  float vert = up * (1.0 - smoothstep(0.92, 1.0, vUv.y));
  float shimmer = 0.82 + 0.18 * sin(uTime * 0.25 + uPhase + vUv.y * 4.0);
  vec3 c = uColor * side * vert * uAmp * shimmer;
  gl_FragColor = vec4(c, 1.0);
}
`;

export const PLANE_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorld;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;
