import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearNamespace, readJson, removeKey, writeJson, storageAvailable } from './storage';

describe('storage helpers', () => {
  beforeEach(() => {
    clearNamespace();
  });

  it('reports availability in jsdom', () => {
    expect(storageAvailable('local')).toBe(true);
  });

  it('round-trips a value', () => {
    expect(writeJson('demo', { a: 1, b: [2, 3] })).toBe(true);
    expect(readJson('demo', null)).toEqual({ a: 1, b: [2, 3] });
  });

  it('returns the fallback for a missing key', () => {
    expect(readJson('nope', 'fallback')).toBe('fallback');
  });

  it('returns the fallback and clears a corrupt entry', () => {
    window.localStorage.setItem('afterlight:corrupt', '{ this is not json');
    expect(readJson('corrupt', { ok: true })).toEqual({ ok: true });
    expect(window.localStorage.getItem('afterlight:corrupt')).toBeNull();
  });

  it('keeps keys namespaced', () => {
    window.localStorage.setItem('unrelated', 'value');
    writeJson('scoped', 1);
    expect(window.localStorage.getItem('unrelated')).toBe('value');
    clearNamespace();
    expect(window.localStorage.getItem('unrelated')).toBe('value');
    expect(window.localStorage.getItem('afterlight:scoped')).toBeNull();
  });

  it('removes a single key', () => {
    writeJson('gone', 1);
    removeKey('gone');
    expect(readJson('gone', 'fallback')).toBe('fallback');
  });

  it('survives a quota failure without throwing', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key) => {
      if (key.startsWith('afterlight:')) throw new DOMException('QuotaExceededError');
      return undefined;
    });
    expect(() => writeJson('big', 'x'.repeat(10))).not.toThrow();
    // Even the availability probe throws, so `available` must degrade to false.
    expect(storageAvailable('local')).toBe(false);
    setItem.mockRestore();
  });

  it('survives a hostile localStorage whose accessors throw', () => {
    const descriptor = Object.getOwnPropertyDescriptor(Window.prototype, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('SecurityError');
      },
    });
    try {
      expect(storageAvailable('local')).toBe(false);
      expect(readJson('x', 'fallback')).toBe('fallback');
      expect(writeJson('x', 1)).toBe(false);
      expect(() => removeKey('x')).not.toThrow();
      expect(() => clearNamespace()).not.toThrow();
    } finally {
      if (descriptor) Object.defineProperty(window, 'localStorage', descriptor);
    }
  });
});
