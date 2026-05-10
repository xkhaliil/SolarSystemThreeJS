import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PointLight,
  Points,
  PointsMaterial,
} from 'three';
import Orb from './Orb';
import Halos from './Halos';

export default class SolarSystem extends Group {
  #orb;
  #halos;

  constructor(settings) {
    super();
    this.settings = settings;
    this.#init();
  }

  #init() {
    const ambientLight = new AmbientLight(0x080818, 0.6);
    this.add(ambientLight);

    // Main sunlight – illuminates planets
    const sunLight = new PointLight(0xffcc77, 6.0, 200, 1.1);
    sunLight.position.set(0, 0, 0);
    this.add(sunLight);

    // Warm fill to avoid pure shadow sides being completely black
    const fillLight = new PointLight(0xff6600, 0.8, 200, 1.5);
    fillLight.position.set(0, 0, 0);
    this.add(fillLight);

    // Corona glow: large back-face sphere with additive blending
    const coronaOuter = new Mesh(
      new IcosahedronGeometry(2.1, 6),
      new MeshBasicMaterial({
        color: 0xff7700,
        transparent: true,
        opacity: 0.13,
        side: BackSide,
        blending: AdditiveBlending,
        depthWrite: false,
      })
    );
    this.add(coronaOuter);

    const coronaInner = new Mesh(
      new IcosahedronGeometry(1.7, 6),
      new MeshBasicMaterial({
        color: 0xffcc44,
        transparent: true,
        opacity: 0.10,
        side: BackSide,
        blending: AdditiveBlending,
        depthWrite: false,
      })
    );
    this.add(coronaInner);

    // Starfield – two layers for depth: bright small + faint large
    const addStars = (count, spread, size, opacity) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 0] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
      const geo = new BufferGeometry();
      geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
      const mat = new PointsMaterial({ color: 0xffffff, size, sizeAttenuation: true, transparent: true, opacity });
      this.add(new Points(geo, mat));
    };
    addStars(2800, 300, 0.18, 0.9);
    addStars(900, 280, 0.42, 0.5);

    this.#orb = new Orb(this.settings);
    this.add(this.#orb);

    this.#halos = new Halos();
    this.add(this.#halos);
  }

  syncPalette() {
    this.#orb.syncPalette();
  }

  update() {
    this.#orb.update();
    this.#halos.update();
  }
}
