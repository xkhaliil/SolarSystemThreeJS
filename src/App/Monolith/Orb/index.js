import {
  Color,
  IcosahedronGeometry,
  MathUtils,
  Mesh,
  ShaderMaterial,
  Vector2,
} from 'three';
import store from '../../store';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';

export default class Orb extends Mesh {
  constructor(settings) {
    const geometry = new IcosahedronGeometry(1.35, 36);
    const material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vector2(0, 0) },
        uScroll: { value: 0 },
        uPulse: { value: settings.orbPulse },
        uDistortion: { value: settings.orbDistortion },
        uColorA: { value: new Color(settings.orbTint) },
        uColorB: { value: new Color(settings.sunCoreTint) },
      },
      vertexShader,
      fragmentShader,
    });

    super(geometry, material);
    this.settings = settings;
  }

  syncPalette() {
    this.material.uniforms.uColorA.value.set(this.settings.orbTint);
    this.material.uniforms.uColorB.value.set(this.settings.sunCoreTint);
  }

  update() {
    const uniforms = this.material.uniforms;
    uniforms.uTime.value = store.time.elapsed;
    uniforms.uScroll.value = store.helpers.scroll.smooth;
    uniforms.uMouse.value.copy(store.mouse.smooth);
    uniforms.uPulse.value = this.settings.orbPulse;
    uniforms.uDistortion.value = this.settings.orbDistortion;

    // Abyss-style interactivity: mouse tilts and drifts the sun
    this.rotation.y += 0.0035 + store.helpers.scroll.smooth * 0.007;
    this.rotation.x = MathUtils.lerp(this.rotation.x, store.mouse.smooth.y * 0.18, 0.09);
    this.position.x = MathUtils.lerp(this.position.x, store.mouse.smooth.x * 0.6, 0.06);
    this.position.y = MathUtils.lerp(this.position.y, store.mouse.smooth.y * 0.45, 0.06);
  }
}
