import { Timer } from 'three';

class Time {
  constructor() {
    this.timer = new Timer();
    this.timer.connect(document);

    this.elapsed = 0;
    this.delta = 0;
    this.frames = 0;
  }

  update(timestamp) {
    this.frames += 1;
    this.timer.update(timestamp);
    this.delta = this.timer.getDelta();
    this.elapsed = this.timer.getElapsed();
  }
}

const time = new Time();
export default time;
