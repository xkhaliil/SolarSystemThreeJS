# Solar System — Weekly 02

An interactive, real-time 3D solar system rendered entirely in the browser with **Three.js** and custom **GLSL shaders**. The sun is a fully procedural shader ball with granulation, limb darkening, corona glow, and solar flares — all reactive to your mouse, scroll, and keyboard. Eight planets orbit it, each with correct relative sizes, coloured orbit rings, and self-rotation. Saturn has a ring system and Earth has an orbiting moon.

---

## Getting Started

**Requirements:** Node.js 18 or later.

```bash
# 1 — install dependencies
npm install

# 2 — start the dev server
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

### Other scripts

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Production build into `dist/`        |
| `npm run preview` | Preview the production build locally |

---

## Controls

### Mouse

| Action              | Effect                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| **Left-click drag** | Orbit the camera around the solar system                                                           |
| **Move mouse**      | The sun tilts and drifts toward the cursor — the surface gradient and displacement also respond    |
| **Scroll wheel**    | Drives the plasma wave stripes across the sun surface and pulses the corona; also zooms the camera |

### Keyboard

| Key       | Effect                                                     |
| --------- | ---------------------------------------------------------- |
| `←` Arrow | Negative scroll surge — plasma bands sweep across the sun  |
| `→` Arrow | Positive scroll surge — same effect in the other direction |

### Camera

- **Auto-rotate** is on by default; the scene slowly revolves around the sun
- Zoom range: from close-up on the sun all the way out to see Neptune
- Vertical angle is clamped so you always look at the ecliptic plane from above

---

## Debug Panel (top-right)

A live **lil-gui** panel lets you tweak every parameter in real time. Click the arrows on each folder to expand it.

### `sun shader`

| Control         | Range         | What it does                                                                                       |
| --------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| **pulse**       | 0.1 – 1.2     | Amplitude of the rhythmic surface pulsation tied to scroll                                         |
| **distortion**  | 0.05 – 0.7    | How much the geometry is displaced by noise and waves — low = smooth sphere, high = roiling plasma |
| **sun surface** | colour picker | Hot-spot / granule peak colour (default: pale yellow-white `#fff9b0`)                              |
| **sun corona**  | colour picker | Trough / corona / rim-glow colour (default: deep orange `#ff4800`)                                 |

### `post fx`

| Control              | Range     | What it does                                                    |
| -------------------- | --------- | --------------------------------------------------------------- |
| **bloom intensity**  | 0 – 2     | Overall glow brightness — push high to make the sun bleed light |
| **bloom threshold**  | 0.1 – 1   | Only pixels above this luminance contribute to bloom            |
| **bloom radius**     | 0 – 1     | Spread of the bloom halo                                        |
| **noise amount**     | 0 – 0.45  | Film-grain overlay opacity                                      |
| **glitch amount**    | 0 – 0.6   | Digital glitch effect opacity                                   |
| **scanline density** | 0.1 – 2.4 | CRT scanline frequency                                          |
| **scanline opacity** | 0 – 0.45  | CRT scanline visibility                                         |

---

## Scene Overview

### The Sun

The sun is an `IcosahedronGeometry` (subdivision 36) driven by two custom GLSL shaders:

- **Vertex shader** — three displacement layers: slow supergranulation cells, fast granule noise, and scroll-driven wave stripes. Mouse cursor direction bends the surface geometry outward (pointer influence).
- **Fragment shader** — combines:
  - **Granulation** — procedural convection cells brightened at peaks (faculae)
  - **Limb darkening** — edges dim physically, as in a real star
  - **Solar flares** — equatorial noise streaks that intensify with scroll
  - **Corona rim glow** — additive orange halo at the silhouette
  - **Mouse/scroll gradient** — the whole colour field shifts with your cursor and scroll input

Two additive back-face sphere meshes add a visible atmospheric **corona** around the sun in the scene.

### The Solar System

All eight planets orbit the sun. Orbit paths are drawn as thin `RingGeometry` meshes on the ecliptic plane.

| Planet  | Notable detail                      |
| ------- | ----------------------------------- |
| Mercury | Smallest, fastest orbit             |
| Venus   | Warm golden tint                    |
| Earth   | Blue, includes an orbiting **moon** |
| Mars    | Rust-red                            |
| Jupiter | Largest planet, orange-tan banded   |
| Saturn  | Ring system with slight axial tilt  |
| Uranus  | Cyan-teal                           |
| Neptune | Deep blue, outermost                |

Each planet:

- Self-rotates at a speed proportional to its orbital speed
- Has a slight sinusoidal Y offset to give the ecliptic some depth
- Is lit by a `PointLight` placed at the sun's origin — dark sides face away from the sun

### Starfield

Two `Points` layers (2 800 bright + 900 large faint stars) fill the background at different scales for perceived depth.

---

## Project Structure

```
weekly02-main/
├── index.html                  Entry HTML, font imports
├── package.json
├── public/                     Static assets (favicon)
└── src/
    ├── main.js                 Bootstraps the App
    ├── style.css               Global styles, HUD, dark-space background
    └── App/
        ├── index.js            Root app: renderer, camera, controls, animation loop
        ├── Camera/             Perspective camera with resize helper
        ├── Debug/              lil-gui debug panel wiring
        ├── Mouse/              Normalised mouse + smooth interpolation
        ├── Time/               Elapsed time tracker
        ├── store/              Shared singleton (gl, scene, camera, time, mouse…)
        ├── PostFX/             EffectComposer: bloom, noise, glitch, chromatic aberration, scanline
        └── Monolith/           The solar system group
            ├── index.js        Scene root: lights, corona meshes, starfield
            ├── Orb/            The sun mesh
            │   ├── index.js    ShaderMaterial setup + per-frame uniform updates
            │   └── shaders/
            │       ├── vertex.js   Displacement: granulation + wave stripes + pointer influence
            │       └── fragment.js Shading: granulation, limb darkening, flares, corona, gradient
            └── Halos/
                └── index.js    8 planets + orbit rings + Saturn rings + Earth moon
```

---

## Tech Stack

| Library                                                   | Version | Role                                      |
| --------------------------------------------------------- | ------- | ----------------------------------------- |
| [Three.js](https://threejs.org)                           | ^0.184  | 3D rendering, geometry, lights, materials |
| [postprocessing](https://pmndrs.github.io/postprocessing) | ^6.39   | Multi-pass post-FX composer               |
| [lil-gui](https://lil-gui.georgealways.com)               | ^0.20   | Debug / tweak panel                       |
| [Vite](https://vite.dev)                                  | ^8.0    | Dev server and bundler                    |

---

## Highlights

- Custom GLSL shader as the primary sun surface — fully procedural, no textures
- Real-time interaction via pointer movement, scroll, and arrow keys
- Postprocessing stack: bloom, noise, glitch, chromatic aberration, scanlines
- Performance-oriented: DPR clamped to `1.6`, renderer antialiasing disabled in favour of post-FX

---

## Customisation Tips

- **Change planet colours or sizes** — edit the `PLANETS` array in `src/App/Monolith/Halos/index.js`
- **Add a new planet** — push a new entry into `PLANETS` with `name`, `size`, `orbit`, `color`, `emissive`, and `speed`
- **Change the sun's look** — use the debug panel live, or edit the default values in `src/App/index.js` under `this.settings`
- **Crank bloom** — set `bloomIntensity` to ~1.8 and `bloomThreshold` to ~0.5 for a dramatic star-burst effect
- **Disable glitch / scanlines** — set both amounts to `0` for a clean cinematic look (already the default)

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
