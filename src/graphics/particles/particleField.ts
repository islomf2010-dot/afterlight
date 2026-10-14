/**
 * CPU-side particle field generation.
 *
 * Runs exactly once per field (memoised by the caller), never per frame. All
 * animation after this point happens in the vertex shader, so raising the
 * particle count costs upload time once and nothing afterwards.
 *
 * Distributions are chosen per exhibit so the fields do not all read as the
 * same generic cloud.
 */

import { gauss, mulberry32, randomUnitVector, type Rng } from '@/utils/prng';

export type ParticleDistribution = 'volume' | 'shell' | 'column' | 'plate' | 'halo';

export interface ParticleFieldData {
  count: number;
  positions: Float32Array;
  scales: Float32Array;
  phases: Float32Array;
}

export interface ParticleFieldOptions {
  count: number;
  /** Half-extent of the field on each axis. */
  extent: [number, number, number];
  seed: number;
  distribution: ParticleDistribution;
  /** Relative spread of the per-particle size multiplier. */
  sizeRange?: [number, number];
}

const tmp = { x: 0, y: 0, z: 0 };

const placeInDistribution = (rng: Rng, dist: ParticleDistribution, out: typeof tmp): void => {
  switch (dist) {
    case 'shell': {
      // Hollow sphere — reads as a bubble/cloud boundary rather than a blob.
      randomUnitVector(rng, out);
      const r = 0.82 + rng() * 0.18;
      out.x *= r;
      out.y *= r;
      out.z *= r;
      break;
    }
    case 'column': {
      // Narrow and tall: the Void's atmospheric dust and the corridor motes.
      const a = rng() * Math.PI * 2;
      const r = Math.sqrt(rng());
      out.x = Math.cos(a) * r;
      out.z = Math.sin(a) * r;
      out.y = gauss(rng);
      break;
    }
    case 'plate': {
      // Flat disc — used as a ground haze layer.
      const a = rng() * Math.PI * 2;
      const r = Math.sqrt(rng());
      out.x = Math.cos(a) * r;
      out.z = Math.sin(a) * r;
      out.y = gauss(rng) * 0.08;
      break;
    }
    case 'halo': {
      // Dense ring around the origin — the particle exhibit's signature shape.
      const a = rng() * Math.PI * 2;
      const r = 0.78 + Math.sqrt(rng()) * 0.22;
      out.x = Math.cos(a) * r;
      out.y = (rng() - 0.5) * 0.42;
      out.z = Math.sin(a) * r;
      break;
    }
    case 'volume':
    default: {
      randomUnitVector(rng, out);
      const r = rng() ** (1 / 3); // uniform in the ball, not toward the centre
      out.x *= r;
      out.y *= r;
      out.z *= r;
      break;
    }
  }
};

/**
 * Generates a field. Positions are biased toward the centre by a Gaussian
 * blend so the clouds have density gradients instead of uniform noise.
 */
export const createParticleField = (options: ParticleFieldOptions): ParticleFieldData => {
  const { count, extent, seed, distribution } = options;
  const [minSize, maxSize] = options.sizeRange ?? [0.45, 1.6];
  const rng = mulberry32(seed);

  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    placeInDistribution(rng, distribution, tmp);
    // Blend 30% of particles toward the origin to build a density gradient.
    if (rng() < 0.3) {
      tmp.x *= 0.35;
      tmp.y *= 0.35;
      tmp.z *= 0.35;
    }
    const i3 = i * 3;
    positions[i3] = tmp.x * extent[0];
    positions[i3 + 1] = tmp.y * extent[1];
    positions[i3 + 2] = tmp.z * extent[2];

    // Power-biased so most particles are small and a few are bright — this is
    // what makes a point cloud look like dust instead of confetti.
    scales[i] = minSize + (maxSize - minSize) * rng() ** 2.2;
    phases[i] = rng();
  }

  return { count, positions, scales, phases };
};

/**
 * Deterministic fragment layout for the Fracture scene.
 *
 * Fragments are sampled on the *surface* of a bevelled slab, which is what the
 * intact structure looks like. Each fragment carries its own breakup delay,
 * direction, spin axis and drift distance so the disintegration reads as a
 * propagating failure rather than an explosion triggered everywhere at once.
 */
/** Upper bound on a fragment's start delay, leaving every fragment a travel window. */
export const MAX_FRACTURE_DELAY = 0.92;

export interface FractureLayout {
  count: number;
  /** Rest position (intact). */
  rest: Float32Array;
  /** Scattered position (fully disintegrated). */
  scatter: Float32Array;
  /** Per-fragment quaternion-free euler spin applied while scattered. */
  spin: Float32Array;
  scales: Float32Array;
  /** 0→1 normalised delay before this fragment starts moving. */
  delays: Float32Array;
  /** Random phase used for idle rotation while intact. */
  phases: Float32Array;
}

export interface FractureLayoutOptions {
  count: number;
  seed: number;
  size: [number, number, number];
  /** How far fragments travel at full disintegration. */
  scatterRadius: number;
}

export const createFractureLayout = (options: FractureLayoutOptions): FractureLayout => {
  const { count, seed, size, scatterRadius } = options;
  const rng = mulberry32(seed);
  const rest = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const spin = new Float32Array(count * 3);
  const scales = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const phases = new Float32Array(count);

  const [hx, hy, hz] = size;

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const u = rng();
    const v = rng();
    const w = rng();

    // Slab surface sampling: pick the dominant axis, then sample the other two
    // uniformly with a small inset so fragments do not sit exactly on the face.
    const face = Math.floor(rng() * 6);
    const inset = 0.035;
    const a = (u - 0.5) * (1 - inset * 2);
    const b = (v - 0.5) * (1 - inset * 2);
    let x = 0;
    let y = 0;
    let z = 0;
    switch (face) {
      case 0:
        x = 0.5 - inset;
        y = a;
        z = b;
        break;
      case 1:
        x = -0.5 + inset;
        y = a;
        z = b;
        break;
      case 2:
        x = a;
        y = 0.5 - inset;
        z = b;
        break;
      case 3:
        x = a;
        y = -0.5 + inset;
        z = b;
        break;
      case 4:
        x = a;
        y = b;
        z = 0.5 - inset;
        break;
      default:
        x = a;
        y = b;
        z = -0.5 + inset;
        break;
    }
    rest[i3] = x * hx * 2;
    rest[i3 + 1] = y * hy * 2;
    rest[i3 + 2] = z * hz * 2;

    // Scatter: radial bias upward + outward, magnitude growing with height so
    // the base stays "anchored" and the top disintegrates first.
    const heightBias = 0.35 + ((rest[i3 + 1] + hy) / (2 * hy)) * 0.9;
    randomUnitVector(rng, tmp);
    const reach = scatterRadius * (0.35 + rng() * 0.85) * heightBias;
    scatter[i3] = rest[i3] + tmp.x * reach;
    scatter[i3 + 1] = rest[i3 + 1] + tmp.y * reach * 0.75 + reach * 0.15;
    scatter[i3 + 2] = rest[i3 + 2] + tmp.z * reach;

    spin[i3] = (rng() - 0.5) * 3.2;
    spin[i3 + 1] = (rng() - 0.5) * 3.2;
    spin[i3 + 2] = (rng() - 0.5) * 3.2;

    const s = 0.055 + rng() ** 2.6 * 0.16;
    scales[i3] = s;
    scales[i3 + 1] = s * (0.6 + rng() * 0.9);
    scales[i3 + 2] = s * (0.6 + rng() * 0.9);

    // Delay correlates with height: the failure travels upward.
    //
    // Capped below 1 so every fragment still has a non-zero window to travel
    // in — at delay = 1 the schedule's divisor would collapse to zero and the
    // topmost fragments would never actually arrive anywhere.
    const normalizedHeight = (rest[i3 + 1] + hy) / (2 * hy);
    delays[i] = Math.min(MAX_FRACTURE_DELAY, Math.max(0, normalizedHeight * 0.72 + (rng() - 0.5) * 0.22));

    phases[i] = w;
  }

  return { count, rest, scatter, spin, scales, delays, phases };
};
