import { useEffect, useState } from 'react';

/**
 * True while the document is visible AND the window has focus.
 *
 * The render loop reads the non-reactive `visibility.hidden` flag; this hook
 * returns the React-friendly version for UI that needs to re-render (e.g.
 * showing a "paused" badge).
 */
export const visibility = { hidden: false, focused: true };

/** Guarded because not every DOM implementation provides `hasFocus`. */
const hasFocus = (): boolean =>
  typeof document !== 'undefined' && typeof document.hasFocus === 'function'
    ? document.hasFocus()
    : true;

const compute = (): boolean =>
  typeof document === 'undefined' || typeof document.visibilityState !== 'string'
    ? false
    : document.visibilityState === 'hidden';

export const usePageVisibility = (): boolean => {
  const [hidden, setHidden] = useState<boolean>(compute);

  useEffect(() => {
    const onVisibility = (): void => {
      visibility.hidden = compute();
      setHidden(visibility.hidden);
    };
    const onFocus = (): void => {
      visibility.focused = hasFocus();
    };

    visibility.hidden = compute();
    visibility.focused = hasFocus();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onFocus);
    };
  }, []);

  return hidden;
};
