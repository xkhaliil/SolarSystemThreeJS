export default `
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vWave;
varying float vFast;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float valueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash(i); float n100 = hash(i + vec3(1,0,0));
  float n010 = hash(i + vec3(0,1,0)); float n110 = hash(i + vec3(1,1,0));
  float n001 = hash(i + vec3(0,0,1)); float n101 = hash(i + vec3(1,0,1));
  float n011 = hash(i + vec3(0,1,1)); float n111 = hash(i + vec3(1,1,1));
  return mix(mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y),
             mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y), f.z);
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float facing = max(dot(n, viewDir), 0.0);

  // Limb darkening
  float limb = pow(facing, 0.28);

  // Solar granulation from vertex data
  float gran = smoothstep(0.28, 0.72, vWave * 0.55 + vFast * 0.45);

  // Abyss: mouse/scroll-driven vertical gradient
  float gradient = smoothstep(-1.8, 2.1, vWorldPos.y + uMouse.y * 1.4 + uScroll * 0.4);

  // Abyss: scroll-driven stripe detail (solar plasma bands)
  float stripe = sin(vWorldPos.y * 8.0 + uTime * 3.2 + uScroll * 18.0) * 0.5 + 0.5;

  // Solar flares: equatorial streaks driven by scroll
  vec3 wp = normalize(vWorldPos);
  float eq = 1.0 - abs(wp.y);
  float flareMask = smoothstep(0.55, 0.95, eq);
  float flareNoise = valueNoise(wp * 5.5 + vec3(uTime * 0.28 + uScroll * 1.2, 0.0, uTime * 0.15));
  float flare = pow(flareMask * flareNoise, 2.2) * (0.7 + abs(uScroll) * 0.6);

  // Base: mouse/scroll gradient between corona and surface tints
  vec3 base = mix(uColorB, uColorA, gradient);

  // Granulation brightens hot spots
  base = mix(base, uColorA * 1.15, gran * 0.38);

  // Abyss stripe + wave detail (now reads as solar plasma bands)
  base += stripe * 0.09;
  base += vWave * 0.06;

  // Solar flares
  base += mix(uColorB, vec3(1.4, 1.1, 0.6), flare) * flare * 0.9;

  // Corona rim glow
  float corona = pow(1.0 - facing, 3.2);
  base += uColorB * corona * 1.4;

  // Limb darkening
  base *= 0.28 + limb * 0.88;

  gl_FragColor = vec4(base, 1.0);
}
`;

