# Signal Abyss

Interactive Three.js scene created for the weekly assignment, featuring a custom `ShaderMaterial` and a postprocessing-driven visual style.

## Highlights

- Custom GLSL shader as the primary surface material.
- Real-time interaction via pointer movement, wheel input, and arrow keys.
- Postprocessing stack using `postprocessing` with bloom, noise, glitch, chromatic aberration, and scanlines.
- Performance-oriented setup:
  - DPR clamped to `1.6`
  - Renderer antialiasing disabled when postprocessing is active

## Controls

- Drag: orbit camera
- Scroll: modulate shader pulse/flow
- `ArrowLeft` / `ArrowRight`: directional surge
- GUI panel: tweak shader and post FX parameters

## Development

```bash
nvm use
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
