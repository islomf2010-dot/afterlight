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
- [Integrated libraries](#integrated-libraries)
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
> `vite preview` already does this, and **`vercel.json` is included** for
> Vercel — it performs the rewrite and gives hashed build assets a one-year
> immutable cache while leaving `/assets/*` and other real files alone. For
> Netlify: `/* /index.html 200`. For nginx: `try_files $uri $uri/ /index.html;`.
> For S3/CloudFront: set the error document to `index.html`.

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

Six standalone harnesses live in `scripts/` and run with plain Node against a
running `preview`. Each prints a pass/fail line per check and exits non-zero on
failure, so they are usable in CI as well as by hand.

| Script | What it checks |
| --- | --- |
| `scripts/verify.mjs` | Drives the critical flows and prints every console message |
| `scripts/diagnose.mjs` | 18 behavioural probes: navigation churn, history back/forward, scrubbing in both directions, resize mid-animation, canvas lifecycle in the lab, hostile stored parameters, reduced motion, console cleanliness |
| `scripts/responsive.mjs` | 4 viewports × 4 routes: overflow, clipping, touch-target sizes. `--shots` also writes screenshots |
| `scripts/contrast.mjs` | Measures the painted luminance of every scene caption against WCAG AA and fails if any block falls short |
| `scripts/perf.mjs` | Frame-time sampling per scene, per laboratory study and per quality preset |
| `scripts/library-check.mjs` | The integrated library experiments: do they render, do they animate, do they release their context, is reduced motion honoured |
| `scripts/shots.mjs` | Writes reference screenshots of every scene, route and the phone layout to `.shots/` |

```bash
npm run build && npm run preview &
node scripts/diagnose.mjs
```

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
| **Pause / Resume** | — | Halts the shared clock that drives every scene. Rendering continues so the frame stays on screen. The post-processing grain runs on the renderer's own clock and keeps breathing — Pause stops the *film*, not the grain. |
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
  graphics/
    effects/      canvas lifecycle + capture bridge, shared by film and lab
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

`graphics/effects/CanvasLifecycle.tsx` exists because of a leak found during audit:
canvas context-loss and visibility listeners were appended to a module-level array
that was never drained, so every navigation stacked another pair. The listeners
are now removed by the effect that added them.

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
- **Touch targets scale with the pointer, not the screen.** Control heights come
  from `--al-control-sm/md/lg`, and a `(pointer: coarse)` block overrides them to
  44 px. The desktop HUD stays restrained; a phone gets targets that a thumb can
  actually hit. `e2e/responsive.spec.ts` asserts the real rendered box for both
  pointer types, so a token that stops working fails the build rather than
  quietly shrinking a button.
- **No store subscriptions in `useFrame`.** The render loop reads non-reactive
  mirrors; `useThree` is always called with a selector, because subscribing to
  the whole R3F store re-renders the component on every frame.

### Measured, and what it does and does not mean

`node scripts/perf.mjs` samples real `requestAnimationFrame` deltas (best of
three runs, first five frames discarded to skip shader-compile spikes):

| Scene | SwiftShader | Representative of a GPU? |
| --- | --- | --- |
| The Void | 11–13 fps | No |
| Fracture | 20–23 fps | No |
| The Threshold | 6–9 fps | No |
| Echoes | 10–12 fps | No |
| Afterlight | 21–23 fps | No |

**These are software-rasteriser numbers and must not be read as the experience on
a real GPU.** Chromium here is rasterising every pixel on the CPU. What *is*
portable is the ordering: The Threshold is consistently the most expensive scene,
and the quality presets are monotonic in the right direction
(`low` 10.5 → `medium` 3.4 fps at the same DPR step), which is the fill-rate
signature you would expect.

That investigation produced one real fix. The corridor walls fill the viewport
and were running a 3D value noise — eight hash evaluations per fragment — for a
surface that is planar, where a 2D noise is visually identical at four. Swapping
it (`vnoise2` in `graphics/shaders/common.ts`) moved The Threshold from 6.5 to
8.1 fps, a 25% gain with no change to the image. Two further hypotheses were
measured and rejected: removing a punctual light gained ~2%, removing the ceiling
~8%. The remaining cost is genuine geometry, so it was left alone rather than
buying frames by cutting scene content.

Two performance claims this project makes are **not** verified, and are marked as
such: the 60 fps target on real hardware, and the hidden-tab suspension, which
cannot be driven in headless Chromium (`Page.setWebLifecycleState` accepts only
`frozen`/`active`, and a second tab does not mark the first hidden). The latter is
covered by a unit test of the visibility hook instead — see
`src/hooks/usePageVisibility.test.ts`.

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
- **Caption contrast is measured, not asserted.** `node scripts/contrast.mjs`
  reads each scene caption's real box out of the live DOM, samples the painted
  pixels, and reports the ratio against the WCAG AA 4.5:1 floor. It currently
  passes on all ten desktop and phone blocks at **5.13–6.49:1**.

  Two defects were found this way and would not have been caught by a DOM
  assertion. `--al-text-ghost` was 18% opacity — used for whole sentences, it
  measured **1.42:1**. And the caption scrim is `position: absolute` with
  `z-index: auto`, which per the CSS painting order draws *above* in-flow
  content, so the scrim meant to sit behind the caption was in fact drawn on top
  of it and crushed it to **1.37:1** no matter what colour token was used. The
  stage now carries `relative` so both are positioned and the later one wins.
  `--al-text-ghost` is now reserved for the one decorative mark that needs it
  (the TechLabel dot) and is documented as never-for-a-sentence.
- **Audio is optional and opt-in.** Nothing is audible until you press ENTER, and
  the AudioContext is created *synchronously inside that gesture* — constructing
  it from a store effect would fall outside the browser's user-activation window
  and both fail and log an autoplay warning.

---

## Testing

**Unit — Vitest, 138 tests.** Focused on the logic that is expensive to get
right and invisible when it breaks: parameter validation and clamping, config
serialisation and hostile-input handling, storage under corruption and quota
failure, the disintegration schedule's invariants, seeded field determinism, the
quality budget, the progress registry, shared clock, and the page-visibility hook
that suspends rendering in a background tab.

**Browser — Playwright, 55 tests.** The critical flows in a real browser: the
loading gate and ENTER, all six scenes reached by scrolling, the scene rail,
Fracture's controls, replay, every route including refresh and 404, the
laboratory's controls, pause, capture download, export and import, keyboard
routes, reduced motion, settings persistence, the mobile drawer, and the
no-WebGL path.

`e2e/responsive.spec.ts` runs four viewports (1440, 1280, 768, 390) against four
routes and asserts no horizontal overflow, no clipped text, and that every
visible target meets 24 px on a fine pointer and 44 px on a coarse one. It also
pins the header rule — the inline Settings control appears if and only if the
desktop navigation does. That suite exists because of three real defects that
every other test could not see: `hidden` silently loses to `inline-flex` in
Tailwind's cascade, so `SETTINGS` and `AUDIO ON` rendered on phones while the DOM
claimed otherwise; the header overflowed at exactly 768 px; and the scene rail's
markers were 20×24 px on touch.

One suite is deliberately unusual: `e2e/rendering.spec.ts` takes screenshots
and measures the luminance histogram of what was actually painted. It exists
because two real bugs got through every other check — the transition curtain
permanently covering the film, and the laboratory's particle exhibit rendering
at zero opacity. Both were invisible to DOM assertions. This suite now also
proves that `Pause` genuinely freezes the picture.

It waits for the frame to *stabilise* rather than for a fixed period. A four-second
timeout was correct on an idle machine and wrong on a loaded one, which produced a
genuine flake in full-suite runs; polling until two consecutive samples agree
removes the coupling without loosening an assertion, since a broken scene never
settles on a composed frame.

```bash
npm test
npm run test:e2e       # builds and serves automatically
```

---

## Integrated libraries

Four projects were evaluated against this codebase. **Two are installed
packages; two are standalone demos with no `package.json` and were adapted
rather than installed.** None of them replaced the existing architecture, and
none added a second WebGL context.

| Project | Form | Licence | Status |
| --- | --- | --- | --- |
| `@react-three/fiber` | npm package, already present at **9.8.1** | MIT | Reused as the existing foundation. No change of renderer. |
| `@shadergradient/react` | npm package **2.4.20** | MIT | Installed. Mesh form, mounted inside the existing canvas. |
| `liquid-glass-js` | **no package.json** — static script | MIT (© 2025 Armagan Amcalar) | Shader *model* adapted; its runtime rejected, see below. |
| `liquid-logo` | **no package.json** — vanilla WebGL demo | MIT (© 2025 Alan Ang) | Fragment shader ported; **no assets from the repo are shipped.** |

### Why two runtimes were rejected

Both `liquid-glass-js` and `liquid-logo` are demonstration pages, not libraries:
they have no package manifest, no ES module entry and no declared dependencies.

`liquid-glass-js` obtains its backdrop by calling `html2canvas(document.body)`,
rasterising the whole document, and feeding the bitmap to **its own WebGL
context** created with `preserveDrawingBuffer: true`. That is not usable here:
it would be a second context competing with the film's; `html2canvas` cannot
rasterise a WebGL canvas, which is precisely what sits behind every surface it
would need to refract; and a full-document rasterisation on every resize is not
a cost this project will pay for a decorative layer. Its *model* — the rounded
rectangle SDF, the displacement derived from it, the separate edge/rim/base
weights and the corner boost — is carried into `LiquidGlassSurface` and into
`.glass-surface` in CSS, where it costs no context.

`liquid-logo` masks its effect with third-party brand logos (Apple, Nike,
Pepsi, PlayStation and others). Those are trademarks and none of them ship
here. The mask is generated from live text at runtime instead, so the wordmark
is an editable string and the repository still contains no binary image asset.

### The liquid metal wordmark

`LiquidWordmark` renders inside whichever canvas is already open — it is a
`<mesh>`, not a `<Canvas>`. The flow-field integration, the edge-detect
deflection around the mask outline and the iterative tanh-style tone curve come
from upstream; the debug multipliers that cancel themselves out in the original
(`sin(t * 0.0 + …)`, `sin(… + time) * 0.00`) were removed rather than copied.

Three corrections were needed to make it work at all:

1. **Sizing.** The plane cannot be sized in pixels — three's world units have no
   relation to them. The first build produced a plane roughly sixteen times the
   height of the frustum, which displayed a hugely magnified crop of the mask as
   an undifferentiated bright field. It is now derived from the camera's own
   field of view, so `fill` means "fraction of the visible width" and nothing
   else.
2. **GLSL.** `vec4 expLx = exp(-uExpFactor * lens)` relies on a scalar-to-vector
   widening that does not hold on every target three compiles for; it failed to
   build on WebGL2. Now written `vec4(...)` explicitly.
3. **Tone.** At full range the wordmark washed out the entire page behind it.
   The band is biased low and the rim bounded, so it sits *in* the frame.

### ShaderGradient

The package ships two entry points. `ShaderGradientCanvas` creates its own
`<Canvas>`; `ShaderGradient` renders a plain `<mesh>`, so the mesh form is used
and the experiment costs one draw call in the context the laboratory already
owns.

Three of its subcomponents are switched off, each for a concrete reason: its
`<PostProcessing>` would install a second `EffectComposer` over the laboratory's
own; `toggleAxis` is a debug gizmo; and its `Controls` grabs the shared camera
through `useThree` and drives it with `camera-controls`, which would fight the
film's scroll-driven camera rig. The gradient study is therefore lab-only and is
never mounted in the film.

**Compatibility fix required.** `@shadergradient/react` 2.4.20 ships shaders
that `#include` six chunks three removed or renamed in r152 — `uv2_pars_vertex`,
`uv2_vertex`, `uv2_pars_fragment`, `encodings_fragment`,
`transmissionmap_pars_fragment` and `transmissionmap_fragment`. On three 0.186.1
every one of its materials fails to link. `shadergradientThreeCompat.ts`
restores them with their original pre-r152 content. They are `USE_*`-guarded and
the package never defines those, so they expand to nothing exactly as they did
on the three they were written for.

**Animation ownership.** The package only advances `uTime` while
`animate="on"`, using its own local clock. That was the first build's setting
and it meant the study kept animating under reduced motion — measured, not
assumed. With `animate="on"` the package's `useFrame` runs after this
component's and overwrites the value written there. It is now `animate="off"`
with `uTime` driven directly from the shared clock, so PAUSE and reduced motion
apply.

### Liquid glass in the interface

`.glass-surface` in `src/styles/global.css` is CSS: `backdrop-filter` for the
refraction, a masked conic-gradient rim for the edge light (the conic gradient is
what reproduces the library's corner boost — corners turn through more of the
light's arc than the straight sides), and an `@supports` guard that falls back to
a plain translucent panel with a hairline border where `backdrop-filter` is
unsupported. No layout of its own, so it never changes a control's size.

Applied selectively, as a film should be: the `primary` button variant (which is
the ENTER control) and the settings panel at the `quiet` tone. Everything else
stays flat — glass on every surface would read as a component demo.

### Playground

`/lab` keeps its three film studies exactly as they were. The film is described
to the visitor as "Study I / II / III" and the Echoes overlay reports a live
"Study N of 3", so the library experiments are a separate, separately-labelled
enumeration at `/lab/liquid`, `/lab/gradient` and `/lab/glass`. A playground
route does not set the shared focus mirror, because claiming to be one of the
film's exhibits would move the Echoes camera.

### Verification

`node scripts/library-check.mjs` — 15 checks. Each study must paint a frame that
is not empty, not flat, and that changes over time; reduced motion must stop the
motion; the laboratory must own exactly one canvas; leaving it must release it;
and the console must be clean.

Measuring "did it change" took three attempts, each of which was wrong:

- **Mean absolute difference** is swamped by the app's film grain, which
  perturbs every pixel every frame.
- **A high percentile across the whole frame** misses a small effect: the
  wordmark occupies a few percent of the pixels, so a p99 taken over the entire
  frame lands outside it.
- **The final instrument** is the *fraction of pixels that moved by more than
  four levels*, with the grain overlay disabled for the measurement. A frozen
  frame scores 0.00%; the wordmark scores 0.38% and the gradient 25.9%.

That last measurement is what caught the gradient's reduced-motion bug.

### Known limitation

**The liquid glass study does not perceptibly animate.** It renders correctly
and every uniform is wired to the material, but the largest per-pixel change
across the whole frame over 2.5 s is one level, against a frozen-frame baseline
of zero. Refraction and sheen both act on a smooth generated field, and at this
size neither displaces it enough to move a pixel. `library-check.mjs` reports
this as a `WARN`, not a pass. It is unfinished, not working.

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

- **No frame-rate claims for real hardware.** The piece has not been profiled on
  a GPU. The only frame timings in this repository come from headless Chromium
  on SwiftShader; they are reported above as software-rasteriser numbers and are
  not a prediction. Use the live readout in Settings.
- **Hidden-tab suspension is verified structurally, not by measurement.** It
  cannot be exercised end-to-end in headless Chromium — see the Performance
  section. The hook is unit-tested; the behaviour on a real tab switch is not
  observed here.
- **Software rendering is refused, not attempted.** If the probe sees a software
  rasteriser it serves the written version rather than a slideshow. `?renderer=force`
  overrides this, and every measurement above was taken with it on.
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
