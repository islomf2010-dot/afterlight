/**
 * Settings store — user preferences that survive reloads.
 *
 * Everything here is read by both the DOM layer and the render loop, so the
 * resolved values (not the raw preference) are mirrored onto the shared
 * `runtimeFlags` object that `useFrame` code reads without subscribing.
 */

import { create } from 'zustand';
import { loadPersisted, persistDebounced } from './persistedState';
import { clamp, isFiniteNumber } from '@/utils/math';

export type QualityPreset = 'auto' | 'low' | 'medium' | 'high';
export type MotionPreference = 'system' | 'full' | 'reduced';
export type CursorStyle = 'crosshair' | 'dot' | 'ring';

export interface Settings {
  /** Rendering budget preset. 'auto' derives a tier from device capabilities. */
  quality: QualityPreset;
  /** Hard ceiling applied to `gl.setPixelRatio`, independent of the preset. */
  dprCap: number;
  /** Whether prefers-reduced-motion should be honoured. */
  motion: MotionPreference;
  /** Master audio switch. Audio never starts before a user gesture. */
  soundEnabled: boolean;
  /** Master volume, 0–1. */
  volume: number;
  /** Ambient bed vs. interaction one-shots, split so each can be tuned. */
  ambientVolume: number;
  /** Custom cursor (pointer:fine only). */
  customCursor: boolean;
  cursorStyle: CursorStyle;
  /** Film grain overlay + in-shader grain. */
  grain: boolean;
  /** Scroll smoothing via Lenis. Off means untouched native scrolling. */
  smoothScroll: boolean;
  /** Reduce render rate when the tab is hidden / unfocused. */
  pauseWhenHidden: boolean;
}

export const DEFAULT_SETTINGS: Readonly<Settings> = Object.freeze({
  quality: 'auto',
  dprCap: 1.75,
  motion: 'system',
  soundEnabled: false,
  volume: 0.6,
  ambientVolume: 0.7,
  customCursor: true,
  cursorStyle: 'crosshair',
  grain: true,
  smoothScroll: true,
  pauseWhenHidden: true,
});

export const DPR_CAP_OPTIONS = [1, 1.25, 1.5, 1.75, 2, 3] as const;

const sanitizeSettings = (raw: unknown): Settings => {
  const out: Settings = { ...DEFAULT_SETTINGS };
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return out;
  const src = raw as Record<string, unknown>;
  // Settings has no index signature, so writes go through a widened view.
  const sink = out as unknown as Record<string, unknown>;

  const pickEnum = <T extends string>(key: keyof Settings, allowed: readonly T[]): void => {
    const value = src[key];
    if (typeof value === 'string' && (allowed as readonly string[]).includes(value)) {
      sink[key] = value as T;
    }
  };

  const pickNumber = (key: keyof Settings, min: number, max: number): void => {
    const value = src[key];
    if (isFiniteNumber(value)) sink[key] = clamp(value, min, max);
  };

  const pickBool = (key: keyof Settings): void => {
    const value = src[key];
    if (typeof value === 'boolean') sink[key] = value;
  };

  pickEnum('quality', ['auto', 'low', 'medium', 'high'] as const);
  pickEnum('motion', ['system', 'full', 'reduced'] as const);
  pickEnum('cursorStyle', ['crosshair', 'dot', 'ring'] as const);
  pickNumber('dprCap', 0.75, 3);
  pickNumber('volume', 0, 1);
  pickNumber('ambientVolume', 0, 1);
  ['soundEnabled', 'customCursor', 'grain', 'smoothScroll', 'pauseWhenHidden'].forEach(
    (k) => pickBool(k as keyof Settings),
  );

  // A DPR cap that is not a sane value for the tier list is coerced to the
  // nearest allowed step rather than trusted verbatim.
  if (!DPR_CAP_OPTIONS.includes(out.dprCap as (typeof DPR_CAP_OPTIONS)[number])) {
    out.dprCap =
      DPR_CAP_OPTIONS.reduce((best, option) =>
        Math.abs(option - out.dprCap) < Math.abs(best - out.dprCap) ? option : best,
      ) ?? DEFAULT_SETTINGS.dprCap;
  }

  return out;
};

const persisted = loadPersisted<Settings>('settings', sanitizeSettings, { ...DEFAULT_SETTINGS });

/**
 * Non-reactive mirror for the render loop. Mutated by `applyRuntimeFlags`;
 * `useFrame` code reads this instead of subscribing to React.
 */
export const runtimeFlags = {
  reducedMotion: false,
  systemReducedMotion: false,
  dprCap: persisted.dprCap,
  quality: persisted.quality,
  grain: persisted.grain,
  soundEnabled: persisted.soundEnabled,
  volume: persisted.volume,
  ambientVolume: persisted.ambientVolume,
  pauseWhenHidden: persisted.pauseWhenHidden,
  /** Resolved device tier: 0 = low, 1 = medium, 2 = high. */
  tier: 1,
  webgl: true,
  fps: 60,
  /** Global film exposure, 0→1, driven by ExposureDriver after ENTER. */
  exposure: 0,
  /** Lifetime frames rendered by the active canvas — proves the loop is alive. */
  frames: 0,
};

export interface DeviceProfile {
  /** Resolved performance tier: 0 = low, 1 = medium, 2 = high. */
  tier: 0 | 1 | 2;
  /** Whether a WebGL context could be created at all. */
  webgl: boolean;
  /** The OS-level reduced-motion signal. */
  systemReducedMotion: boolean;
  /** Device-appropriate starting DPR cap (never overrides an explicit choice). */
  dprCap?: number;
}

export interface SettingsState extends Settings {
  hydrated: boolean;
  /** True once the visitor has set the DPR cap by hand; blocks auto-profiles. */
  dprCapTouched: boolean;
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  patch: (values: Partial<Settings>) => void;
  reset: () => void;
  /** Called once after device capability probing completes. */
  applyDeviceProfile: (profile: DeviceProfile) => void;
}

const persistSlice = (state: SettingsState): Settings => {
  const slice: Settings = {
    quality: state.quality,
    dprCap: state.dprCap,
    motion: state.motion,
    soundEnabled: state.soundEnabled,
    volume: state.volume,
    ambientVolume: state.ambientVolume,
    customCursor: state.customCursor,
    cursorStyle: state.cursorStyle,
    grain: state.grain,
    smoothScroll: state.smoothScroll,
    pauseWhenHidden: state.pauseWhenHidden,
  };
  persistDebounced('settings', slice);
  return slice;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...persisted,
  hydrated: true,
  dprCapTouched: false,
  set: (key, value) =>
    set((state) => {
      const next = { ...state, [key]: value } as SettingsState;
      if (key === 'dprCap') next.dprCapTouched = true;
      persistSlice(next);
      return next;
    }),
  patch: (values) =>
    set((state) => {
      const next = { ...state, ...values } as SettingsState;
      if ('dprCap' in values) next.dprCapTouched = true;
      persistSlice(next);
      return next;
    }),
  reset: () =>
    set((state) => {
      const next = { ...state, ...DEFAULT_SETTINGS, dprCapTouched: false } as SettingsState;
      persistSlice(next);
      return next;
    }),
  applyDeviceProfile: (profile) => {
    runtimeFlags.tier = profile.tier;
    runtimeFlags.webgl = profile.webgl;
    runtimeFlags.systemReducedMotion = profile.systemReducedMotion;
    set((state) => {
      // An explicit user choice always wins over the auto-detected tier.
      const next = { ...state } as SettingsState;
      if (!state.dprCapTouched && typeof profile.dprCap === 'number') {
        next.dprCap = profile.dprCap;
        runtimeFlags.dprCap = profile.dprCap;
      }
      return next;
    });
  },
}));

/** Resolves the user's motion preference against the OS setting. */
export const resolveReducedMotion = (
  preference: MotionPreference,
  systemReduced: boolean,
): boolean => (preference === 'reduced' ? true : preference === 'full' ? false : systemReduced);

/** Keeps `runtimeFlags` and the CSS custom properties in sync with the store. */
export const applyRuntimeFlags = (state: Settings): void => {
  const reduced = resolveReducedMotion(state.motion, runtimeFlags.systemReducedMotion);
  runtimeFlags.reducedMotion = reduced;
  runtimeFlags.dprCap = state.dprCap;
  runtimeFlags.quality = state.quality;
  runtimeFlags.grain = state.grain;
  runtimeFlags.soundEnabled = state.soundEnabled;
  runtimeFlags.volume = state.volume;
  runtimeFlags.ambientVolume = state.ambientVolume;
  runtimeFlags.pauseWhenHidden = state.pauseWhenHidden;

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.dataset.motion = reduced ? 'reduced' : 'full';
    root.dataset.grain = state.grain ? 'on' : 'off';
    root.style.setProperty('--al-grain-opacity', state.grain ? '0.055' : '0');
  }
};