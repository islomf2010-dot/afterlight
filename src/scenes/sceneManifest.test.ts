import { describe, expect, it } from 'vitest';
import { SCENES, SCENE_IDS, adjacentScenes, sceneById, sceneIndex } from './sceneManifest';
import {
  MAX_FRACTURE_DELAY,
  createFractureLayout,
  createParticleField,
} from '@/graphics/particles/particleField';
import { travel } from '@/utils/math';

describe('scene manifest', () => {
  it('declares the six narrative scenes in order', () => {
    expect(SCENES).toHaveLength(6);
    expect(SCENE_IDS).toEqual([
      'awakening',
      'void',
      'fracture',
      'threshold',
      'echoes',
      'afterlight',
    ]);
    SCENES.forEach((scene, index) => {
      expect(scene.index).toBe(index);
      expect(scene.numeral).toBeTruthy();
      expect(scene.log.length).toBeGreaterThan(40);
      expect(scene.telemetry.length).toBeGreaterThan(5);
    });
  });

  it('marks exactly one gated scene — the Awakening', () => {
    expect(SCENES.filter((scene) => scene.gated).map((scene) => scene.id)).toEqual(['awakening']);
  });

  it('only points lab routes at real laboratory routes', () => {
    const valid = new Set(['/lab', '/lab/particles', '/lab/shaders', '/lab/portal']);
    for (const scene of SCENES) {
      if (scene.labRoute) expect(valid.has(scene.labRoute), scene.id).toBe(true);
    }
  });

  it('looks scenes up and fails loudly on an unknown id', () => {
    expect(sceneById('void').title).toBe('The Void');
    expect(sceneIndex('afterlight')).toBe(5);
    expect(() => sceneById('nope' as never)).toThrow();
  });

  it('computes neighbours without running off either end', () => {
    expect(adjacentScenes('awakening')).toEqual(['void']);
    expect(adjacentScenes('void')).toEqual(['awakening', 'fracture']);
    expect(adjacentScenes('afterlight')).toEqual(['echoes']);
    expect(adjacentScenes('nope' as never)).toEqual([]);
  });
});

describe('particle field generation', () => {
  it('is deterministic for the same seed', () => {
    const a = createParticleField({ count: 64, extent: [5, 5, 5], seed: 99, distribution: 'volume' });
    const b = createParticleField({ count: 64, extent: [5, 5, 5], seed: 99, distribution: 'volume' });
    expect(Array.from(a.positions)).toEqual(Array.from(b.positions));
    expect(Array.from(a.phases)).toEqual(Array.from(b.phases));
  });

  it('produces different layouts for different seeds', () => {
    const a = createParticleField({ count: 64, extent: [5, 5, 5], seed: 1, distribution: 'volume' });
    const b = createParticleField({ count: 64, extent: [5, 5, 5], seed: 2, distribution: 'volume' });
    expect(Array.from(a.positions)).not.toEqual(Array.from(b.positions));
  });

  it('allocates exactly the requested buffers', () => {
    const count = 123;
    const field = createParticleField({ count, extent: [1, 2, 3], seed: 7, distribution: 'shell' });
    expect(field.count).toBe(count);
    expect(field.positions).toHaveLength(count * 3);
    expect(field.scales).toHaveLength(count);
    expect(field.phases).toHaveLength(count);
  });

  it('keeps every particle inside its extent', () => {
    const field = createParticleField({ count: 500, extent: [4, 6, 8], seed: 31, distribution: 'plate' });
    for (let i = 0; i < field.count; i += 1) {
      expect(Math.abs(field.positions[i * 3])).toBeLessThanOrEqual(4.0001);
      expect(Math.abs(field.positions[i * 3 + 1])).toBeLessThanOrEqual(6.0001);
      expect(Math.abs(field.positions[i * 3 + 2])).toBeLessThanOrEqual(8.0001);
    }
  });

  it('keeps scales and phases in range', () => {
    const field = createParticleField({
      count: 300,
      extent: [1, 1, 1],
      seed: 5,
      distribution: 'halo',
      sizeRange: [0.5, 2],
    });
    for (let i = 0; i < field.count; i += 1) {
      expect(field.scales[i]).toBeGreaterThanOrEqual(0.5);
      expect(field.scales[i]).toBeLessThanOrEqual(2);
      expect(field.phases[i]).toBeGreaterThanOrEqual(0);
      expect(field.phases[i]).toBeLessThan(1);
    }
  });

  it('handles a count of zero without throwing', () => {
    const field = createParticleField({ count: 0, extent: [1, 1, 1], seed: 1, distribution: 'volume' });
    expect(field.positions).toHaveLength(0);
  });

  it('covers every distribution without producing NaN', () => {
    for (const distribution of ['volume', 'shell', 'column', 'plate', 'halo'] as const) {
      const field = createParticleField({
        count: 200,
        extent: [3, 3, 3],
        seed: 17,
        distribution,
      });
      for (const value of field.positions) expect(Number.isFinite(value)).toBe(true);
    }
  });
});

describe('fracture layout', () => {
  const layout = createFractureLayout({
    count: 600,
    seed: 0xabc,
    size: [2, 5, 2],
    scatterRadius: 20,
  });

  it('is deterministic', () => {
    const again = createFractureLayout({ count: 600, seed: 0xabc, size: [2, 5, 2], scatterRadius: 20 });
    expect(Array.from(layout.rest)).toEqual(Array.from(again.rest));
    expect(Array.from(layout.delays)).toEqual(Array.from(again.delays));
  });

  it('allocates the right buffers', () => {
    expect(layout.rest).toHaveLength(600 * 3);
    expect(layout.scatter).toHaveLength(600 * 3);
    expect(layout.spin).toHaveLength(600 * 3);
    expect(layout.scales).toHaveLength(600 * 3);
    expect(layout.delays).toHaveLength(600);
    expect(layout.phases).toHaveLength(600);
  });

  it('keeps delays inside 0..1', () => {
    for (const delay of layout.delays) {
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThanOrEqual(1);
    }
  });

  it('scatters every fragment away from its rest position', () => {
    let moved = 0;
    for (let i = 0; i < layout.count; i += 1) {
      const i3 = i * 3;
      const dx = layout.scatter[i3] - layout.rest[i3];
      const dy = layout.scatter[i3 + 1] - layout.rest[i3 + 1];
      const dz = layout.scatter[i3 + 2] - layout.rest[i3 + 2];
      if (Math.hypot(dx, dy, dz) > 0.01) moved += 1;
    }
    expect(moved).toBe(layout.count);
  });

  it('keeps fragments inside the authored structure bounds', () => {
    for (let i = 0; i < layout.count; i += 1) {
      expect(Math.abs(layout.rest[i * 3])).toBeLessThanOrEqual(2.001);
      expect(Math.abs(layout.rest[i * 3 + 1])).toBeLessThanOrEqual(5.001);
      expect(Math.abs(layout.rest[i * 3 + 2])).toBeLessThanOrEqual(2.001);
    }
  });

  it('produces positive fragment scales', () => {
    for (const scale of layout.scales) expect(scale).toBeGreaterThan(0);
  });

  it('the failure travels upward: high fragments start later than low ones', () => {
    // Bucket by actual rest height — the array is not ordered by position.
    const pairs = Array.from({ length: layout.count }, (_, i) => ({
      y: layout.rest[i * 3 + 1],
      delay: layout.delays[i],
    })).sort((a, b) => a.y - b.y);

    const third = Math.floor(pairs.length / 3);
    const bottom = pairs.slice(0, third);
    const top = pairs.slice(-third);
    const mean = (list: typeof pairs): number =>
      list.reduce((sum, item) => sum + item.delay, 0) / list.length;

    expect(mean(top)).toBeGreaterThan(mean(bottom));
  });

  it('caps every delay so each fragment keeps a travel window', () => {
    for (const delay of layout.delays) {
      expect(delay).toBeLessThanOrEqual(MAX_FRACTURE_DELAY);
    }
  });
});

describe('disintegration schedule', () => {
  const layout = createFractureLayout({ count: 400, seed: 8, size: [2, 5, 2], scatterRadius: 20 });

  // Mirrors the schedule implemented in FractureScene's frame loop.
  const localProgress = (delay: number, p: number): number => {
    const raw = (p - delay) / Math.max(1e-3, 1 - delay);
    return raw < 0 ? 0 : raw > 1 ? 1 : raw;
  };

  it('starts every fragment at or before the end of the sequence', () => {
    for (const delay of layout.delays) {
      expect(localProgress(delay, 1)).toBe(1);
    }
  });

  it('leaves early fragments untouched at the very beginning', () => {
    expect(localProgress(0, 0)).toBe(0);
  });

  it('is monotonic for every fragment', () => {
    for (const delay of [0, 0.3, 0.7, MAX_FRACTURE_DELAY]) {
      let previous = -1;
      for (let i = 0; i <= 50; i += 1) {
        const value = localProgress(delay, i / 50);
        expect(value).toBeGreaterThanOrEqual(previous);
        previous = value;
      }
    }
  });

  it('stays finite even for a degenerate delay of 1', () => {
    // The generator caps delays at MAX_FRACTURE_DELAY, but the scene must not
    // divide by zero if that ever changes.
    for (let p = 0; p <= 1; p += 0.1) {
      expect(Number.isFinite(localProgress(1, p))).toBe(true);
    }
  });

  it('travel() is the inverse schedule used by the scenes', () => {
    expect(travel(0)).toBe(0);
    expect(travel(0.5)).toBeCloseTo(0.5, 5);
    expect(travel(1)).toBe(1);
  });
});
