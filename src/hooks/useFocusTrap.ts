import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const focusableWithin = (root: HTMLElement | null): HTMLElement[] =>
  root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];

/**
 * Traps Tab focus inside `ref` while `active`, restores focus to the previously
 * focused element on close, and wires Escape. Used by the settings panel and
 * the navigation drawer so keyboard users cannot tab into a canvas.
 */
export const useFocusTrap = (ref: RefObject<HTMLElement | null>, active: boolean): void => {
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Move focus in on the next frame so entry animations do not fight it.
    const raf = requestAnimationFrame(() => {
      const items = focusableWithin(node);
      (items[0] ?? node).focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return;
      const items = focusableWithin(node);
      if (items.length === 0) {
        event.preventDefault();
        node.focus({ preventScroll: true });
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || current === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener('keydown', onKeyDown);
      previous.current?.focus?.({ preventScroll: true });
    };
  }, [active, ref]);
};

/** Locks body scrolling while `active` (panels, the intro gate). */
export const useScrollLock = (active: boolean): void => {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    // Compensate for the scrollbar so the layout does not jump inwards.
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [active]);
};
