import { useEffect, useState } from 'react';

/**
 * Subscribes to a CSS media query. Uses the modern `addEventListener` API with
 * a `addListener` fallback for Safari < 14.
 */
export const useMediaQuery = (query: string, initial = false): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return initial;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent | MediaQueryList): void => setMatches(event.matches);
    setMatches(list.matches);

    if (typeof list.addEventListener === 'function') {
      list.addEventListener('change', onChange as (e: MediaQueryListEvent) => void);
      return () => list.removeEventListener('change', onChange as (e: MediaQueryListEvent) => void);
    }
    // Deprecated path, still required for older WebKit.
    list.addListener(onChange as (e: MediaQueryListEvent) => void);
    return () => list.removeListener(onChange as (e: MediaQueryListEvent) => void);
  }, [query]);

  return matches;
};

/** Viewport classes used across the layout. */
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 767px)');
export const useHasCoarsePointer = (): boolean => useMediaQuery('(pointer: coarse)');