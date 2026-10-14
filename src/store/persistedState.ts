/**
 * Persistence helper for zustand stores.
 *
 * We hand-roll this rather than using `zustand/middleware/persist` because we
 * need three guarantees the middleware does not give us cheaply:
 *   1. the persisted blob is validated field-by-field by a caller-supplied
 *      sanitizer (stored data is untrusted input — it may be from an older
 *      build, hand-edited, or corrupt),
 *   2. a storage exception can never break boot,
 *   3. writes are debounced, so dragging a slider does not thrash localStorage.
 *
 * The cost of (3) is that a write can still be in flight when the visitor
 * navigates away or reloads. `flushPersisted()` is installed on `pagehide` and
 * on tab-hide for exactly that reason — without it, flipping a setting and
 * immediately reloading silently loses the change.
 */

import { readJson, writeJson } from '@/utils/storage';

export const loadPersisted = <T>(key: string, sanitize: (raw: unknown) => T, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const raw = readJson<unknown>(key, null);
  if (raw === null) return fallback;
  try {
    return sanitize(raw);
  } catch {
    return fallback;
  }
};

let writeTimer: number | null = null;
const pending = new Map<string, unknown>();

/** Writes every coalesced value immediately. Idempotent and cheap when empty. */
export const flushPersisted = (): void => {
  if (writeTimer !== null) {
    window.clearTimeout(writeTimer);
    writeTimer = null;
  }
  if (pending.size === 0) return;
  const batch = [...pending.entries()];
  pending.clear();
  batch.forEach(([key, value]) => writeJson(key, value));
};

/** Coalesces bursts of writes (slider drags) into one flush. */
export const persistDebounced = (key: string, value: unknown, delay = 220): void => {
  pending.set(key, value);
  if (writeTimer !== null) return;
  writeTimer = window.setTimeout(flushPersisted, delay);
};

export const persistNow = (key: string, value: unknown): void => {
  pending.delete(key);
  writeJson(key, value);
};

let installed = false;

/** Installs the page-hide flush. Safe to call more than once. */
export const installPersistenceFlush = (): void => {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('pagehide', flushPersisted);
  window.addEventListener('beforeunload', flushPersisted);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPersisted();
  });
};
