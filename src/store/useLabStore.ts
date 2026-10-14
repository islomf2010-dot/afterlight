/**
 * Interactive laboratory store.
 *
 * `params` is the single source of truth consumed by every exhibit, by the
 * journey's Echoes scene and by the JSON import/export. React components read
 * it with selectors; render-loop code reads `labParams` (the non-reactive
 * mirror below) so a slider drag never triggers a re-render inside the canvas.
 */

import { create } from 'zustand';
import { loadPersisted, persistDebounced, persistNow } from './persistedState';
import {
  DEFAULT_EFFECT_PARAMS,
  clampParamValue,
  defaultEffectParams,
  parseEffectConfig,
  randomizeEffectParams,
  sanitizeEffectParams,
  serializeEffectConfig,
  type EffectParamKey,
  type EffectParams,
} from './effectConfig';
import { clockField } from '@/animation/progressRegistry';
import { downloadJson, pickTextFile } from '@/utils/download';
import { formatDateStamp } from '@/utils/format';

export type CaptureStatus = 'idle' | 'capturing' | 'success' | 'error';
export type ExhibitId = 'particles' | 'shaders' | 'portal';

export interface LabNotice {
  kind: 'info' | 'success' | 'error';
  message: string;
  /** Optional detail list (e.g. per-field import repairs). */
  details?: string[];
  at: number;
}

/** Non-reactive mirror for `useFrame`. */
export const labParams: EffectParams = defaultEffectParams();
export const labRuntime = {
  paused: false,
  /** Incremented by CAPTURE; the in-canvas listener renders and grabs. */
  captureToken: 0,
  /** Which exhibit is being driven by the pointer right now. */
  focus: 'particles' as ExhibitId,
  /** Set by the in-canvas capture bridge; null means the last capture worked. */
  captureError: null as string | null,
  /**
   * Incremented once per completed capture attempt.
   *
   * The DOM side watches this rather than `captureError`, because the error is
   * `null` on every *successful* capture: comparing the string alone would fire
   * once at startup and then never again.
   */
  captureSeq: 0,
};

const persistedParams = loadPersisted<EffectParams>(
  'lab.params',
  (raw) => sanitizeEffectParams(raw).params,
  defaultEffectParams(),
);

Object.assign(labParams, persistedParams);

export interface CaptureRecord {
  ok: boolean;
  /** Human-readable outcome: the filename, or the reason it failed. */
  label: string;
  at: number;
}

export interface LabState {
  params: EffectParams;
  paused: boolean;
  status: CaptureStatus;
  /** Persistent record of the last CAPTURE, kept after the toast has gone. */
  lastCapture: CaptureRecord | null;
  notice: LabNotice | null;
  /** Exhibit currently being manipulated (lab routes + Echoes focus). */
  focus: ExhibitId;
  setParam: <K extends EffectParamKey>(key: K, value: number) => void;
  setParams: (params: EffectParams) => void;
  togglePause: () => void;
  setPaused: (paused: boolean) => void;
  reset: () => void;
  randomize: () => void;
  requestCapture: () => void;
  resolveCapture: (status: Exclude<CaptureStatus, 'idle' | 'capturing'>, message?: string) => void;
  setFocus: (focus: ExhibitId) => void;
  exportConfig: () => boolean;
  importConfig: () => Promise<LabNotice | null>;
  notify: (notice: Omit<LabNotice, 'at'>) => void;
  dismissNotice: () => void;
}

const mirror = (params: EffectParams): EffectParams => {
  Object.assign(labParams, params);
  return params;
};

const snapshot = (params: EffectParams): string =>
  Object.values(params)
    .map((v) => Number(v).toFixed(3))
    .join('|');

export const useLabStore = create<LabState>((set, get) => ({
  params: persistedParams,
  paused: false,
  status: 'idle',
  lastCapture: null,
  notice: null,
  focus: 'particles',

  setParam: (key, value) => {
    const current = get().params;
    const next = mirror({ ...current, [key]: clampParamValue(key, value) });
    set({ params: next });
    persistDebounced('lab.params', next);
  },

  setParams: (params) => {
    const sanitized = sanitizeEffectParams(params);
    const next = mirror(sanitized.params);
    set({ params: next });
    persistNow('lab.params', next);
  },

  togglePause: () => {
    const paused = !get().paused;
    labRuntime.paused = paused;
    clockField.running = paused ? 0 : 1;
    set({ paused });
  },

  setPaused: (paused) => {
    labRuntime.paused = paused;
    clockField.running = paused ? 0 : 1;
    set({ paused });
  },

  reset: () => {
    const next = mirror(defaultEffectParams());
    labRuntime.paused = false;
    clockField.running = 1;
    set({
      params: next,
      paused: false,
      notice: {
        kind: 'info',
        message: 'Parameters returned to factory values.',
        at: Date.now(),
      },
    });
    persistNow('lab.params', next);
  },

  randomize: () => {
    const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    const next = mirror(randomizeEffectParams(seed));
    set({
      params: next,
      notice: { kind: 'info', message: `Variant ${seed.toString(16).slice(0, 6).toUpperCase()} generated.`, at: Date.now() },
    });
    persistNow('lab.params', next);
  },

  requestCapture: () => {
    labRuntime.captureToken += 1;
    set({ status: 'capturing', notice: null });
  },

  resolveCapture: (status, message) => {
    const ok = status === 'success';
    const at = Date.now();
    set({
      status,
      // The toast is transient; the readout is not. A visitor who misses the
      // toast can still see what was captured, or why nothing was.
      lastCapture: {
        ok,
        label: ok ? (message ?? 'Frame captured') : (message ?? 'Capture failed'),
        at,
      },
      notice: message ? { kind: ok ? 'success' : 'error', message, at } : null,
    });
  },

  setFocus: (focus) => {
    labRuntime.focus = focus;
    set({ focus });
  },

  exportConfig: () => {
    const payload = serializeEffectConfig(get().params);
    const stamp = formatDateStamp(new Date()).replace(/[^\d.]/g, '');
    const ok = downloadJson(payload, `afterlight-effect-${stamp}.json`);
    set({
      notice: ok
        ? { kind: 'success', message: 'Configuration exported as JSON.', at: Date.now() }
        : {
            kind: 'error',
            message: 'Export failed — the browser blocked the download.',
            at: Date.now(),
          },
    });
    return ok;
  },

  importConfig: async () => {
    const text = await pickTextFile();
    if (text === null) return null;
    const result = parseEffectConfig(text);
    const next = mirror(result.params);
    persistNow('lab.params', next);
    const notice: LabNotice = {
      kind: result.rejected ? 'error' : result.repairs.length ? 'info' : 'success',
      message: result.rejected
        ? 'That file did not contain a usable AFTERLIGHT configuration.'
        : `Configuration imported${result.repairs.length ? ' with corrections' : ''}.`,
      details: result.repairs.length ? result.repairs : undefined,
      at: Date.now(),
    };
    set({ params: next, notice });
    return notice;
  },

  notify: (notice) => set({ notice: { ...notice, at: Date.now() } }),
  dismissNotice: () => set({ notice: null }),
}));

/** True when the mirror and the last persisted snapshot have diverged. */
export const labParamsChanged = (): boolean =>
  snapshot(labParams) !== snapshot(DEFAULT_EFFECT_PARAMS);
