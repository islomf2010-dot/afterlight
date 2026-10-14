/**
 * Small numeric helpers shared by animation, shaders' JS-side maths and tests.
 * Kept dependency-free and allocation-free.
 */

/**
 * Clamps to a range.
 *
 * NaN-safe by design: `NaN` fails every comparison, so a naive clamp would
 * return `NaN` and silently poison every downstream matrix, uniform or vertex.
 * Falling back to `min` keeps the system in a defined state instead.
 */
export const clamp = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  return value < min ? min : value > max ? max : value;
};

export const saturate = (value: number): number => clamp(value, 0, 1);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const invLerp = (a: number, b: number, v: number): number =>
  a === b ? 0 : (v - a) / (b - a);

export const remap = (v: number, inMin: number, inMax: number, outMin: number, outMax: number): number =>
  outMin + (outMax - outMin) * invLerp(inMin, inMax, v);

/** Hermite smoothstep, clamped. The workhorse easing for normalised progress. */
export const smoothstep = (t: number): number => {
  const x = saturate(t);
  return x * x * (3 - 2 * x);
};

export const smootherstep = (t: number): number => {
  const x = saturate(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/** Rises 0→1 across the first `edge` of the range, holds, then falls 1→0 at the tail. */
export const window01 = (t: number, edge = 0.25, tail = 0.25): number => {
  const rise = smoothstep(invLerp(0, Math.max(edge, 1e-4), t));
  const fall = 1 - smoothstep(invLerp(1 - Math.max(tail, 1e-4), 1, t));
  return rise * fall;
};

/**
 * Frame-rate independent exponential smoothing.
 * `lambda` is roughly "how many e-folds per second" — higher is snappier.
 */
export const damp = (current: number, target: number, lambda: number, delta: number): number =>
  lerp(current, target, 1 - Math.exp(-lambda * Math.min(delta, 0.1)));

export const fract = (x: number): number => x - Math.floor(x);

export const wrap = (x: number, min: number, max: number): number => {
  const range = max - min;
  return range === 0 ? min : min + fract((x - min) / range) * range;
};

export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/** Quantises to a discrete step (used for particle counts and slider snapping). */
export const snapTo = (value: number, step: number): number =>
  step <= 0 ? value : Math.round(value / step) * step;

/**
 * Maps a scene's raw scroll progress onto the window where its content is
 * pinned and the camera actually travels.
 *
 * Sections are 300vh tall and the inner content is `position: sticky`, so it is
 * pinned while the raw progress runs 0.25 → 0.75. Travelling only inside that
 * window is what produces "read, then move" instead of "move constantly".
 */
export const PIN_WINDOW = { start: 0.25, end: 0.75 } as const;

export const travel = (raw: number): number =>
  saturate((raw - PIN_WINDOW.start) / (PIN_WINDOW.end - PIN_WINDOW.start));
