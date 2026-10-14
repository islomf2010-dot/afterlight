import { describe, expect, it } from 'vitest';
import {
  gauss,
  hashString,
  intRange,
  mulberry32,
  powerRange,
  randomUnitVector,
  range,
  rngFromString,
} from './prng';

describe('mulberry32', () => {
  it('is deterministic for a given seed', () => {
    const a = mulberry32(1234);
    const b = mulberry32(1234);
    const first = Array.from({ length: 32 }, a);
    const second = Array.from({ length: 32 }, b);
    expect(first).toEqual(second);
  });

  it('produces different streams for different seeds', () => {
    const a = Array.from({ length: 16 }, mulberry32(1));
    const b = Array.from({ length: 16 }, mulberry32(2));
    expect(a).not.toEqual(b);
  });

  it('stays inside [0, 1)', () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 2000; i += 1) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('hashString', () => {
  it('is stable and non-negative', () => {
    expect(hashString('afterlight')).toBe(hashString('afterlight'));
    expect(hashString('afterlight')).toBeGreaterThanOrEqual(0);
  });

  it('separates similar strings', () => {
    expect(hashString('void')).not.toBe(hashString('fracture'));
  });

  it('handles the empty string', () => {
    expect(hashString('')).toBeGreaterThanOrEqual(0);
  });
});

describe('helpers', () => {
  it('range respects min/max and excludes max', () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 500; i += 1) {
      const value = range(rng, -2, 5);
      expect(value).toBeGreaterThanOrEqual(-2);
      expect(value).toBeLessThan(5);
    }
  });

  it('intRange stays integral and inclusive', () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 500; i += 1) {
      const value = intRange(rng, 3, 6);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(3);
      expect(value).toBeLessThanOrEqual(6);
    }
  });

  it('powerRange skews toward the low end', () => {
    const rng = mulberry32(3);
    const values = Array.from({ length: 4000 }, () => powerRange(rng, 0, 1, 3));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    expect(mean).toBeLessThan(0.5);
  });

  it('gauss is centred on zero', () => {
    const rng = mulberry32(5);
    const values = Array.from({ length: 4000 }, () => gauss(rng));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    expect(Math.abs(mean)).toBeLessThan(0.08);
    values.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(1);
    });
  });

  it('randomUnitVector produces unit-length vectors', () => {
    const rng = mulberry32(21);
    const out = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 300; i += 1) {
      randomUnitVector(rng, out);
      const length = Math.hypot(out.x, out.y, out.z);
      expect(length).toBeCloseTo(1, 5);
    }
  });

  it('rngFromString is reproducible', () => {
    expect(rngFromString('void')()).toBe(rngFromString('void')());
  });
});
