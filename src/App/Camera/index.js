import { PerspectiveCamera } from 'three';

export default class Camera extends PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);
  }

  resize(width, height) {
    this.aspect = width / height;
    this.updateProjectionMatrix();
  }
}
