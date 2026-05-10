import { Vector2 } from 'three';
import store from '../store';

class Mouse {
  constructor() {
    this.static = new Vector2(0, 0);
    this.smooth = new Vector2(0, 0);
  }

  onMouseMove(event) {
    const x = event.clientX / store.size.width;
    const y = event.clientY / store.size.height;

    this.static.x = x * 2 - 1;
    this.static.y = -(y * 2 - 1);
  }

  update() {
    this.smooth.lerp(this.static, 0.08);
  }
}

const mouse = new Mouse();
export default mouse;
