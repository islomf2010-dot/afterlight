import { useEffect, useState } from 'react';

/**
 * True while the document is visible AND the window has focus.
 *
 * The render loop reads the non-reactive `visibility.hidden` flag; this hook
 * returns the React-friendly version for UI that needs to re-render (e.g.
 * showing a "paused" badge).
 */
export const visibility = { hidden: false, focused: true };

const compute = (): boolean =>
  typeof document === 'undefined' ? false : document.visibilityState === 'hidden';

export const usePageVisibility = (): boolean => {
  const [hidden, setHidden] = useState<boolean>(compute);

  useEffect(() => {
    const onVisibility = (): void => {
      visibility.hidden = compute();
      setHidden(visibility.hidden);
    };
    const onFocus = (): void => {
      visibility.focused = typeof document !== 'undefined' && document.hasFocus();
    };

    visibility.hidden = compute();
    visibility.focused = typeof document !== 'undefined' ? document.hasFocus() : true;

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

export const isPageHidden = (): boolean => visibility.hidden;
