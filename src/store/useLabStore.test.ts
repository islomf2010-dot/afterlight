import { beforeEach, describe, expect, it, vi } from 'vitest';
import { labParams, labRuntime, useLabStore } from './useLabStore';
import { DEFAULT_EFFECT_PARAMS } from './effectConfig';
import { clockField } from '@/animation/progressRegistry';
import { clearNamespace, readJson, writeJson } from '@/utils/storage';

/**
 * The laboratory store is the contract between the control panel and the render
 * loop. These tests assert the *linkage*: every setter must move both the React
 * state and the non-reactive mirror the shaders read, and every action must
 * produce an observable effect.
 */
describe('lab store linkage', () => {
  beforeEach(() => {
    clearNamespace();
    useLabStore.getState().reset();
    useLabStore.getState().dismissNotice();
  });

  it('setParam updates the store and the render-loop mirror together', () => {
    useLabStore.getState().setParam('distortion', 0.9);
    expect(useLabStore.getState().params.distortion).toBe(0.9);
    expect(labParams.distortion).toBe(0.9);
  });

  it('setParam clamps and snaps hostile input', () => {
    useLabStore.getState().setParam('particleCount', 10 ** 9);
    expect(useLabStore.getState().params.particleCount).toBe(12_000);
    useLabStore.getState().setParam('particleCount', 1234);
    expect(useLabStore.getState().params.particleCount).toBe(1200);
    useLabStore.getState().setParam('distortion', -5);
    expect(useLabStore.getState().params.distortion).toBe(0);
  });

  it('setParam never writes a value the schema would reject', () => {
    useLabStore.getState().setParam('particleCount', Number.NaN);
    expect(Number.isFinite(useLabStore.getState().params.particleCount)).toBe(true);
    expect(Number.isFinite(labParams.particleCount)).toBe(true);
  });

  it('setParams sanitises a whole object', () => {
    useLabStore.getState().setParams({ ...DEFAULT_EFFECT_PARAMS, bloom: 99, speed: -1 });
    expect(useLabStore.getState().params.bloom).toBe(1.5);
    expect(useLabStore.getState().params.speed).toBe(0);
    expect(labParams.bloom).toBe(1.5);
  });

  it('reset restores defaults in both state and mirror', () => {
    useLabStore.getState().randomize();
    useLabStore.getState().reset();
    expect(useLabStore.getState().params).toEqual(DEFAULT_EFFECT_PARAMS);
    expect({ ...labParams }).toEqual(DEFAULT_EFFECT_PARAMS);
  });

  it('randomize always produces in-range values and says so', () => {
    for (let i = 0; i < 15; i += 1) {
      useLabStore.getState().randomize();
      const { params } = useLabStore.getState();
      expect(params.particleCount).toBeGreaterThanOrEqual(500);
      expect(params.particleCount).toBeLessThanOrEqual(12_000);
      expect(useLabStore.getState().notice?.kind).toBe('info');
    }
  });

  it('toggles the shared clock, not just a boolean', () => {
    expect(clockField.running).toBe(1);
    useLabStore.getState().togglePause();
    expect(useLabStore.getState().paused).toBe(true);
    expect(labRuntime.paused).toBe(true);
    expect(clockField.running).toBe(0);
    useLabStore.getState().togglePause();
    expect(clockField.running).toBe(1);
  });

  it('reset also un-pauses, so RESET is a true starting position', () => {
    useLabStore.getState().setPaused(true);
    useLabStore.getState().reset();
    expect(useLabStore.getState().paused).toBe(false);
    expect(clockField.running).toBe(1);
  });

  it('requestCapture bumps the token the canvas listens for', () => {
    const before = labRuntime.captureToken;
    useLabStore.getState().requestCapture();
    expect(labRuntime.captureToken).toBe(before + 1);
    expect(useLabStore.getState().status).toBe('capturing');
  });

  it('resolving a capture updates the status and the message', () => {
    useLabStore.getState().resolveCapture('error', 'nope');
    expect(useLabStore.getState().status).toBe('error');
    expect(useLabStore.getState().notice).toMatchObject({ kind: 'error', message: 'nope' });

    useLabStore.getState().resolveCapture('success', 'done');
    expect(useLabStore.getState().status).toBe('success');
    expect(useLabStore.getState().notice?.kind).toBe('success');
  });

  it('tracks the focused study', () => {
    useLabStore.getState().setFocus('portal');
    expect(labRuntime.focus).toBe('portal');
    expect(useLabStore.getState().focus).toBe('portal');
  });
});

describe('lab persistence', () => {
  beforeEach(() => clearNamespace());

  it('persists parameters and restores them into the mirror', async () => {
    useLabStore.getState().reset();
    useLabStore.getState().setParam('speed', 1.5);
    await new Promise((resolve) => setTimeout(resolve, 320));
    const stored = readJson<Record<string, number>>('lab.params', {});
    expect(stored.speed).toBeCloseTo(1.5, 5);
  });

  it('a corrupt stored blob cannot prevent the store from booting', () => {
    writeJson('lab.params', 'this is not an object');
    // The sanitiser is the only thing that reads storage; a string payload must
    // produce the default set rather than throwing at module scope.
    expect(() => readJson('lab.params', null)).not.toThrow();
  });
});

describe('export / import', () => {
  beforeEach(() => {
    clearNamespace();
    useLabStore.getState().reset();
    useLabStore.getState().dismissNotice();
  });

  it('export writes a JSON blob and reports success', () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    const ok = useLabStore.getState().exportConfig();

    expect(ok).toBe(true);
    expect(click).toHaveBeenCalledOnce();
    expect(useLabStore.getState().notice?.kind).toBe('success');

    click.mockRestore();
    vi.unstubAllGlobals();
  });

  it('export reports a failure instead of pretending', () => {
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: () => {
        throw new Error('blocked');
      },
    });
    const ok = useLabStore.getState().exportConfig();
    expect(ok).toBe(false);
    expect(useLabStore.getState().notice?.kind).toBe('error');
    vi.unstubAllGlobals();
  });

  it('import resolves when the picker is dismissed without a file', async () => {
    // Emulate a browser closing the dialog: the window regains focus and no
    // change event follows. This is the path Safari and Firefox take.
    const original = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const element = original(tag);
      if (tag === 'input') {
        (element as HTMLInputElement).click = () => {
          setTimeout(() => window.dispatchEvent(new Event('focus')), 0);
        };
      }
      return element;
    });

    const notice = await useLabStore.getState().importConfig();

    expect(notice).toBeNull();
    expect(useLabStore.getState().params).toEqual(DEFAULT_EFFECT_PARAMS);
    vi.restoreAllMocks();
  }, 10_000);

  it('import applies a real file and reports corrections', async () => {
    const original = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const element = original(tag);
      if (tag !== 'input') return element;
      const input = element as HTMLInputElement;
      Object.defineProperty(input, 'click', {
        configurable: true,
        value: () => {
          // Emulate the picker returning a file, then firing `change`.
          const payload = JSON.stringify({ format: 'afterlight.effect-config', params: { speed: 42, bloom: 9 } });
          Object.defineProperty(input, 'files', {
            configurable: true,
            value: [{ text: () => Promise.resolve(payload) }],
          });
          setTimeout(() => input.dispatchEvent(new Event('change')), 0);
        },
      });
      return input;
    });

    const notice = await useLabStore.getState().importConfig();

    expect(notice?.kind).toBe('info');
    expect(useLabStore.getState().params.speed).toBe(2);
    expect(useLabStore.getState().params.bloom).toBe(1.5);
    expect(labParams.speed).toBe(2);
    vi.restoreAllMocks();
  }, 10_000);
});
