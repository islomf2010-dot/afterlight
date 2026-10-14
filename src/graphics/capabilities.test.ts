import { describe, expect, it } from 'vitest';
import { probeCapabilities, resolveBudget } from './capabilities';
import { advanceClock, clockField, pointerField, progressRegistry, resetPointerField } from '@/animation/progressRegistry';

describe('resolveBudget', () => {
  it('maps each auto tier to a distinct, ordered budget', () => {
    const low = resolveBudget('auto', 0);
    const medium = resolveBudget('auto', 1);
    const high = resolveBudget('auto', 2);

    expect(low.density).toBeLessThan(medium.density);
    expect(medium.density).toBeLessThan(high.density);
    expect(low.post).toBe(false);
    expect(medium.post).toBe(true);
    expect(high.highPost).toBe(true);
    expect(low.dpr).toBeLessThanOrEqual(high.dpr);
    expect(low.shadowMap).toBe(0);
  });

  it('honours an explicit preset over the detected tier', () => {
    expect(resolveBudget('high', 0).highPost).toBe(true);
    expect(resolveBudget('low', 2).post).toBe(false);
    expect(resolveBudget('medium', 2).highPost).toBe(false);
  });

  it('never returns a device pixel ratio above 3', () => {
    for (const preset of ['auto', 'low', 'medium', 'high'] as const) {
      for (const tier of [0, 1, 2] as const) {
        expect(resolveBudget(preset, tier).dpr).toBeLessThanOrEqual(3);
        expect(resolveBudget(preset, tier).dpr).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('scales every scene-owned count, not just one', () => {
    const high = resolveBudget('high', 2);
    const low = resolveBudget('low', 0);
    expect(low.rings).toBeLessThan(high.rings);
    expect(low.dust).toBeLessThan(high.dust);
    expect(low.density).toBeLessThan(high.density);
  });

  it('returns a fresh object so callers cannot mutate the shared table', () => {
    const a = resolveBudget('auto', 1);
    a.density = 99;
    expect(resolveBudget('auto', 1).density).not.toBe(99);
  });
});

describe('probeCapabilities', () => {
  it('never throws, whatever the environment', () => {
    const caps = probeCapabilities();
    expect([0, 1, 2]).toContain(caps.tier);
    expect(typeof caps.webgl).toBe('boolean');
    expect(caps.cores).toBeGreaterThan(0);
    expect(caps.viewport.width).toBeGreaterThan(0);
  });

  it('reports a coherent dpr cap for the tier it chose', () => {
    const caps = probeCapabilities();
    expect(caps.dprCap).toBeGreaterThanOrEqual(1);
    expect(caps.dprCap).toBeLessThanOrEqual(2);
    if (caps.tier === 0) expect(caps.dprCap).toBe(1);
  });
});

describe('progress registry', () => {
  it('stores and clamps per-scene progress', () => {
    progressRegistry.reset();
    progressRegistry.write('void', 0.42);
    expect(progressRegistry.value('void')).toBeCloseTo(0.42, 6);
    progressRegistry.write('void', 5);
    expect(progressRegistry.value('void')).toBe(1);
    progressRegistry.write('void', -5);
    expect(progressRegistry.value('void')).toBe(0);
  });

  it('returns zero for an unknown scene rather than undefined', () => {
    progressRegistry.reset();
    expect(progressRegistry.value('never-heard-of-it')).toBe(0);
    expect(progressRegistry.velocity('never-heard-of-it')).toBe(0);
    expect(progressRegistry.isActive('never-heard-of-it')).toBe(false);
  });

  it('only bumps the revision when the value actually changes', () => {
    progressRegistry.reset();
    progressRegistry.write('void', 0.5);
    const first = progressRegistry.record('void').revision;
    progressRegistry.write('void', 0.5);
    expect(progressRegistry.record('void').revision).toBe(first);
    progressRegistry.write('void', 0.51);
    expect(progressRegistry.record('void').revision).toBe(first + 1);
  });

  it('tracks velocity independently of progress', () => {
    progressRegistry.reset();
    progressRegistry.write('void', 0.5, 2.5);
    expect(progressRegistry.velocity('void')).toBe(2.5);
  });

  it('tracks the active flag', () => {
    progressRegistry.reset();
    progressRegistry.setActive('void', true);
    expect(progressRegistry.isActive('void')).toBe(true);
    progressRegistry.setActive('void', false);
    expect(progressRegistry.isActive('void')).toBe(false);
  });

  it('resets one scene or all of them', () => {
    progressRegistry.reset();
    progressRegistry.write('void', 0.9);
    progressRegistry.write('fracture', 0.3);
    progressRegistry.reset('void');
    expect(progressRegistry.value('void')).toBe(0);
    expect(progressRegistry.value('fracture')).toBe(0.3);
    progressRegistry.reset();
    expect(progressRegistry.value('fracture')).toBe(0);
  });
});

describe('shared clock', () => {
  it('advances elapsed time only while running', () => {
    clockField.elapsed = 0;
    clockField.absolute = 0;
    clockField.running = 1;
    clockField.speed = 1;
    advanceClock(0.5);
    expect(clockField.elapsed).toBeCloseTo(0.5, 6);

    clockField.running = 0;
    advanceClock(0.5);
    expect(clockField.elapsed).toBeCloseTo(0.5, 6);
    expect(clockField.absolute).toBeCloseTo(1, 6);
  });

  it('applies the speed multiplier', () => {
    clockField.elapsed = 0;
    clockField.absolute = 0;
    clockField.running = 1;
    clockField.speed = 2;
    advanceClock(0.25);
    expect(clockField.elapsed).toBeCloseTo(0.5, 6);
    clockField.speed = 1;
  });

  it('returns the scaled delta so callers do not recompute it', () => {
    clockField.running = 1;
    clockField.speed = 0.5;
    expect(advanceClock(1)).toBeCloseTo(0.5, 6);
    clockField.speed = 1;
  });
});

describe('pointer field', () => {
  it('resets to a neutral state', () => {
    pointerField.x = 1;
    pointerField.targetY = -1;
    pointerField.present = true;
    resetPointerField();
    expect(pointerField.x).toBe(0);
    expect(pointerField.targetY).toBe(0);
    expect(pointerField.present).toBe(false);
    expect(pointerField.activity).toBe(0);
  });
});
