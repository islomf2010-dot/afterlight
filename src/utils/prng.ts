/**
 * Deterministic pseudo-random helpers.
 *
 * Every procedural scene (fracture fragments, dust fields, corridor wear)
 * is generated from a fixed seed so the composition is identical on every
 * load and across reloads — the "authored" feel is reproducible.
 */

export type Rng = () => number;

/** mulberry32 — small, fast, good enough distribution for visual work. */
export const mulberry32 = (seed: number): Rng => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Stable 32-bit string hash (FNV-1a). Lets us seed from route names. */
export const hashString = (input: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

export const rngFromString = (input: string): Rng => mulberry32(hashString(input));

/** Uniform float in [min, max). */
export const range = (rng: Rng, min: number, max: number): number => min + rng() * (max - min);

/** Integer in [min, max]. */
export const intRange = (rng: Rng, min: number, max: number): number =>
  Math.floor(min + rng() * (max - min + 1));

/** Biased toward the low end — good for particle sizes and falloff values. */
export const powerRange = (rng: Rng, min: number, max: number, power = 2): number =>
  min + (max - min) * rng() ** power;

/**
 * Approximately gaussian via the mean of 3 uniforms, scaled to [-1, 1].
 * Used for organic scatter that should cluster around a centre.
 */
export const gauss = (rng: Rng): number => ((rng() + rng() + rng()) / 3 - 0.5) * 2;

/** Uniform point on a unit sphere (Marsaglia's method — no trig, no rejection). */
export const randomUnitVector = (rng: Rng, out: { x: number; y: number; z: number }): void => {
  let x: number;
  let y: number;
  let s: number;
  do {
    x = rng() * 2 - 1;
    y = rng() * 2 - 1;
    s = x * x + y * y;
  } while (s >= 1 || s === 0);
  const f = 2 * Math.sqrt(1 - s);
  out.x = x * f;
  out.y = y * f;
  out.z = 1 - 2 * s;
};
