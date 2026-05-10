import {
  BloomEffect,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  GlitchEffect,
  NoiseEffect,
  RenderPass,
  ScanlineEffect,
} from 'postprocessing';
import { Vector2 } from 'three';

export default class PostFX {
  constructor(renderer, scene, camera, settings) {
    this.settings = settings;

    this.composer = new EffectComposer(renderer);
    this.renderPass = new RenderPass(scene, camera);

    this.bloomEffect = new BloomEffect({
      intensity: settings.bloomIntensity,
      luminanceThreshold: settings.bloomThreshold,
      radius: settings.bloomRadius,
    });

    this.noiseEffect = new NoiseEffect({
      premultiply: true,
      blendFunction: 23,
    });
    this.noiseEffect.blendMode.opacity.value = settings.noiseAmount;

    this.glitchEffect = new GlitchEffect({
      delay: [1.2, 2.7],
      duration: [0.08, 0.24],
      strength: [0.02, 0.12],
      columns: 0.08,
      ratio: 0.82,
    });
    this.glitchEffect.mode = 1;
    this.glitchEffect.blendMode.opacity.value = settings.glitchAmount;

    this.chromaticAberrationEffect = new ChromaticAberrationEffect({
      offset: new Vector2(0.0014, 0.0008),
    });

    this.scanlineEffect = new ScanlineEffect({
      density: settings.scanlineDensity,
    });
    this.scanlineEffect.blendMode.opacity.value = settings.scanlineOpacity;

    this.baseEffectPass = new EffectPass(
      camera,
      this.bloomEffect,
      this.noiseEffect,
      this.scanlineEffect
    );

    this.chromaticEffectPass = new EffectPass(
      camera,
      this.chromaticAberrationEffect
    );

    this.glitchEffectPass = new EffectPass(
      camera,
      this.glitchEffect
    );

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.baseEffectPass);
    this.composer.addPass(this.chromaticEffectPass);
    this.composer.addPass(this.glitchEffectPass);
  }

  resize(width, height) {
    this.composer.setSize(width, height);
  }

  render() {
    this.composer.render();
  }
}
