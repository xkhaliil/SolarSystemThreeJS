import './style.css';
import App from './App';

const app = new App();

window.addEventListener('pointermove', (event) => {
  app.onMouseMove(event);
}, { passive: true });

window.addEventListener('wheel', (event) => {
  app.onWheel(event);
}, { passive: true });

window.addEventListener('keydown', (event) => {
  app.onKeyDown(event);
});
