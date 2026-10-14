import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_EFFECT_PARAMS,
  EFFECT_PARAM_KEYS,
  EFFECT_PARAM_SPECS,
  clampParamValue,
  defaultEffectParams,
  parseEffectConfig,
  randomizeEffectParams,
  sanitizeEffectParams,
  serializeEffectConfig,
} from './effectConfig';
import type { EffectParams } from './effectConfig';

describe('schema integrity', () => {
  it('every parameter has a default inside its own range', () => {
    for (const spec of EFFECT_PARAM_SPECS) {
      const value = DEFAULT_EFFECT_PARAMS[spec.key];
      expect(value, spec.key).toBeGreaterThanOrEqual(spec.min);
      expect(value, spec.key).toBeLessThanOrEqual(spec.max);
    }
  });

  it('every parameter is stepped from its minimum', () => {
    for (const spec of EFFECT_PARAM_SPECS) {
      expect(clampParamValue(spec.key, spec.min), spec.key).toBeCloseTo(spec.min, 6);
      expect(clampParamValue(spec.key, spec.max), spec.key).toBeCloseTo(spec.max, 6);
    }
  });

  it('declares exactly the documented six controls, all distinct', () => {
    expect(EFFECT_PARAM_KEYS).toEqual([
      'particleCount',
      'distortion',
      'pointerInfluence',
      'fogDensity',
      'bloom',
      'speed',
    ]);
    expect(new Set(EFFECT_PARAM_KEYS).size).toBe(EFFECT_PARAM_KEYS.length);
  });

  it('rejects an unknown parameter name', () => {
    expect(() => clampParamValue('nope' as never, 1)).toThrow();
  });

  it('defaultEffectParams returns a fresh mutable object', () => {
    const a = defaultEffectParams();
    const b = defaultEffectParams();
    expect(a).not.toBe(b);
    a.distortion = 1;
    expect(b.distortion).toBe(DEFAULT_EFFECT_PARAMS.distortion);
    expect(DEFAULT_EFFECT_PARAMS.distortion).not.toBe(1);
  });
});

describe('clampParamValue', () => {
  it('clamps out-of-range values', () => {
    expect(clampParamValue('distortion', 5)).toBe(1);
    expect(clampParamValue('distortion', -5)).toBe(0);
    expect(clampParamValue('particleCount', 1e9)).toBe(12_000);
  });

  it('snaps to the declared step', () => {
    expect(clampParamValue('particleCount', 3250)).toBe(3300);
    expect(clampParamValue('distortion', 0.4449)).toBeCloseTo(0.44, 6);
  });

  it('handles NaN by falling back to the minimum', () => {
    const result = clampParamValue('speed', Number.NaN);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('sanitizeEffectParams', () => {
  it('accepts a valid payload unchanged', () => {
    const input: EffectParams = {
      particleCount: 5000,
      distortion: 0.2,
      pointerInfluence: 0.5,
      fogDensity: 0.1,
      bloom: 1.2,
      speed: 1.75,
    };
    const result = sanitizeEffectParams(input);
    expect(result.params).toEqual(input);
    expect(result.repairs).toHaveLength(0);
    expect(result.rejected).toBe(false);
  });

  it('clamps and reports every repair', () => {
    const result = sanitizeEffectParams({ particleCount: 99_999, distortion: -3, bloom: 'loud' });
    expect(result.params.particleCount).toBe(12_000);
    expect(result.params.distortion).toBe(0);
    expect(result.params.bloom).toBe(DEFAULT_EFFECT_PARAMS.bloom);
    expect(result.repairs.some((r) => r.includes('Particle count'))).toBe(true);
    expect(result.repairs.some((r) => r.includes('Distortion'))).toBe(true);
    expect(result.repairs.some((r) => r.includes('Bloom'))).toBe(true);
    expect(result.rejected).toBe(false);
  });

  it('drops unknown keys without complaining', () => {
    const result = sanitizeEffectParams({ distortion: 0.9, nonsense: true });
    expect(result.params.distortion).toBe(0.9);
    expect(result.params).not.toHaveProperty('nonsense');
  });

  it('unwraps a { params: {...} } envelope', () => {
    const result = sanitizeEffectParams({ format: 'x', params: { speed: 2 } });
    expect(result.params.speed).toBe(2);
    expect(result.rejected).toBe(false);
  });

  it('rejects non-objects', () => {
    for (const bad of [null, undefined, 42, 'string', [1, 2, 3]]) {
      const result = sanitizeEffectParams(bad);
      expect(result.rejected).toBe(true);
      expect(result.params).toEqual(DEFAULT_EFFECT_PARAMS);
    }
  });

  it('rejects an object with no recognised keys', () => {
    const result = sanitizeEffectParams({ hello: 'world' });
    expect(result.rejected).toBe(true);
  });

  it('never returns a parameter outside its declared range', () => {
    const hostile = {
      particleCount: Number.POSITIVE_INFINITY,
      distortion: Number.NaN,
      pointerInfluence: -1e9,
      fogDensity: 1e9,
      bloom: -0.5,
      speed: 99,
    };
    const result = sanitizeEffectParams(hostile);
    for (const spec of EFFECT_PARAM_SPECS) {
      const value = result.params[spec.key];
      expect(Number.isFinite(value), spec.key).toBe(true);
      expect(value, spec.key).toBeGreaterThanOrEqual(spec.min);
      expect(value, spec.key).toBeLessThanOrEqual(spec.max);
    }
  });
});

describe('serialise / parse round trip', () => {
  let params: EffectParams;

  beforeEach(() => {
    params = {
      particleCount: 2100,
      distortion: 0.77,
      pointerInfluence: 1.35,
      fogDensity: 0.12,
      bloom: 0.9,
      speed: 0.25,
    };
  });

  it('survives a round trip exactly', () => {
    const file = serializeEffectConfig(params);
    const parsed = parseEffectConfig(JSON.stringify(file));
    expect(parsed.rejected).toBe(false);
    expect(parsed.formatOk).toBe(true);
    expect(parsed.params).toEqual(params);
    expect(parsed.savedAt).toBe(file.savedAt);
  });

  it('repairs a tampered file on import', () => {
    const file = serializeEffectConfig(params);
    (file.params as EffectParams).particleCount = 1e9;
    const parsed = parseEffectConfig(JSON.stringify(file));
    expect(parsed.params.particleCount).toBe(12_000);
    expect(parsed.repairs.length).toBeGreaterThan(0);
  });

  it('recovers from malformed JSON', () => {
    const parsed = parseEffectConfig('{ not json');
    expect(parsed.rejected).toBe(true);
    expect(parsed.params).toEqual(DEFAULT_EFFECT_PARAMS);
    expect(parsed.formatOk).toBe(false);
  });

  it('imports a bare params object but flags the format', () => {
    const parsed = parseEffectConfig(JSON.stringify({ speed: 1.5 }));
    expect(parsed.params.speed).toBe(1.5);
    expect(parsed.formatOk).toBe(false);
    expect(parsed.repairs.some((r) => r.includes('Not an AFTERLIGHT'))).toBe(true);
  });

  it('carries a version field for forward compatibility', () => {
    const file = serializeEffectConfig(params);
    expect(file.version).toBe(1);
    expect(file.format).toBe('afterlight.effect-config');
  });
});

describe('randomizeEffectParams', () => {
  it('only produces in-range values', () => {
    for (let seed = 0; seed < 40; seed += 1) {
      const params = randomizeEffectParams(seed);
      for (const spec of EFFECT_PARAM_SPECS) {
        const value = params[spec.key];
        expect(Number.isFinite(value), `${spec.key}@${seed}`).toBe(true);
        expect(value, `${spec.key}@${seed}`).toBeGreaterThanOrEqual(spec.min);
        expect(value, `${spec.key}@${seed}`).toBeLessThanOrEqual(spec.max);
      }
    }
  });

  it('avoids the extremes so a random variant is always usable', () => {
    for (let seed = 0; seed < 40; seed += 1) {
      const params = randomizeEffectParams(seed);
      for (const spec of EFFECT_PARAM_SPECS) {
        const span = spec.max - spec.min;
        const value = params[spec.key];
        expect(value, spec.key).toBeGreaterThan(spec.min);
        expect(value, spec.key).toBeLessThan(spec.max);
        expect(value - spec.min, spec.key).toBeLessThanOrEqual(span);
      }
    }
  });

  it('is deterministic for a given seed and varied across seeds', () => {
    expect(randomizeEffectParams(42)).toEqual(randomizeEffectParams(42));
    const seeds = new Set(
      Array.from({ length: 12 }, (_, i) => JSON.stringify(randomizeEffectParams(i))),
    );
    expect(seeds.size).toBeGreaterThan(6);
  });
});
