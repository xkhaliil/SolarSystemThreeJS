import {
  ACESFilmicToneMapping,
  MathUtils,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Camera from './Camera';
import store from './store';
import Monolith from './Monolith';
import PostFX from './PostFX';
import Debug from './Debug';

const DPR_MIN = 1;
const DPR_MAX = 1.6;
const CAMERA_FOV = 45;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 150;

export default class App {
  #gl;
  #scene;
  #camera;
  #controls;
  #monolith;
  #postFx;

  constructor() {
    this.settings = {
      autoRotate: true,
      orbPulse: 0.52,
      orbDistortion: 0.15,
      orbTint: '#fff9b0',
      sunCoreTint: '#ff4800',
      bloomIntensity: 0.9,
      bloomThreshold: 0.62,
      bloomRadius: 0.55,
      noiseAmount: 0.03,
      glitchAmount: 0.0,
      scanlineDensity: 1.25,
      scanlineOpacity: 0.04,
    };

    this.#init();
  }

  #init() {
    this.#gl = new WebGLRenderer({
      canvas: document.querySelector('#canvas'),
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.#gl.toneMapping = ACESFilmicToneMapping;
    this.#gl.toneMappingExposure = 1.2;

    this.#scene = new Scene();
    this.#camera = new Camera(
      CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      CAMERA_NEAR,
      CAMERA_FAR
    );
    this.#camera.position.set(0, 6, 18);

    this.#controls = new OrbitControls(this.#camera, this.#gl.domElement);
    this.#controls.enableDamping = true;
    this.#controls.enablePan = false;
    this.#controls.minDistance = 3.5;
    this.#controls.maxDistance = 34;
    this.#controls.maxPolarAngle = Math.PI * 0.58;
    this.#controls.autoRotate = this.settings.autoRotate;
    this.#controls.autoRotateSpeed = 0.4;

    this.#monolith = new Monolith(this.settings);
    this.#scene.add(this.#monolith);

    this.#postFx = new PostFX(this.#gl, this.#scene, this.#camera, this.settings);

    store.gl = this.#gl;
    store.scene = this.#scene;
    store.camera = this.#camera;
    store.composer = this.#postFx.composer;

    this.debug = new Debug(
      this.settings,
      this.#controls,
      this.#monolith,
      this.#postFx
    );

    this.#resize();
    this.#initEvents();
    this.#animate();
  }

  #resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = MathUtils.clamp(window.devicePixelRatio, DPR_MIN, DPR_MAX);

    store.size.width = width;
    store.size.height = height;
    store.size.dpr = dpr;

    this.#gl.setPixelRatio(dpr);
    this.#gl.setSize(width, height);

    this.#camera.resize(width, height);
    this.#postFx.resize(width, height);
  };

  onMouseMove(event) {
    store.mouse.onMouseMove(event);
  }

  onWheel(event) {
    store.helpers.scroll.target += event.deltaY * 0.0009;
    store.helpers.scroll.target = MathUtils.clamp(store.helpers.scroll.target, -1.4, 1.4);
  }

  onKeyDown(event) {
    if (event.code === 'ArrowLeft') {
      store.helpers.scroll.target = MathUtils.clamp(store.helpers.scroll.target - 0.12, -1.4, 1.4);
    }

    if (event.code === 'ArrowRight') {
      store.helpers.scroll.target = MathUtils.clamp(store.helpers.scroll.target + 0.12, -1.4, 1.4);
    }
  }

  #initEvents() {
    window.addEventListener('resize', this.#resize);
  }

  #animate = (timestamp) => {
    store.time.update(timestamp);
    store.mouse.update();

    const previousScroll = store.helpers.scroll.smooth;
    store.helpers.scroll.smooth = MathUtils.lerp(
      store.helpers.scroll.smooth,
      store.helpers.scroll.target,
      0.07
    );
    store.helpers.scroll.smoothDelta = store.helpers.scroll.smooth - previousScroll;

    this.#monolith.update();
    this.#controls.update();
    this.#postFx.render();

    window.requestAnimationFrame(this.#animate);
  };
}
