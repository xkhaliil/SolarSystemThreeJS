export default `
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uPulse;
uniform float uDistortion;

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

  float n000 = hash(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);
  return mix(nxy0, nxy1, f.z);
}

void main() {
  vec3 pos = position;
  vec3 normalRef = normalize(normal);

  // Abyss: pointer bends the surface toward the mouse direction
  float pointerInfluence = dot(normalRef, normalize(vec3(uMouse.xy * 0.8, 1.0)));

  // Abyss: scroll-driven wave stripes across the surface
  float wave = sin((normalRef.y + uTime * 0.9 + uScroll * 1.8) * 5.2) * 0.5 + 0.5;

  // Solar: large slow convection cells
  float slowCell = valueNoise(normalRef * 2.1 + vec3(uTime * 0.06, 0.0, -uTime * 0.04));

  // Solar: small fast granules
  float fastGranule = valueNoise(normalRef * 5.8 + vec3(uTime * 0.18 + uScroll * 0.4, uTime * 0.11, 0.0));

  // Abyss: scroll + pulse displacement (original formula, scaled for solar)
  float displacement = (slowCell * 0.5 + wave * 0.5 + pointerInfluence * 0.4) * uDistortion;
  float pulse = sin(uTime * 1.4 + slowCell * 4.8 + uScroll * 7.0) * uPulse * 0.07;

  pos += normalRef * (displacement + pulse);

  vec4 world = modelMatrix * vec4(pos, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(normalMatrix * normal);
  vWave = wave;
  vFast = fastGranule;

  gl_Position = projectionMatrix * viewMatrix * world;
}
`;
