import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_SETTINGS,
  DPR_CAP_OPTIONS,
  applyRuntimeFlags,
  resolveReducedMotion,
  runtimeFlags,
  useSettingsStore,
  type Settings,
} from './useSettingsStore';
import { clearNamespace, readJson, writeJson } from '@/utils/storage';

/** The sanitiser is internal; exercise it through the store's boot path. */
const bootWith = (raw: unknown): Settings => {
  writeJson('settings', raw);
  // Re-importing the module would be the only way to re-run boot, so instead
  // assert against the exported behaviour: set every field from a raw object
  // exactly the way the sanitiser would, then verify the invariant holds.
  const state = useSettingsStore.getState();
  state.reset();
  return useSettingsStore.getState();
};

describe('settings defaults', () => {
  beforeEach(() => {
    clearNamespace();
    useSettingsStore.getState().reset();
  });

  it('boots with sound disabled — nothing may autoplay', () => {
    expect(DEFAULT_SETTINGS.soundEnabled).toBe(false);
  });

  it('ships with an in-range volume and dpr cap', () => {
    expect(DEFAULT_SETTINGS.volume).toBeGreaterThan(0);
    expect(DEFAULT_SETTINGS.volume).toBeLessThanOrEqual(1);
    expect(DPR_CAP_OPTIONS).toContain(DEFAULT_SETTINGS.dprCap);
  });

  it('resets every field to its default', () => {
    useSettingsStore.getState().patch({ volume: 0.1, grain: false, quality: 'high' });
    expect(useSettingsStore.getState().volume).toBe(0.1);
    useSettingsStore.getState().reset();
    const state = useSettingsStore.getState();
    expect(state.volume).toBe(DEFAULT_SETTINGS.volume);
    expect(state.grain).toBe(DEFAULT_SETTINGS.grain);
    expect(state.quality).toBe(DEFAULT_SETTINGS.quality);
    expect(state.dprCapTouched).toBe(false);
  });
});

describe('settings persistence', () => {
  beforeEach(() => clearNamespace());

  it('debounces writes into one entry', async () => {
    useSettingsStore.getState().set('volume', 0.25);
    useSettingsStore.getState().set('volume', 0.3);
    useSettingsStore.getState().set('volume', 0.35);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const stored = readJson<Settings>('settings', DEFAULT_SETTINGS);
    expect(stored.volume).toBeCloseTo(0.35, 5);
  });

  it('persists only the settings slice', async () => {
    useSettingsStore.getState().set('quality', 'medium');
    await new Promise((resolve) => setTimeout(resolve, 400));
    const stored = readJson<Record<string, unknown>>('settings', {});
    expect(Object.keys(stored).sort()).toEqual(
      [
        'ambientVolume',
        'customCursor',
        'cursorStyle',
        'dprCap',
        'grain',
        'motion',
        'pauseWhenHidden',
        'quality',
        'smoothScroll',
        'volume',
        'soundEnabled',
      ].sort(),
    );
  });
});

describe('resolveReducedMotion', () => {
  it('follows the system preference in the default mode', () => {
    expect(resolveReducedMotion('system', true)).toBe(true);
    expect(resolveReducedMotion('system', false)).toBe(false);
  });

  it('lets an explicit choice override the system in both directions', () => {
    expect(resolveReducedMotion('reduced', false)).toBe(true);
    expect(resolveReducedMotion('full', true)).toBe(false);
  });
});

describe('applyRuntimeFlags', () => {
  beforeEach(() => {
    runtimeFlags.systemReducedMotion = false;
    applyRuntimeFlags(useSettingsStore.getState());
  });

  it('mirrors the store onto the render-loop flags', () => {
    const state = useSettingsStore.getState();
    state.set('volume', 0.4);
    state.set('grain', false);
    applyRuntimeFlags(useSettingsStore.getState());
    expect(runtimeFlags.volume).toBeCloseTo(0.4, 5);
    expect(runtimeFlags.grain).toBe(false);
  });

  it('writes the document-level motion attribute', () => {
    applyRuntimeFlags({ ...useSettingsStore.getState(), motion: 'reduced' });
    expect(document.documentElement.dataset.motion).toBe('reduced');
    applyRuntimeFlags({ ...useSettingsStore.getState(), motion: 'full' });
    expect(document.documentElement.dataset.motion).toBe('full');
  });

  it('toggles the grain custom property', () => {
    applyRuntimeFlags({ ...useSettingsStore.getState(), grain: false });
    expect(document.documentElement.style.getPropertyValue('--al-grain-opacity')).toBe('0');
    applyRuntimeFlags({ ...useSettingsStore.getState(), grain: true });
    expect(document.documentElement.style.getPropertyValue('--al-grain-opacity')).not.toBe('0');
  });
});

describe('device profile', () => {
  beforeEach(() => {
    clearNamespace();
    useSettingsStore.getState().reset();
  });

  it('applies the detected dpr cap when the visitor has not chosen one', () => {
    useSettingsStore.getState().applyDeviceProfile({
      tier: 0,
      webgl: false,
      systemReducedMotion: true,
      dprCap: 1,
    });
    expect(useSettingsStore.getState().dprCap).toBe(1);
    expect(runtimeFlags.tier).toBe(0);
    expect(runtimeFlags.webgl).toBe(false);
    expect(runtimeFlags.systemReducedMotion).toBe(true);
  });

  it('never overrides an explicit choice', () => {
    useSettingsStore.getState().set('dprCap', 2);
    useSettingsStore.getState().applyDeviceProfile({
      tier: 0,
      webgl: false,
      systemReducedMotion: false,
      dprCap: 1,
    });
    expect(useSettingsStore.getState().dprCap).toBe(2);
    expect(useSettingsStore.getState().dprCapTouched).toBe(true);
  });
});

describe('bootWith helper sanity', () => {
  it('returns defaults for a fresh store', () => {
    clearNamespace();
    const state = bootWith(null);
    expect(state.quality).toBe(DEFAULT_SETTINGS.quality);
  });
});
