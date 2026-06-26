# Architecture · Butterfly Antigravity Engine

## Overview

The Butterfly Antigravity Engine follows a **layered reactive architecture** — physics computations are pure functions, React manages state snapshots, and SVG handles rendering. This separation means the physics engine can be tested independently, the renderer can be swapped (e.g. to WebGL), and the UI layer never leaks into physics logic.

```
┌─────────────────────────────────────────────────────────────────┐
│                          User Interface                          │
│   ControlPanel  ·  StatsBar  ·  ClickToSpawn  ·  HoverRepel     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ events / state
┌─────────────────────────────────▼───────────────────────────────┐
│                       React Component Layer                      │
│   App.jsx  ─►  ButterflyEngine  ─►  ButterflyShape              │
│               TrailSystem  ─►  TrailDot                          │
└──────────┬──────────────────────────────────────────────────────┘
           │ useState / useEffect / RAF
┌──────────▼──────────────────────────────────────────────────────┐
│                      State & Hooks Layer                         │
│   useAnimationLoop  ·  useMouseRepulsion  ·  useDimensions       │
└──────────┬──────────────────────────────────────────────────────┘
           │ pure function calls
┌──────────▼──────────────────────────────────────────────────────┐
│                      Physics Systems Layer                       │
│   antigravity.js  ·  spawner.js  ·  particles.js                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

Every animation frame follows this exact pipeline:

```
RAF tick
  └─► useAnimationLoop fires
        └─► setButterflies(prev => ...)
              └─► prev.map(bf => applyForces(bf, tick, mousePos, dims))
                    ├─► drift force    (antigravity.js)
                    ├─► repulsion force (antigravity.js)
                    ├─► age + fade     (spawner.js)
                    └─► respawn check  (spawner.js)
        └─► setTrails(prev => ...)
              ├─► decay existing dots
              └─► push new trail snapshot
        └─► SVG re-render (React diffing over butterfly array)
```

**Key invariant:** The butterflies array is treated as immutable. Every tick produces a brand-new array via `.map()`. This enables time-travel debugging and zero stale-closure bugs.

---

## Component Responsibility Matrix

| Component            | Owns State? | Emits Events? | Pure? | Notes                             |
|----------------------|-------------|---------------|-------|-----------------------------------|
| `App.jsx`            | ✅ root      | –             | No    | Orchestrator, provides context    |
| `ButterflyEngine`    | No          | ✅ spawn       | No    | Receives array, renders SVG layer |
| `ButterflyShape`     | No          | No            | ✅    | SVG paths from props only         |
| `TrailSystem`        | No          | No            | ✅    | Renders trail dot array           |
| `ControlPanel`       | No          | ✅ settings    | No    | Dispatches config updates         |
| `useAnimationLoop`   | –           | –             | –     | Hook: drives tick via RAF         |
| `useMouseRepulsion`  | –           | –             | –     | Hook: tracks pointer position     |
| `antigravity.js`     | –           | –             | ✅    | Pure force functions              |
| `spawner.js`         | –           | –             | ✅    | Pure butterfly factory            |
| `particles.js`       | –           | –             | ✅    | Pure trail mutation               |

---

## Physics Engine Design

### Force Composition

Each butterfly's next position is computed by composing independent forces:

```js
// All forces are additive, none have side-effects
function nextPosition(bf, tick, mouse, dims) {
  const base     = { x: bf.x + bf.vx,   y: bf.y + bf.vy };
  const drift    = driftForce(bf, tick);          // sinusoidal X
  const repel    = repulsionForce(bf, mouse, 120); // radial from cursor
  const clamped  = clampToCanvas(base, drift, repel, dims);
  return clamped;
}
```

### Butterfly Lifecycle

```
BORN (spawner.createButterfly)
  ↓
ALIVE (ticks 0 → maxAge × 0.8)  — full opacity, full physics
  ↓
FADING (ticks maxAge×0.8 → maxAge) — opacity 1→0
  ↓
REBORN (respawn in-place)       — new random parameters, same id slot
```

Reusing the same ID slot prevents React key reconciliation issues and keeps the SVG DOM stable.

---

## Rendering Strategy

The engine uses **pure SVG**, not Canvas or WebGL, for the following reasons:

- SVG elements are inspectable in DevTools — great for debugging wing geometry
- React's virtual DOM diffing works naturally over SVG element arrays
- SVG paths render crisply at any DPI/zoom (important for design presentations)
- No texture loading, no GPU context management

**Performance budget:**
- Each butterfly = 1 `<g>` with ~12 child elements (paths, circles, defs)
- At 28 butterflies + 200 trail dots = ~536 SVG nodes total
- This stays well within the 1000-node threshold for smooth 60 fps rendering in modern browsers

**Upgrade path to WebGL:** Replace `ButterflyEngine` with a Three.js `<Canvas>` component. The physics layer (`antigravity.js`, `spawner.js`) needs zero changes — it's just math.

---

## State Management

No external state library (Redux, Zustand) is used. The butterfly array fits comfortably in `useState` because:

1. It's always fully recomputed each tick (no patch updates needed)
2. It never needs to be shared outside the engine component
3. React 18's concurrent mode batches these updates automatically

If the swarm grows beyond ~100 butterflies, migrate the state to a `useReducer` with an `immer`-style draft — the reducer and physics layer interfaces remain identical.

---

## File Naming Conventions

| Pattern               | Meaning                               |
|-----------------------|---------------------------------------|
| `PascalCase.jsx`      | React component (renders UI)          |
| `camelCase.js`        | Pure system / utility module          |
| `useXxx.js`           | Custom React hook                     |
| `design-tokens.css`   | Single CSS token file                 |
| `*.test.js`           | Vitest unit test (co-located)         |

---

## Adding a New Force

1. Add a pure function to `src/systems/antigravity.js`:
   ```js
   export function windForce(bf, windAngle, windStrength) {
     return {
       x: Math.cos(windAngle) * windStrength,
       y: Math.sin(windAngle) * windStrength,
     };
   }
   ```
2. Compose it in `useAnimationLoop.js` inside the `.map()` callback
3. Expose a control in `ControlPanel` via a new config key
4. Add a Vitest test in `src/systems/antigravity.test.js`

That's the entire change surface — 4 files, zero impact on rendering.

---

## Security Considerations

- No user input is ever eval'd or injected into the DOM as HTML
- All SVG path data is computed from numeric constants — no XSS vectors
- No external API calls; the engine is fully offline-capable
- CSP-compatible: no inline `style` attributes with dynamic `url()` expressions (gradients use `<defs>`)

---

## Browser Support

| Browser     | Minimum Version | Notes                       |
|-------------|-----------------|------------------------------|
| Chrome      | 90+             | Full support                 |
| Firefox     | 88+             | Full support                 |
| Safari      | 14.1+           | `ResizeObserver` required    |
| Edge        | 90+             | Full support                 |
| iOS Safari  | 14.5+           | Touch events mapped to mouse |
| Android     | Chrome 90+      | 60 fps on mid-range devices  |

`@vitejs/plugin-legacy` can extend support to Chrome 60+ if required.
