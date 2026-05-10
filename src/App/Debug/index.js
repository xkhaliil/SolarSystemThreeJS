import GUI from 'lil-gui';

export default class Debug {
  constructor(settings, controls, monolith, postFx) {
    this.settings = settings;
    this.controls = controls;
    this.monolith = monolith;
    this.postFx = postFx;

    this.gui = new GUI({
      title: 'Solar System',
      width: 290,
    });

    this.#init();
  }

  #init() {
    this.gui
      .add(this.settings, 'autoRotate')
      .name('auto rotate')
      .onChange((value) => {
        this.controls.autoRotate = value;
      });

    const orbFolder = this.gui.addFolder('sun shader');
    orbFolder.add(this.settings, 'orbPulse', 0.1, 1.2, 0.01).name('pulse');
    orbFolder
      .add(this.settings, 'orbDistortion', 0.05, 0.7, 0.01)
      .name('distortion');
    orbFolder
      .addColor(this.settings, 'orbTint')
      .name('sun surface')
      .onChange(() => {
        this.monolith.syncPalette();
      });
    orbFolder
      .addColor(this.settings, 'sunCoreTint')
      .name('sun corona')
      .onChange(() => {
        this.monolith.syncPalette();
      });

    const postFolder = this.gui.addFolder('post fx');
    postFolder
      .add(this.settings, 'bloomIntensity', 0, 2, 0.01)
      .name('bloom intensity')
      .onChange((value) => {
        this.postFx.bloomEffect.intensity = value;
      });
    postFolder
      .add(this.settings, 'bloomThreshold', 0.1, 1, 0.01)
      .name('bloom threshold')
      .onChange((value) => {
        this.postFx.bloomEffect.luminanceMaterial.threshold = value;
      });
    postFolder
      .add(this.settings, 'bloomRadius', 0, 1, 0.01)
      .name('bloom radius')
      .onChange((value) => {
        this.postFx.bloomEffect.mipmapBlurPass.radius = value;
      });
    postFolder
      .add(this.settings, 'noiseAmount', 0, 0.45, 0.001)
      .name('noise amount')
      .onChange((value) => {
        this.postFx.noiseEffect.blendMode.opacity.value = value;
      });
    postFolder
      .add(this.settings, 'glitchAmount', 0, 0.6, 0.001)
      .name('glitch amount')
      .onChange((value) => {
        this.postFx.glitchEffect.blendMode.opacity.value = value;
      });
    postFolder
      .add(this.settings, 'scanlineDensity', 0.1, 2.4, 0.01)
      .name('scanline density')
      .onChange((value) => {
        this.postFx.scanlineEffect.setDensity(value);
      });
    postFolder
      .add(this.settings, 'scanlineOpacity', 0, 0.45, 0.001)
      .name('scanline opacity')
      .onChange((value) => {
        this.postFx.scanlineEffect.blendMode.opacity.value = value;
      });
  }
}
