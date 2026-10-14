/**
 * The interactive laboratory's parameter model.
 *
 * This module is deliberately pure: no React, no zustand, no DOM beyond
 * structured-clone friendly types. The store, the control panel, the JSON
 * import/export and the unit tests all speak the same schema, which is what
 * guarantees "every control affects rendering" — a control that is not
 * declared here cannot be rendered.
 */

import { clamp, isFiniteNumber, snapTo } from '@/utils/math';

export const EFFECT_CONFIG_FORMAT = 'afterlight.effect-config' as const;
export const EFFECT_CONFIG_VERSION = 1;

export interface EffectParams {
  /** Number of live particles in the field. */
  particleCount: number;
  /** Shader warp amount (0 = clean, 1 = maximum smear). */
  distortion: number;
  /** How strongly the pointer pushes / pulls the field. */
  pointerInfluence: number;
  /** Exponential-squared fog density in the exhibit. */
  fogDensity: number;
  /** Bloom intensity in the post chain. */
  bloom: number;
  /** Global animation speed multiplier. */
  speed: number;
}

export type EffectParamKey = keyof EffectParams;

export interface EffectParamSpec {
  key: EffectParamKey;
  label: string;
  short: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  decimals: number;
  hint: string;
}

export const EFFECT_PARAM_SPECS: readonly EffectParamSpec[] = [
  {
    key: 'particleCount',
    label: 'Particle count',
    short: 'PARTICLES',
    unit: '',
    min: 500,
    max: 12_000,
    step: 100,
    decimals: 0,
    hint: 'Live instances in the field. Lower counts trade density for frame time.',
  },
  {
    key: 'distortion',
    label: 'Distortion intensity',
    short: 'DISTORT',
    unit: '',
    min: 0,
    max: 1,
    step: 0.01,
    decimals: 2,
    hint: 'Amplitude of the per-particle warp in the vertex stage.',
  },
  {
    key: 'pointerInfluence',
    label: 'Pointer influence',
    short: 'POINTER',
    unit: '×',
    min: 0,
    max: 2,
    step: 0.05,
    decimals: 2,
    hint: 'Strength of the pointer-driven displacement field.',
  },
  {
    key: 'fogDensity',
    label: 'Fog density',
    short: 'FOG',
    unit: '',
    min: 0,
    max: 1,
    step: 0.01,
    decimals: 2,
    hint: 'Exponential-squared density of the scene fog.',
  },
  {
    key: 'bloom',
    label: 'Bloom intensity',
    short: 'BLOOM',
    unit: '',
    min: 0,
    max: 1.5,
    step: 0.01,
    decimals: 2,
    hint: 'Luminance threshold bloom in the post-processing chain.',
  },
  {
    key: 'speed',
    label: 'Animation speed',
    short: 'SPEED',
    unit: '×',
    min: 0,
    max: 2,
    step: 0.01,
    decimals: 2,
    hint: 'Global time multiplier. 0 freezes motion without stopping rendering.',
  },
] as const;

export const EFFECT_PARAM_KEYS = EFFECT_PARAM_SPECS.map((s) => s.key);

export const DEFAULT_EFFECT_PARAMS: Readonly<EffectParams> = Object.freeze({
  particleCount: 3200,
  distortion: 0.45,
  pointerInfluence: 1,
  fogDensity: 0.38,
  bloom: 0.55,
  speed: 1,
});

export const paramSpec = (key: EffectParamKey): EffectParamSpec => {
  const spec = EFFECT_PARAM_SPECS.find((s) => s.key === key);
  if (!spec) throw new Error(`Unknown effect parameter: ${key}`);
  return spec;
};

export const clampParamValue = (key: EffectParamKey, value: number): number => {
  const spec = paramSpec(key);
  return snapTo(clamp(value, spec.min, spec.max), spec.step);
};

export interface SanitizeResult {
  params: EffectParams;
  /** Human-readable list of repairs applied, for the import toast. */
  repairs: string[];
  /** True when nothing in the payload was usable. */
  rejected: boolean;
}

export const defaultEffectParams = (): EffectParams => ({ ...DEFAULT_EFFECT_PARAMS });

/**
 * Coerce arbitrary input (parsed JSON, stale localStorage, a URL query) into
 * a valid parameter set. Unknown keys are dropped, out-of-range values are
 * clamped and snapped to the declared step, non-numeric values fall back to
 * the default and are reported.
 */
export const sanitizeEffectParams = (input: unknown): SanitizeResult => {
  const repairs: string[] = [];
  const params = defaultEffectParams();

  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return { params, repairs: ['Payload was not an object — defaults applied.'], rejected: true };
  }

  const source = input as Record<string, unknown>;
  // Accept both a bare params object and a wrapped { params: {...} } envelope.
  const inner =
    typeof source.params === 'object' && source.params !== null && !Array.isArray(source.params)
      ? (source.params as Record<string, unknown>)
      : source;

  let recognised = 0;
  for (const spec of EFFECT_PARAM_SPECS) {
    const raw = inner[spec.key];
    if (raw === undefined) continue;
    if (!isFiniteNumber(raw)) {
      repairs.push(`${spec.label}: "${String(raw)}" is not a number — default used.`);
      continue;
    }
    recognised += 1;
    const clamped = clamp(raw, spec.min, spec.max);
    if (clamped !== raw) {
      repairs.push(`${spec.label}: ${raw} clamped to ${clamped}.`);
    }
    params[spec.key] = snapTo(clamped, spec.step);
  }

  if (recognised === 0) {
    return {
      params,
      repairs: [...repairs, 'No recognised parameters found — defaults applied.'],
      rejected: true,
    };
  }

  return { params, repairs, rejected: false };
};

export interface EffectConfigFile {
  format: typeof EFFECT_CONFIG_FORMAT;
  version: number;
  savedAt: string;
  params: EffectParams;
}

export const serializeEffectConfig = (params: EffectParams): EffectConfigFile => ({
  format: EFFECT_CONFIG_FORMAT,
  version: EFFECT_CONFIG_VERSION,
  savedAt: new Date().toISOString(),
  params: { ...params },
});

export interface ParseConfigResult extends SanitizeResult {
  savedAt?: string;
  formatOk: boolean;
}

export const parseEffectConfig = (text: string): ParseConfigResult => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      params: defaultEffectParams(),
      repairs: ['File is not valid JSON — defaults applied.'],
      rejected: true,
      formatOk: false,
    };
  }

  const formatOk =
    typeof parsed === 'object' &&
    parsed !== null &&
    (parsed as { format?: unknown }).format === EFFECT_CONFIG_FORMAT;

  const result = sanitizeEffectParams(parsed);
  const savedAt =
    typeof parsed === 'object' && parsed !== null && typeof (parsed as { savedAt?: unknown }).savedAt === 'string'
      ? (parsed as { savedAt: string }).savedAt
      : undefined;

  return {
    ...result,
    savedAt,
    formatOk,
    repairs: formatOk ? result.repairs : ['Not an AFTERLIGHT effect config — values imported anyway.'],
  };
};

/** Randomise within the middle 80% of every range so results stay usable. */
export const randomizeEffectParams = (seed: number): EffectParams => {
  const params = defaultEffectParams();
  const mulberry = (salt: number): number => {
    let t = (seed ^ (0x9e3779b9 + salt)) >>> 0;
    t = Math.imul(t ^ (t >>> 16), 0x2246822507);
    t = Math.imul(t ^ (t >>> 13), 0x9e3779b1);
    return ((t ^= t >>> 16) >>> 0) / 4294967296;
  };
  EFFECT_PARAM_SPECS.forEach((spec, index) => {
    const span = spec.max - spec.min;
    const value = spec.min + span * (0.1 + mulberry(index * 7919 + 1) * 0.8);
    params[spec.key] = snapTo(clamp(value, spec.min, spec.max), spec.step);
  });
  return params;
};
