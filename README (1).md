# 🦋 Butterfly Antigravity Engine

> **Vibe-coded frontier of generative motion design** — a company-level, production-ready platform for zero-gravity butterfly simulations, built on Vite + React with a physics engine, design system, and full CI/CD pipeline.

[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/vite-5.x-646CFF.svg)](https://vitejs.dev)
[![React](https://img.shields.io/badge/react-18-61DAFB.svg)](https://react.dev)
[![Vitest](https://img.shields.io/badge/tested--with-vitest-6E9F18.svg)](https://vitest.dev)

---

## What Is This?

**Butterfly** is an open-source, company-level generative art engine that simulates butterfly colonies in antigravity environments. It began as a simple Vite project and has been enhanced with:

- A **custom SVG physics engine** with antigravity, sinusoidal drift, and mouse-repulsion forces
- A **modular design system** built on CSS custom properties (zero runtime overhead)
- A **vibe coding architecture** — intentional, flow-state-friendly file structure with zero boilerplate friction
- **Company-grade tooling**: ESLint, Prettier, Husky, Vitest, GitHub Actions CI, Lighthouse audits

---

## Quick Start

```bash
git clone https://github.com/kriss2012/butterfly.git
cd butterfly/vite-project
npm install
npm run dev          # http://localhost:5173
```

### Build for production

```bash
npm run build        # outputs to dist/
npm run preview      # serve the built app
```

---

## Repository Structure

```
butterfly/
├── vite-project/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ButterflyEngine/     # Core physics + SVG renderer
│   │   │   │   ├── index.jsx
│   │   │   │   ├── ButterflyShape.jsx
│   │   │   │   ├── TrailSystem.jsx
│   │   │   │   └── physics.js
│   │   │   ├── ControlPanel/        # Runtime settings UI
│   │   │   └── ui/                  # Shared design-system primitives
│   │   ├── hooks/
│   │   │   ├── useAnimationLoop.js  # RAF-based tick engine
│   │   │   ├── useMouseRepulsion.js # Pointer interaction physics
│   │   │   └── useDimensions.js     # ResizeObserver wrapper
│   │   ├── systems/
│   │   │   ├── antigravity.js       # Physics constants + force functions
│   │   │   ├── spawner.js           # Butterfly factory + lifecycle
│   │   │   └── particles.js         # Trail particle pool
│   │   ├── design-tokens.css        # Single source of truth for all tokens
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── CONTRIBUTING.md
│   ├── PHYSICS_MODEL.md
│   └── API_REFERENCE.md
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
└── README.md
```

---

## Core Concepts

### Antigravity Physics

Each butterfly is governed by four force vectors:

| Force           | Description                                          | Default       |
|-----------------|------------------------------------------------------|---------------|
| `vy` (upward)   | Constant upward velocity — the antigravity baseline  | `-0.3 to -1.2`|
| Sinusoidal drift| Horizontal oscillation based on `sin(tick × freq)`  | `±1.1 px`     |
| Mouse repulsion | Inverse-distance force from pointer position         | `r = 120 px`  |
| Edge reflection | Horizontal velocity flip at canvas boundaries        | Instant        |

```js
// antigravity.js
export function applyForces(bf, tick, mousePos, dims) {
  const drift = Math.sin(tick * bf.driftFreq + bf.phase) * bf.driftAmplitude;
  const repulsion = mousePos ? computeRepulsion(bf, mousePos, 120) : { x: 0, y: 0 };
  return {
    x: bf.x + bf.vx + drift + repulsion.x,
    y: bf.y + bf.vy + repulsion.y,
  };
}
```

### Vibe Coding Principles

This project follows **Vibe Coding** as a disciplined methodology — not as an excuse for chaos:

1. **Flow-first file naming** — every file has a single, obvious job. You can onboard in under 10 minutes.
2. **Physics as metaphor** — code structure mirrors the antigravity concept. Forces are isolated functions. State is immutable snapshots.
3. **Zero-friction iteration** — change any physics constant in `antigravity.js` and see it live-reload within 50 ms.
4. **Aesthetic intentionality** — design tokens are named for emotion (`--color-ascent`, `--glow-halo`) not implementation.

---

## Design System

All visual tokens live in `src/design-tokens.css`:

```css
:root {
  /* Antigravity Palette */
  --color-void:        #06060f;   /* Deep space background */
  --color-ascent:      #7C3AED;   /* Primary upward energy */
  --color-drift:       #0EA5E9;   /* Horizontal motion accent */
  --color-trail:       #C4B5FD;   /* Particle trail tint */
  --color-halo:        rgba(99,102,241,0.12);  /* Ambient glow */

  /* Typography */
  --font-display:      'Space Grotesk', system-ui;
  --font-mono:         'JetBrains Mono', monospace;

  /* Motion */
  --ease-float:        cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-snap:         cubic-bezier(0.68, -0.55, 0.27, 1.55);

  /* Spacing (8-pt grid) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px;
}
```

---

## Scripts Reference

| Command              | Action                                           |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Start Vite dev server with HMR                   |
| `npm run build`      | Production build with code-splitting             |
| `npm run preview`    | Serve production build locally                   |
| `npm run test`       | Run Vitest unit tests                            |
| `npm run test:ui`    | Vitest with browser UI                           |
| `npm run lint`       | ESLint + Prettier check                          |
| `npm run lint:fix`   | Auto-fix lint errors                             |
| `npm run typecheck`  | TypeScript type-check (JSDoc mode)               |
| `npm run perf`       | Lighthouse CI audit                              |

---

## Performance Targets

| Metric              | Target   |
|---------------------|----------|
| Lighthouse Score    | ≥ 95     |
| First Paint         | < 0.8 s  |
| 60 fps (8 butterflies) | ✅    |
| 28 butterflies cap  | 60 fps   |
| Bundle (gzipped)    | < 40 kB  |

---

## Configuration

Edit `vite-project/src/systems/antigravity.js` to tune the engine:

```js
export const PHYSICS = {
  BUTTERFLY_CAP:      28,       // Maximum concurrent butterflies
  TRAIL_LENGTH:       200,      // Trail particle pool size
  TRAIL_DECAY:        0.025,    // Opacity loss per frame
  RESPAWN_RATE:       0.002,    // Probability of new spawn per tick
  REPULSION_RADIUS:   120,      // Mouse repulsion distance (px)
  REPULSION_FORCE:    0.6,      // Maximum repulsion acceleration
  GRAVITY_Y:          [-1.2, -0.3],  // [min, max] upward velocity
  DRIFT_AMPLITUDE:    [0.3, 1.1],    // [min, max] horizontal oscillation
};
```

---

## CI / CD

GitHub Actions pipeline runs on every PR and push to `main`:

```
┌──────────────────────────────────────────────────────────┐
│  lint → unit tests → build → lighthouse → deploy (main)  │
└──────────────────────────────────────────────────────────┘
```

Deployment target: **GitHub Pages** (via `gh-pages` branch) — zero infrastructure cost, global CDN.

---

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for our full guide. The short version:

1. Fork the repo and create a feature branch: `git checkout -b feat/your-idea`
2. Run `npm run dev` and start vibing
3. All code must pass `npm run lint` and `npm run test`
4. Open a PR — describe the vibe you were chasing

---

## Roadmap

- [ ] **v2.1** — WebGL renderer (Three.js) for 500+ butterfly swarms
- [ ] **v2.2** — Audio-reactive wing patterns (Web Audio API)
- [ ] **v2.3** — Configurable gravity modes: Moon, Mars, deep-space
- [ ] **v2.4** — Export swarm as animated SVG / WebM
- [ ] **v3.0** — Multiplayer swarms (WebSocket sync)

---

## License

MIT © 2024 kriss2012. See [LICENSE](LICENSE).
