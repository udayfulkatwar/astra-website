import { noiseGLSL } from './common'

/* ------------------------------------------------------------------ rings */

/** Hairline gate ring. uv.x runs around the ring; a scan arc travels it. */
export const ringVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main(){
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = normalize(cameraPosition - w.xyz);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

export const ringFragment = /* glsl */ `
uniform float uTime;
uniform float uPhase;
uniform float uSpeed;
uniform float uLock;
uniform float uGates;
uniform float uFlash;
uniform vec3 uBone;
uniform vec3 uEmber;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main(){
  float u = vUv.x;
  float head = fract(uTime * uSpeed + uPhase);
  float d = fract(u - head + 1.0);
  // a comet: bright head, long fading tail
  float arc = smoothstep(0.0, 0.004, d) * (1.0 - smoothstep(0.004, 0.16, d));
  float lit = arc;
  float rim = 0.55 + 0.45 * pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.6);
  vec3 base = mix(uBone * 0.55, uEmber * 0.9, uLock * 0.75);
  vec3 col = base * rim + uEmber * 2.6 * lit + uEmber * 1.8 * uFlash;
  float a = mix(0.42, 0.75, max(uGates, uLock)) * rim + lit * 0.8 + uFlash * 0.5;
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
  #include <colorspace_fragment>
}
`

export const tickVertex = /* glsl */ `
attribute float aMajor;
varying float vMajor;
void main(){
  vMajor = aMajor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
export const tickFragment = /* glsl */ `
uniform vec3 uBone;
uniform vec3 uEmber;
uniform float uLock;
uniform float uOpacity;
varying float vMajor;
void main(){
  vec3 col = mix(uBone, uEmber, uLock * 0.6);
  gl_FragColor = vec4(col, (0.22 + vMajor * 0.35) * uOpacity);
  #include <colorspace_fragment>
}
`

/* ------------------------------------------------------------------- core */

export const coreVertex = /* glsl */ `
varying vec3 vN;
varying vec3 vV;
varying vec3 vP;
void main(){
  vP = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = normalize(cameraPosition - w.xyz);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

export const coreFragment = /* glsl */ `
uniform float uTime;
uniform float uLock;
uniform vec3 uEmber;
uniform vec3 uLilac;
uniform vec3 uBone;
varying vec3 vN;
varying vec3 vV;
varying vec3 vP;
${noiseGLSL}
void main(){
  vec3 p = normalize(vP);
  float facing = max(dot(normalize(vN), normalize(vV)), 0.0);
  float f = pow(1.0 - facing, 2.0);
  float n = fbm3(p * 1.6 + vec3(0.0, uTime * 0.18, uTime * 0.1));
  // slow liquid bands, kept low-contrast so the core reads as light, not texture
  float bands = sin((p.y * 1.4 + n * 0.9) * 7.0 + uTime * 0.9) * 0.5 + 0.5;
  vec3 hot = uBone * 1.25 + uEmber * 0.9;
  vec3 col = mix(uEmber * 1.15, hot, pow(facing, 3.0));
  col += uEmber * bands * 0.12;
  vec3 rim = mix(uLilac * 1.6, uEmber * 1.8, uLock);
  col = mix(col, rim, f * 0.85);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`

export const haloVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
export const haloFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
uniform float uTime;
uniform float uFalloff;
varying vec2 vUv;
void main(){
  float d = length(vUv - 0.5) * 2.0;
  float g = exp(-d * d * uFalloff) * 0.85 + exp(-d * 3.2) * 0.2;
  g *= 1.0 + 0.05 * sin(uTime * 1.3);
  gl_FragColor = vec4(uColor, g * uIntensity * (1.0 - smoothstep(0.85, 1.0, d)));
  #include <colorspace_fragment>
}
`

/* ---------------------------------------------------------------- streaks */

/**
 * Each streak is two vertices (tail, head) evaluated along one of four paths:
 * orbit the core → stream in from the markets → run the gate tunnel → AI cloud.
 * In the tunnel every non-passing streak is rejected at one gate and thrown clear.
 */
export const streakVertex = /* glsl */ `
uniform float uTime;
uniform float uSignals;
uniform float uGates;
uniform float uLock;
uniform vec3 uCoreC;
uniform float uCoreScale;
uniform vec3 uTunnelStart;
uniform vec3 uTunnelDir;
uniform float uGap;
uniform float uTunnelR;
uniform vec2 uVis;
uniform vec3 uBone;
uniform vec3 uEmber;
uniform vec3 uLilac;
uniform vec3 uPass;
attribute vec4 aSeed;
attribute float aEnd;
varying vec3 vColor;
varying float vAlpha;

${noiseGLSL}

const float TAU = 6.2831853;

vec3 orbitPath(float t, vec4 s){
  vec3 axis = normalize(vec3(s.z - 0.5, 1.0, s.x - 0.5) + vec3(0.0, 0.0, 0.0));
  vec3 u = normalize(cross(axis, vec3(0.31, 0.12, 0.94)));
  vec3 v = cross(axis, u);
  float r = (0.6 + pow(s.y, 0.8) * 1.75) * uCoreScale;
  float a = t * TAU + s.w * TAU;
  return uCoreC + (u * cos(a) + v * sin(a)) * r;
}

vec3 inflowPath(float t, vec4 s){
  // sources sit on a wide ellipse around the core, skipping the sector behind the copy
  float th = mix(-2.05, 2.05, s.x);
  vec3 start = uCoreC + vec3(cos(th) * uVis.x * 0.62, sin(th) * uVis.y * 0.72, (s.z - 0.5) * 4.0 - 1.0);
  float e = pow(t, 1.25);
  vec3 p = mix(start, uCoreC, e);
  vec3 toC = normalize(uCoreC - start);
  vec3 side = normalize(cross(toC, vec3(0.0, 0.0, 1.0)));
  float bend = sin(e * 3.14159) * (0.5 + s.w * 0.9) * uCoreScale;
  p += side * bend * (s.y > 0.5 ? 1.0 : -1.0);
  p += snoiseVec(p * 0.35 + vec3(uTime * 0.05)) * 0.12 * (1.0 - e);
  return p;
}

vec3 tunnelPath(float t, vec4 s, out float fail, out float passed){
  float len = uGap * 8.0;
  float along = t * (len + 1.4) - 0.6;
  vec3 side = normalize(cross(uTunnelDir, vec3(0.0, 1.0, 0.0)));
  vec3 up = normalize(cross(side, uTunnelDir));
  float a = s.z * TAU + t * 2.4;
  float r = uTunnelR * 0.78 * sqrt(s.y);
  vec3 off = side * cos(a) * r + up * sin(a) * r;
  bool pass = s.w > 0.955;
  float k = floor(fract(s.w * 7.13) * 9.0);
  float gateAt = k * uGap;
  fail = 0.0;
  passed = 0.0;
  if (!pass && along > gateAt) {
    float d = along - gateAt;
    fail = clamp(d / 0.55, 0.0, 1.0);
    along = gateAt + d * 0.25;
    vec3 outward = normalize(off + up * 0.001);
    off += outward * d * (0.55 + s.x * 0.5) + up * d * d * (s.x - 0.5) * 0.35;
  }
  if (pass && along > len) {
    float d = clamp((along - len) / 1.2, 0.0, 1.0);
    off *= 1.0 - d;
    passed = d;
  }
  return uTunnelStart + uTunnelDir * along + off;
}

vec3 cloudPath(float t, vec4 s){
  float ph = s.x * TAU + t * TAU * 0.35;
  float th = acos(1.0 - 2.0 * s.y);
  float R = (1.62 + s.z * 0.55) * 1.45 * uCoreScale;
  vec3 dir = vec3(sin(th) * cos(ph), cos(th) * 0.82, sin(th) * sin(ph));
  vec3 p = uCoreC + dir * R;
  p += snoiseVec(p * 0.6 + vec3(uTime * 0.08)) * 0.18 * uCoreScale;
  return p;
}

float stag(float v, float s){ return smoothstep(0.0, 1.0, clamp(v * 1.35 - s * 0.35, 0.0, 1.0)); }

void main(){
  float sp = mix(0.045, 0.11, aSeed.x);
  float sig = stag(uSignals, aSeed.y);
  float gat = stag(uGates, aSeed.z);
  float lck = stag(uLock, aSeed.x);
  float speed = sp * mix(1.0, 1.7, sig) * mix(1.0, 1.25, gat) * mix(1.0, 0.45, lck);
  float len = mix(mix(0.011, 0.028, sig), 0.04, gat) * mix(1.0, 0.45, lck);
  float t = fract(uTime * speed + aSeed.w * 13.0) - (1.0 - aEnd) * len;
  t = clamp(t, 0.0, 1.0);

  float fail, passed;
  vec3 p = orbitPath(t, aSeed);
  if (sig > 0.0) p = mix(p, inflowPath(t, aSeed), sig);
  if (gat > 0.0) {
    vec3 tp = tunnelPath(t, aSeed, fail, passed);
    p = mix(p, tp, gat);
  } else { fail = 0.0; passed = 0.0; }
  if (lck > 0.0) p = mix(p, cloudPath(t, aSeed), lck);

  vec3 cOrbit = mix(uLilac, uBone, step(0.55, aSeed.y)) * 0.9;
  vec3 cIn = mix(uBone, uLilac, aSeed.z * 0.5);
  vec3 cTun = mix(uBone, uEmber * 1.6, fail);
  cTun = mix(cTun, uPass * 1.8, passed);
  if (aSeed.w > 0.955) cTun = mix(uBone * 1.4, uPass * 1.8, 0.35 + passed * 0.65);
  vec3 c = mix(cOrbit, cIn, sig);
  c = mix(c, cTun, gat);
  c = mix(c, uLilac * 1.1, lck);
  vColor = c;

  float ends = smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.93, 1.0, t));
  float a = aEnd * (0.35 + 0.65 * aSeed.y) * mix(0.55, 1.0, max(sig, gat));
  a *= mix(1.0, ends, max(sig, gat));
  a *= 1.0 - gat * smoothstep(0.2, 1.0, fail);
  vAlpha = a * mix(0.75, 0.55, lck);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`

export const streakFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  gl_FragColor = vec4(vColor, vAlpha);
  #include <colorspace_fragment>
}
`

/* -------------------------------------------------------------- atmosphere */

export const dustVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform vec2 uPointer;
attribute vec4 aSeed;
varying float vAlpha;
void main(){
  vec3 p = position;
  p.y += sin(uTime * 0.05 + aSeed.x * 6.28) * 0.2;
  p.xy += uPointer * (0.1 + 0.3 * aSeed.w) * (p.z + 6.0) * 0.06;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.6 + 0.4 * sin(uTime * (0.6 + aSeed.y * 1.6) + aSeed.z * 6.28);
  vAlpha = (0.18 + 0.55 * aSeed.w) * tw;
  gl_PointSize = (8.0 + 18.0 * aSeed.w * aSeed.w) * uPixelRatio / -mv.z;
}
`
export const dustFragment = /* glsl */ `
uniform vec3 uBone;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uBone, smoothstep(0.5, 0.0, d) * vAlpha);
  #include <colorspace_fragment>
}
`

/** Radar plate under the core: rings, spokes and a slow sweep, all analytic. */
export const plateVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
export const plateFragment = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uBone;
uniform vec3 uLilac;
varying vec2 vUv;
float aaLine(float v, float w){ float fw = fwidth(v); return 1.0 - smoothstep(w * fw, (w + 1.0) * fw, abs(v)); }
void main(){
  vec2 q = vUv * 2.0 - 1.0;
  float r = length(q);
  if (r > 1.0) discard;
  float ang = atan(q.y, q.x);
  float rings = aaLine(fract(r * 9.0 + 0.5) - 0.5, 0.6);
  float spokes = aaLine(fract(ang / 6.2831853 * 24.0 + 0.5) - 0.5, 0.35) * step(0.12, r) * 0.6;
  float sweepA = fract((ang / 6.2831853) - uTime * 0.04);
  float sweep = pow(1.0 - sweepA, 18.0) * smoothstep(1.0, 0.1, r);
  float fade = smoothstep(1.0, 0.25, r) * smoothstep(0.0, 0.08, r);
  vec3 col = uBone * (rings * 0.55 + spokes * 0.18) + uLilac * sweep * 0.9;
  float a = (rings * 0.55 + spokes * 0.18 + sweep * 0.5) * fade * uOpacity;
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}
`
