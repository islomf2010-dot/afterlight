/**
 * Namespaced, defensive localStorage access.
 *
 * Every read is validated by the caller: storage can be unavailable
 * (private mode, disabled cookies), full, or hold data written by an older
 * build. Nothing here ever throws.
 */

export const STORAGE_PREFIX = 'afterlight:';

export type StorageKind = 'local' | 'session';

const backend = (kind: StorageKind): Storage | null => {
  try {
    const store = kind === 'local' ? window.localStorage : window.sessionStorage;
    // Touch it — Safari in private mode throws only on access, not on grab.
    const probe = `${STORAGE_PREFIX}__probe__`;
    store.setItem(probe, '1');
    store.removeItem(probe);
    return store;
  } catch {
    return null;
  }
};

export const storageAvailable = (kind: StorageKind = 'local'): boolean => backend(kind) !== null;

export const readJson = <T>(key: string, fallback: T, kind: StorageKind = 'local'): T => {
  const store = backend(kind);
  if (!store) return fallback;
  try {
    const raw = store.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupt entry — drop it so we do not re-throw on every load.
    try {
      store.removeItem(STORAGE_PREFIX + key);
    } catch {
      /* no-op */
    }
    return fallback;
  }
};

export const writeJson = (key: string, value: unknown, kind: StorageKind = 'local'): boolean => {
  const store = backend(kind);
  if (!store) return false;
  try {
    store.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    // Quota exceeded (usually large captures/config blobs) — degrade silently.
    return false;
  }
};

export const removeKey = (key: string, kind: StorageKind = 'local'): void => {
  const store = backend(kind);
  if (!store) return;
  try {
    store.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* no-op */
  }
};

export const clearNamespace = (kind: StorageKind = 'local'): void => {
  const store = backend(kind);
  if (!store) return;
  try {
    const doomed: string[] = [];
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) doomed.push(key);
    }
    doomed.forEach((key) => store.removeItem(key));
  } catch {
    /* no-op */
  }
};
