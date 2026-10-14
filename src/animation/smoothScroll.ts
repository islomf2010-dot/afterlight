/**
 * Smooth scrolling + ScrollTrigger integration.
 *
 * Lenis is driven from GSAP's ticker rather than its own rAF loop
 * (`autoRaf: false`). That is the documented integration and the reason it
 * behaves correctly: ScrollTrigger.update and the Lenis raf happen in the same
 * frame, in the right order, off one clock — so pinned/scrubbed timelines
 * never read a stale scroll position.
 *
 * When the visitor prefers reduced motion (or turns smoothing off in settings)
 * Lenis is *destroyed*, not merely stopped: the page falls back to untouched
 * native scrolling, which is also what keeps the browser's own scroll
 * restoration, keyboard paging and find-in-page working.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers resize the viewport when the URL bar retracts; without this,
// ScrollTrigger recalculates every trigger on each of those resizes and the
// page visibly jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

export interface SmoothScrollHandle {
  lenis: Lenis;
  destroy: () => void;
}

let handle: SmoothScrollHandle | null = null;

export interface SmoothScrollOptions {
  /** Disabled entirely when reduced motion is active. */
  enabled: boolean;
  reducedMotion: boolean;
}

export const initSmoothScroll = ({ enabled, reducedMotion }: SmoothScrollOptions): SmoothScrollHandle | null => {
  // Always tear down first: React 19 StrictMode mounts effects twice in dev.
  destroySmoothScroll();

  if (!enabled || reducedMotion || typeof window === 'undefined') return null;

  const lenis = new Lenis({
    // Lerp rather than duration: it degrades gracefully when frames are slow,
    // which matters more here than the exact easing curve.
    lerp: 0.085,
    smoothWheel: true,
    syncTouch: false, // native touch scrolling stays native — see README
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
    autoRaf: false,
    anchors: true,
  });

  const onScroll = (): void => ScrollTrigger.update();
  lenis.on('scroll', onScroll);

  const raf = (time: number): void => {
    // GSAP's ticker reports seconds; Lenis wants milliseconds.
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(raf);
  // Lag smoothing would let the ticker skip ahead after a stall, desynchronising
  // ScrollTrigger from Lenis. Disable it for this shared loop.
  gsap.ticker.lagSmoothing(0);

  handle = {
    lenis,
    destroy: () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      handle = null;
    },
  };
  return handle;
};

export const destroySmoothScroll = (): void => {
  handle?.destroy();
  handle = null;
};

export const getSmoothScroll = (): Lenis | null => handle?.lenis ?? null;

/**
 * Programmatic scroll that respects whichever scroll engine is active.
 * Falls back to `scrollIntoView` so keyboard and reduced-motion users still get
 * navigation.
 */
export const scrollToTarget = (
  target: HTMLElement | string | number,
  options: { offset?: number; immediate?: boolean } = {},
): void => {
  const lenis = getSmoothScroll();
  const offset = options.offset ?? 0;

  if (lenis) {
    lenis.scrollTo(target, { offset, immediate: options.immediate, duration: 1.15 });
    return;
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: options.immediate ? 'auto' : 'smooth' });
    return;
  }
  const element = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: options.immediate ? 'auto' : 'smooth' });
};

export const scrollToTop = (immediate = false): void => scrollToTarget(0, { immediate });

/** Recalculates every trigger — call after fonts land or layout changes. */
export const refreshScrollTriggers = (): void => ScrollTrigger.refresh();

export { gsap, ScrollTrigger };
