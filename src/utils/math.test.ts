import { describe, expect, it } from 'vitest';
import {
  clamp,
  damp,
  invLerp,
  lerp,
  remap,
  saturate,
  smoothstep,
  smootherstep,
  snapTo,
  travel,
  window01,
  wrap,
  PIN_WINDOW,
} from './math';

describe('clamp / saturate', () => {
  it('clamps to the range', () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  it('saturates without arguments', () => {
    expect(saturate(2)).toBe(1);
    expect(saturate(-2)).toBe(0);
  });

  it('handles an inverted range by returning the bounds, not NaN', () => {
    expect(clamp(0.5, 1, 0)).toBe(1);
  });
});

describe('interpolation', () => {
  it('lerps and inverse-lerps consistently', () => {
    expect(lerp(0, 10, 0.25)).toBe(2.5);
    expect(invLerp(0, 10, 2.5)).toBe(0.25);
  });

  it('guards inverse-lerp against a zero-width range', () => {
    expect(invLerp(5, 5, 5)).toBe(0);
    expect(Number.isNaN(invLerp(5, 5, 7))).toBe(false);
  });

  it('remaps between ranges', () => {
    expect(remap(0.5, 0, 1, 10, 20)).toBe(15);
  });
});

describe('easing', () => {
  it('smoothstep is pinned at both ends and monotonic in between', () => {
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
    expect(smoothstep(2)).toBe(1);
    const mid = smoothstep(0.5);
    expect(mid).toBeGreaterThan(smoothstep(0.25));
    expect(mid).toBeLessThan(smoothstep(0.75));
  });

  it('smootherstep has zero derivative at the ends', () => {
    expect(smootherstep(0.02)).toBeLessThan(0.01);
    expect(smootherstep(0.98)).toBeGreaterThan(0.99);
  });

  it('window01 rises, holds, then falls', () => {
    expect(window01(0)).toBe(0);
    expect(window01(0.5)).toBeGreaterThan(0.9);
    expect(window01(1)).toBe(0);
    // Never negative, never above 1.
    for (let i = 0; i <= 100; i += 1) {
      const v = window01(i / 100);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

describe('damp', () => {
  it('moves toward the target without overshooting', () => {
    let value = 0;
    for (let i = 0; i < 200; i += 1) value = damp(value, 1, 5, 1 / 60);
    expect(value).toBeGreaterThan(0.99);
    expect(value).toBeLessThanOrEqual(1);
  });

  it('is a no-op when already at the target', () => {
    expect(damp(0.5, 0.5, 5, 1 / 60)).toBe(0.5);
  });

  it('clamps absurd frame deltas so a stalled tab cannot teleport the camera', () => {
    const clamped = damp(0, 1, 5, 10);
    const sane = damp(0, 1, 5, 0.1);
    expect(clamped).toBeCloseTo(sane, 10);
  });
});

describe('wrap / snapTo', () => {
  it('wraps into a range', () => {
    expect(wrap(11, 0, 10)).toBeCloseTo(1);
    expect(wrap(-1, 0, 10)).toBeCloseTo(9);
    expect(wrap(5, 0, 10)).toBeCloseTo(5);
  });

  it('does not divide by zero on a degenerate range', () => {
    expect(wrap(5, 3, 3)).toBe(3);
  });

  it('snaps to a step and passes through a zero step', () => {
    expect(snapTo(137, 100)).toBe(100);
    expect(snapTo(149, 100)).toBe(100);
    expect(snapTo(151, 100)).toBe(200);
    expect(snapTo(1.234, 0)).toBe(1.234);
  });
});

describe('travel', () => {
  it('is zero before the pin window and one after it', () => {
    expect(travel(0)).toBe(0);
    expect(travel(PIN_WINDOW.start)).toBe(0);
    expect(travel(PIN_WINDOW.end)).toBe(1);
    expect(travel(1)).toBe(1);
  });

  it('is centred at the middle of the pin window', () => {
    const mid = (PIN_WINDOW.start + PIN_WINDOW.end) / 2;
    expect(travel(mid)).toBeCloseTo(0.5, 6);
  });

  it('is monotonic across the whole range', () => {
    let previous = -1;
    for (let i = 0; i <= 100; i += 1) {
      const value = travel(i / 100);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });
});
