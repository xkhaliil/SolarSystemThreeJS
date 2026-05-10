import time from '../Time';
import mouse from '../Mouse';

export default {
  time,
  mouse,

  gl: undefined,
  scene: undefined,
  camera: undefined,
  composer: undefined,

  size: {
    width: 1,
    height: 1,
    dpr: 1,
  },

  helpers: {
    scroll: {
      target: 0,
      smooth: 0,
      smoothDelta: 0,
    },
  },
};
