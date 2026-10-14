import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act, createElement } from 'react';
import { usePageVisibility, visibility } from './usePageVisibility';

// React requires this flag before `act` will flush effects synchronously.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

interface Harness {
  result: { current: boolean };
  dispose: () => void;
}

/**
 * Renders a hook into a detached container.
 *
 * Written by hand rather than pulling in @testing-library/react: the project
 * already depends on React 19, whose `act` plus `createRoot` is enough for a
 * single-hook assertion, and adding a test framework for one test file would be
 * a larger change than the test itself.
 */
const renderHook = (hook: () => boolean): Harness => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const result = { current: false };
  const root: Root = createRoot(container);

  const Probe = (): null => {
    result.current = hook();
    return null;
  };

  act(() => {
    root.render(createElement(Probe));
  });

  return {
    result,
    dispose: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
};

/** Drives the document's visibility the way a real tab switch does. */
const setVisibility = (state: 'visible' | 'hidden'): void => {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
  document.dispatchEvent(new Event('visibilitychange'));
};

describe('usePageVisibility', () => {
  let harness: Harness | null = null;

  beforeEach(() => {
    setVisibility('visible');
    visibility.hidden = false;
    visibility.focused = true;
  });

  afterEach(() => {
    harness?.dispose();
    harness = null;
    setVisibility('visible');
  });

  it('reports visible when the document is visible', () => {
    harness = renderHook(() => usePageVisibility());
    expect(harness.result.current).toBe(false);
  });

  it('reacts to a real visibilitychange event', () => {
    harness = renderHook(() => usePageVisibility());

    act(() => setVisibility('hidden'));
    expect(harness.result.current).toBe(true);
    // The non-reactive mirror must follow, or the render loop keeps running
    // while React believes the page is hidden.
    expect(visibility.hidden).toBe(true);

    act(() => setVisibility('visible'));
    expect(harness.result.current).toBe(false);
    expect(visibility.hidden).toBe(false);
  });

  it('tracks window focus alongside visibility', () => {
    harness = renderHook(() => usePageVisibility());
    const spy = vi.spyOn(document, 'hasFocus');

    spy.mockReturnValue(false);
    act(() => {
      window.dispatchEvent(new Event('blur'));
    });
    expect(visibility.focused).toBe(false);

    spy.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event('focus'));
    });
    expect(visibility.focused).toBe(true);
    spy.mockRestore();
  });

  it('survives an environment without document.hasFocus', () => {
    const original = document.hasFocus;
    Object.defineProperty(document, 'hasFocus', { configurable: true, value: undefined });
    try {
      expect(() => renderHook(() => usePageVisibility())).not.toThrow();
    } finally {
      Object.defineProperty(document, 'hasFocus', { configurable: true, value: original });
    }
  });

  it('removes every listener it added on unmount', () => {
    const added: string[] = [];
    const removed: string[] = [];
    const realDocAdd = document.addEventListener.bind(document);
    const realDocRemove = document.removeEventListener.bind(document);
    const realWinAdd = window.addEventListener.bind(window);
    const realWinRemove = window.removeEventListener.bind(window);

    const track =
      (target: typeof added, prefix: string) =>
      (original: EventTarget['addEventListener'] | EventTarget['removeEventListener']) =>
      ((type: string, listener: never, options?: never) => {
        target.push(`${prefix}${type}`);
        return (original as (...a: unknown[]) => void)(type, listener, options);
      }) as never;

    document.addEventListener = track(added, '')(
      realDocAdd as unknown as EventTarget['addEventListener'],
    ) as never;
    document.removeEventListener = track(removed, '')(
      realDocRemove as unknown as EventTarget['removeEventListener'],
    ) as never;
    window.addEventListener = track(added, 'window:')(
      realWinAdd as unknown as EventTarget['addEventListener'],
    ) as never;
    window.removeEventListener = track(removed, 'window:')(
      realWinRemove as unknown as EventTarget['removeEventListener'],
    ) as never;

    try {
      const local = renderHook(() => usePageVisibility());
      local.dispose();

      expect(added).toContain('visibilitychange');
      expect(removed).toContain('visibilitychange');
      expect(added).toContain('window:focus');
      expect(removed).toContain('window:focus');
      expect(added).toContain('window:blur');
      expect(removed).toContain('window:blur');
    } finally {
      document.addEventListener = realDocAdd;
      document.removeEventListener = realDocRemove;
      window.addEventListener = realWinAdd;
      window.removeEventListener = realWinRemove;
    }
  });
});
