# AFTERLIGHT — The World Between Frames

An interactive cinematic WebGL experience. Six scenes, one WebGL context, no
downloaded assets.

You arrive at a point of light in total darkness. You press **ENTER**. The
light goes out, and the film begins: a monolith above an endless ocean, a
structure that comes apart, an impossible corridor, three studies left running,
and a slow withdrawal into black.

Everything you see is generated in the browser — geometry, materials, water,
particles, grain and sound. The only third-party assets in the build are two
typefaces, packaged locally.

---

## Contents

- [Quick start](#quick-start)
- [Commands](#commands)
- [What you can do](#what-you-can-do)
- [The controls](#the-controls)
- [Routes](#routes)
- [Architecture](#architecture)
- [How the animation system works](#how-the-animation-system-works)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Assets and licensing](#assets-and-licensing)
- [Known limitations](#known-limitations)

---

## Quick start

Requires **Node.js 20.19+** (developed and verified on Node 24, npm 11).

```bash
npm install
npm run dev          # http://127.0.0.1:5173
```

Production build and local preview of that build:

```bash
npm run build
npm run preview      # http://127.0.0.1:4173
```

> **Deploying?** This is a client-routed single-page app, so your host must
> rewrite unknown paths to `index.html` or refreshing on `/lab/portal` will 404.
> `vite preview` already does this. For Netlify: `/* /index.html 200`. For
> nginx: `try_files $uri $uri/ /index.html;`. For S3/CloudFront: set the error
> document to `index.html`.

### First run on a machine with no GPU

The capability probe classifies software rasterisers (SwiftShader, llvmpipe,
Mesa's software path) as *no WebGL* and serves the written version of the film,
which is the right call for a real visitor. If you want to force the 3D path on
such a machine, append `?renderer=force`. `?renderer=off` forces the written
version. This flag is also what the browser test suite uses.

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck (`tsc -b`) then production build |
| `npm run preview` | Serve `dist/` with SPA fallback |
| `npm run typecheck` | Strict TypeScript project check, no emit |
| `npm test` | Vitest unit suite (jsdom) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright browser suite (builds and serves automatically) |
| `npm run e2e:install` | One-time Playwright browser download |

Two development harnesses live in `scripts/` and are run with plain Node:

```bash
node scripts/verify.mjs          # drives the critical flows, prints every console message
node scripts/shots.mjs           # writes reference screenshots to .shots/
```

`verify.mjs` is the fastest way to see whether something regressed without
reading a test report; it exits non-zero if a step fails and prints the full
console log at the end.

---

## What you can do

### The film

- **Scroll** to travel. Native scrolling is never hijacked — the wheel, the
  scrollbar, Page Down, the space bar and find-in-page all behave normally.
- **Move the pointer** for camera parallax, and to interact with each scene.
- **Click the scene rail** (right edge on desktop, bottom bar on mobile) to jump
  to any scene.
- **In Fracture**: `Disintegrate`, `Reassemble`, toggle the pointer between
  *repel* and *attract*, or `Reset` back to scroll control.
- **In Afterlight**: `Replay` returns you to the beginning, or continue to the
  archive and credits.

### The laboratory

Six live parameters, four transport controls, JSON export/import and PNG
capture. Every control is wired to a running material — see
[The controls](#the-controls).

---

## The controls

| Control | Range | What it actually drives |
| --- | --- | --- |
| **Particle count** | 500 – 12 000 | Instance count in the point cloud. Changing it rebuilds the field's buffers once; after that it costs one draw call at any density. |
| **Distortion intensity** | 0 – 1 | Amplitude of the per-particle vertex warp, the wave energy in The Void's sea, and the warp amplitude + chromatic separation in Study II. |
| **Pointer influence** | 0 – 2× | Radius-weighted push (plus a tangential swirl) on the particle field, the Fracture fragments, and the pointer lens in Study II. |
| **Fog density** | 0 – 1 | `scene.fog` in the laboratory, scaled across the scene. |
| **Bloom intensity** | 0 – 1.5 | The `Bloom` pass in the post chain. Skipped entirely on the low quality tier. |
| **Animation speed** | 0 – 2× | The shared clock every scene reads from. `0` freezes motion without stopping rendering. |
| **Pause / Resume** | — | Halts the shared clock. Rendering continues so the frame stays on screen. |
| **Randomise** | — | New in-range values for all six parameters, plus a variant code in the status line. |
| **Reset** | — | Factory values, un-pauses, and clears the notice. |
| **Capture** | — | Re-renders the current frame through the same post chain you are looking at, then downloads a PNG. The outcome is also written to the *Last capture* readout, which does not auto-dismiss. |
| **Export JSON** | — | Downloads the six parameters as a versioned config file. |
| **Import JSON** | — | Opens a file picker. Every field is validated: unknown keys are dropped, out-of-range values are clamped and snapped to their step, non-numeric values fall back to the default — and each repair is listed back to you. A malformed or unrecognised file is reported, never silently applied. |

All six parameters and the app settings persist to `localStorage`. Stored data
is treated as untrusted input: it is validated field-by-field on boot, and a
corrupt or hostile value falls back to the default rather than breaking start-up.
Writes are debounced and flushed on `pagehide`, so changing a setting and
reloading immediately does not lose it.

### Settings

Reachable from the header or the mobile menu.

- **Quality preset** — Auto / Low / Medium / High. Low drops the post chain and
  scales every instanced count down.
- **Pixel ratio cap** — 1× to 3×. The single most effective control on a
  high-DPI laptop; 1× roughly halves fragment cost.
- **Motion** — System (default) / Full / Reduced.
- **Pause when hidden** — suspends rendering when the tab is in the background.
- **Sound**, **master volume**, **ambient level**.
- **Film grain**, **smooth scrolling**, **custom cursor**.
- **Diagnostics** — detected tier, live frame rate, frame count, renderer
  string, pointer type, core count, reported memory.

---

## Routes

| Route | Contents |
| --- | --- |
| `/` | The film: six scenes, scroll-linked, with the Awakening gate |
| `/lab` | The laboratory hub |
| `/lab/particles` | Study I — particle field |
| `/lab/shaders` | Study II — domain warp |
| `/lab/portal` | Study III — refractive aperture |
| `/archive` | The written log of all six scenes, with permalinks |
| `/credits` | Credits, licensing, accessibility notes, live session diagnostics |
| anything else | A real 404 that names the path and offers the real routes |

Every route works on direct navigation and on refresh.

---

## Architecture

```
src/
  app/            shell, providers, the loading registry, root fallback
  audio/          procedural Web Audio engine + the store bridge
  components/     UI: navigation, overlays, panels, scene overlays, fallback
  graphics/       capability probe, GLSL, materials, particle systems, post FX
    shaders/      ocean, particles, portal/domain-warp, shared noise + fog
    materials/    MeshStandardMaterial patched via onBeforeCompile
    particles/    seeded field generation + the GPU-animated cloud
  animation/      imperative progress registry, scroll engine, camera rig
  hooks/          media queries, visibility, focus trap, pointer field
  routes/         route table + one file per page
  scenes/         the film, one directory per scene, plus the shared canvas
  store/          zustand stores, the effect schema, persistence
  styles/         design tokens + global CSS
  utils/          maths, PRNG, storage, downloads, formatting
  tests/          Vitest setup
```

### The ideas that hold it together

**Scroll progress never enters React state.** ScrollTrigger writes a normalised
0→1 value into a plain registry (`animation/progressRegistry.ts`); `useFrame`
reads it. Routing scroll position through component state would re-render the
tree at 60 Hz. The registry only updates React on genuine *scene changes*, a
handful of times per visit.

**Animation logic is separated from presentation.** `useCameraRig` turns a
normalised progress value plus a pointer vector into a camera transform. Scenes
declare keyframes and read the result; they never touch the camera directly.

**One canvas, one scene resident.** The film mounts exactly one scene at a time
(`SceneDirector`). At the swap point both scenes are fully fogged, so the cut is
invisible, and the narrative never holds six scenes in memory or pays for six
render loops.

**The DOM carries the meaning.** Every scene's text, controls and telemetry live
in the document. The fallback is not a degraded copy of the page — it *is* the
page, which is why losing WebGL costs atmosphere but not the film.

**One schema, no dead controls.** `store/effectConfig.ts` declares the six
parameters with their ranges, steps and descriptions. The panel renders that
list, the store validates against it, import/export serialises it, and the unit
tests assert it. A control that is not declared cannot be rendered; a declared
control that no material reads would fail the "every field is used" expectation
documented in `EffectControls.tsx`.

### Scene construction

| Scene | Technique |
| --- | --- |
| **The Void** | A 1800 m plane displaced by four Gerstner waves, with the surface normal rebuilt analytically from the wave derivatives (no normal map, no tangents). Reflection is procedural: the reflected ray is intersected against an analytic sky and against the plane the monolith stands on. The monolith is a `MeshStandardMaterial` patched via `onBeforeCompile` for vertical striation and a soft rim, plus an additive glow shell for cheap volumetrics. |
| **Fracture** | One `InstancedMesh`. Every fragment's rest position, scatter target, spin axis, scale and breakup delay come from a fixed seed. A single progress value drives the whole sequence: a fragment starts at its own delay and always completes at 1, so the failure visibly travels upward. The frame loop allocates nothing — one `Object3D` scratch writing straight into the instance buffer. |
| **The Threshold** | Repeated architectural frames as instances in a single draw call, recycled along Z as the camera advances so the corridor is effectively infinite. Frames that pass behind the camera are moved to the far end of the run. |
| **Echoes** | Three studies laid out along X in **one** WebGL pass; the scroll moves the camera laterally between them. Three canvases would mean three render loops, three contexts and three copies of the same backdrop. |
| **Afterlight** | A camera-facing additive billboard with a radial falloff — light in fog has no edge, and a shell geometry renders a hard silhouette that reads as a grey ball. The structure dissolves with a noisy upward threshold rather than fading. |

### Progressive loading, honestly

The Awakening gate reports four real tasks: typeface decoding, WebGL context
creation, GLSL program linking (read from the renderer's actual program cache),
and scene chunk streaming. Each reports 0→1 from the underlying event. Nothing
is timed or simulated. If a task stalls past 15 seconds it is reported as
*failed with a reason* and the gate opens anyway — a stalled driver call must
never lock a visitor out of the film.

Without WebGL the render and shader tasks are settled immediately with an
explanation, so the gate opens for a visitor with no GPU.

---

## How the animation system works

1. Each scene section is `300vh` tall with a `100vh` sticky child.
2. A ScrollTrigger spanning `top bottom → bottom top` writes normalised progress
   into the registry. It never calls `setState`.
3. A second ScrollTrigger spanning `top center → bottom center` updates
   `activeScene`. This is the only thing allowed to touch React.
4. `travel(progress)` maps the raw range onto the pinned window
   (`0.25 → 0.75`), which is why you get a held frame to read before the camera
   starts moving.
5. `useCameraRig` damps that value, interpolates a keyframe path with a
   smootherstep, applies pointer parallax along the camera's own basis, and
   adjusts framing for the viewport aspect.
6. Scene overlays poll the imperative runtimes on `requestAnimationFrame` and
   re-render only when a **bucketed** value changes — so a drag produces a few
   dozen renders, not a few hundred.

### Scroll smoothing

Lenis runs with `autoRaf: false` and is driven from GSAP's ticker, which is the
documented integration: ScrollTrigger's update and Lenis's raf then happen in the
same frame, in the right order, off one clock. GSAP's lag smoothing is disabled
for this shared loop, because letting the ticker skip ahead after a stall
desynchronises ScrollTrigger from Lenis.

When reduced motion is active, or the visitor turns smoothing off, Lenis is
**destroyed** rather than stopped: the page falls back to untouched native
scrolling, which is also what keeps browser scroll restoration, keyboard paging
and find-in-page working. Touch scrolling is never intercepted either.

---

## Performance

- **Adaptive quality.** A device profile is probed once at boot (WebGL support,
  renderer string, core count, reported memory, pointer type, viewport size) and
  resolved into one of three tiers. Every scene-owned count, the post chain,
  the corridor ring budget and the device pixel ratio are derived from it.
- **DPR cap.** Independently configurable, and never overridden once the visitor
  has chosen it themselves.
- **Instancing.** Fracture is one draw call; the corridor is one draw call.
- **Lazy scenes.** Each scene is a separate chunk, streamed during the gate and
  wrapped in `Suspense`.
- **GPU-animated particles.** Fields are generated once from a seed and uploaded
  as static attributes; everything after that is vertex work.
- **Allocation-free frame loops.** Scratch vectors, quaternions and matrices are
  created once and mutated in place.
- **Disposal.** Custom geometries, materials and buffer attributes are disposed
  on unmount; R3F handles its own.
- **Hidden tabs.** Rendering is suspended on `visibilitychange` when enabled,
  and the audio context is suspended with it.
- **No store subscriptions in `useFrame`.** The render loop reads non-reactive
  mirrors; `useThree` is always called with a selector, because subscribing to
  the whole R3F store re-renders the component on every frame.

> No frame-rate numbers are claimed here. The film has not been profiled on
> physical hardware; the Settings panel shows a live frame-rate readout so you
> can measure it on your own machine.

---

## Accessibility

- **The narrative is in the DOM.** The full text of every scene, all controls and
  all telemetry are real document content. The film is watchable with WebGL
  unavailable, with a screen reader, or with canvas switched off.
- **Reduced motion, twice.** The OS `prefers-reduced-motion` setting is detected
  automatically and can be overridden in Settings in either direction. With
  motion reduced, camera parallax and scroll smoothing are removed, shaders
  freeze their time-based terms, the grain stops animating and transitions become
  fades.
- **Keyboard.** Every control is a real focusable element with a visible focus
  ring. The scene rail is the fastest keyboard route through the whole film, the
  drawer traps focus and closes on Escape, and the skip link is the first tab
  stop.
- **Semantics.** Landmarks, labelled headings per scene, `aria-live` for scene
  changes and status, `role="switch"`/`role="radio"` for toggles, and a real
  `<input type="range">` for every slider (so arrow keys, Home/End and Page
  Up/Down work, and screen readers announce the value).
- **No hover-only content.** Every interaction is reachable by pointer, keyboard
  or touch.
- **Audio is optional and opt-in.** Nothing is audible until you press ENTER, and
  the AudioContext is created *synchronously inside that gesture* — constructing
  it from a store effect would fall outside the browser's user-activation window
  and both fail and log an autoplay warning.

---

## Testing

**Unit — Vitest, 133 tests.** Focused on the logic that is expensive to get
right and invisible when it breaks: parameter validation and clamping, config
serialisation and hostile-input handling, storage under corruption and quota
failure, the disintegration schedule's invariants, seeded field determinism, the
quality budget, the progress registry and shared clock.

**Browser — Playwright, 35 tests.** The critical flows in a real browser: the
loading gate and ENTER, all six scenes reached by scrolling, the scene rail,
Fracture's controls, replay, every route including refresh and 404, the
laboratory's controls, pause, capture download, export and import, keyboard
routes, reduced motion, settings persistence, the mobile drawer, and the
no-WebGL path.

One suite is deliberately unusual: `e2e/rendering.spec.ts` takes screenshots
and measures the luminance histogram of what was actually painted. It exists
because two real bugs got through every other check — the transition curtain
permanently covering the film, and the laboratory's particle exhibit rendering
at zero opacity. Both were invisible to DOM assertions. This suite now also
proves that `Pause` genuinely freezes the picture.

```bash
npm test
npm run test:e2e       # builds and serves automatically
```

---

## Assets and licensing

There are **no downloaded images, models, HDRIs or audio files** in this build.

| Asset | Source | Licence |
| --- | --- | --- |
| Space Grotesk | [Fontsource](https://fontsource.org/fonts/space-grotesk), by Florian Karsten | SIL OFL 1.1 |
| IBM Plex Mono | [Fontsource](https://fontsource.org/fonts/ibm-plex-mono), by Mike Abbink | SIL OFL 1.1 |
| Simplex noise (GLSL) | Ashima Arts / Stefan Gustavson | MIT |

Everything else — geometry, the sea, particles, materials, grain, ambience —
is generated procedurally at runtime from fixed seeds. The film looks and sounds
identical offline and cannot break because a host disappeared.

---

## Known limitations

- **No frame-rate claims.** The piece has not been profiled on physical
  hardware; the only measured number in this repository comes from headless
  Chromium on SwiftShader, which is not representative. Use the live readout in
  Settings.
- **Software rendering is refused, not attempted.** If the probe sees a software
  rasteriser it serves the written version rather than a slideshow. `?renderer=force`
  overrides this.
- **`THREE.Clock` deprecation warning.** `@react-three/fiber` still constructs a
  `THREE.Clock` internally. It is emitted by the library, not by this code, and
  is the only console output during a normal session.
- **Touch does not drive the parallax.** On a phone a drag is a scroll gesture,
  and hijacking it as a look-around input fights the native scroll. Touch feeds
  the exhibits' own interactions instead.
- **Pointer parallax is desktop-only**, by the same reasoning.
- **The scene rail's per-scene telemetry is static text**, authored in
  `sceneManifest.ts`, not a live instrument reading. The Fracture, Threshold and
  Void overlays *do* read live values.
- **Post-processing is skipped on the low tier**, so bloom and grain are absent
  there rather than approximated more cheaply.
- **No service worker.** The build is fully offline-capable once loaded, but it
  does not cache itself for a second visit.
- **The `onBeforeCompile` material patches depend on three's internal chunk
  names** (`<map_fragment>`, `<begin_vertex>`, `<emissivemap_fragment>`). If
  three renames them the patches silently stop applying and the affected surfaces
  lose their procedural detail; they do not throw. Pinned to three `0.186.x`.
- **Import repair messages are unlocalised** and shown in English only.
