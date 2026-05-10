import {
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  RingGeometry,
  SphereGeometry,
} from 'three';
import store from '../../store';

// Sizes and orbits scaled for a clear, cinematic solar system view.
// Sun radius = 1.35 units.
const PLANETS = [
  { name: 'Mercury', size: 0.14,  orbit: 3.4,  color: 0xb5b0aa, emissive: 0x180a00, speed: 2.0  },
  { name: 'Venus',   size: 0.26,  orbit: 5.0,  color: 0xe8c870, emissive: 0x3a1c00, speed: 1.3  },
  { name: 'Earth',   size: 0.28,  orbit: 6.8,  color: 0x2a6fd4, emissive: 0x001a30, speed: 1.0,  moon: true  },
  { name: 'Mars',    size: 0.20,  orbit: 8.8,  color: 0xc04010, emissive: 0x280800, speed: 0.75 },
  { name: 'Jupiter', size: 0.70,  orbit: 12.2, color: 0xc28040, emissive: 0x201000, speed: 0.42 },
  { name: 'Saturn',  size: 0.58,  orbit: 16.5, color: 0xd4b47a, emissive: 0x221500, speed: 0.30, ring: true },
  { name: 'Uranus',  size: 0.40,  orbit: 20.5, color: 0x7ae8e4, emissive: 0x002828, speed: 0.20 },
  { name: 'Neptune', size: 0.38,  orbit: 24.5, color: 0x3060f8, emissive: 0x001040, speed: 0.14 },
];

const ORBIT_RING_MAT = new MeshStandardMaterial({
  color: 0x223355,
  emissive: 0x0a1a33,
  emissiveIntensity: 0.4,
  transparent: true,
  opacity: 0.30,
  side: DoubleSide,
  roughness: 1.0,
  depthWrite: false,
});

export default class Planets extends Group {
  #planets;

  constructor() {
    super();
    this.#planets = [];
    this.#init();
  }

  #init() {
    PLANETS.forEach((data, i) => {
      // Orbital path ring
      const ringW = Math.max(0.018, data.orbit * 0.003);
      const orbitRing = new Mesh(
        new RingGeometry(data.orbit - ringW, data.orbit + ringW, 160),
        ORBIT_RING_MAT
      );
      orbitRing.rotation.x = -Math.PI / 2;
      this.add(orbitRing);

      // Planet mesh
      const planet = new Mesh(
        new SphereGeometry(data.size, 40, 40),
        new MeshStandardMaterial({
          color: data.color,
          emissive: data.emissive,
          emissiveIntensity: 0.55,
          roughness: 0.72,
          metalness: 0.04,
        })
      );

      const startAngle = (i / PLANETS.length) * Math.PI * 2;
      planet.userData = { orbitRadius: data.orbit, speed: data.speed, angle: startAngle };
      planet.position.x = Math.cos(startAngle) * data.orbit;
      planet.position.z = Math.sin(startAngle) * data.orbit;

      // Saturn's iconic ring system
      if (data.ring) {
        const innerR = data.size * 1.45;
        const outerR = data.size * 2.65;

        const ring = new Mesh(
          new RingGeometry(innerR, outerR, 80),
          new MeshStandardMaterial({
            color: 0xc8a86a,
            emissive: 0x2a1800,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.82,
            side: DoubleSide,
            roughness: 0.9,
          })
        );
        ring.rotation.x = Math.PI / 2.2;
        planet.add(ring);
      }

      // Earth's moon
      if (data.moon) {
        const moon = new Mesh(
          new SphereGeometry(0.075, 24, 24),
          new MeshStandardMaterial({
            color: 0xaaaaaa,
            emissive: 0x111111,
            emissiveIntensity: 0.3,
            roughness: 0.9,
          })
        );
        moon.userData.moonAngle = 0;
        planet.add(moon);
        planet.userData.moon = moon;
      }

      this.add(planet);
      this.#planets.push(planet);
    });
  }

  update() {
    const t = store.time.elapsed;

    this.#planets.forEach((planet) => {
      const { orbitRadius, speed, angle } = planet.userData;
      const a = angle + t * speed * 0.22;
      planet.position.x = Math.cos(a) * orbitRadius;
      planet.position.z = Math.sin(a) * orbitRadius;
      // Very slight ecliptic tilt per planet for depth
      planet.position.y = Math.sin(a * 0.5 + angle) * 0.12;
      planet.rotation.y += 0.005 * (speed + 0.5);

      // Moon orbits Earth
      if (planet.userData.moon) {
        planet.userData.moon.userData.moonAngle = (planet.userData.moon.userData.moonAngle || 0) + 0.018;
        const ma = planet.userData.moon.userData.moonAngle;
        const mr = 0.52;
        planet.userData.moon.position.set(Math.cos(ma) * mr, Math.sin(ma * 0.3) * 0.05, Math.sin(ma) * mr);
      }
    });
  }
}
