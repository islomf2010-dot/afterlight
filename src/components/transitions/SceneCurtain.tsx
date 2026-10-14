import { useEffect, useRef } from 'react';
import { gsap } from '@/animation/smoothScroll';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { TechLabel } from '@/components/ui/TechLabel';

/**
 * Cinematic curtain.
 *
 * Drives the two moments where the film must hide a hard cut: leaving the
 * Awakening, and re-entering the film from the ending.
 *
 * Two ownership rules keep this from going wrong, and both were learned the
 * hard way:
 *
 *  1. React owns `visibility`; GSAP owns `transform`. They must never both try
 *     to write the same property, and GSAP must never be allowed to
 *     `clearProps` the element — doing so silently strips React's inline
 *     `visibility: hidden`, leaving an opaque panel sitting on top of the film
 *     forever.
 *  2. The timeline always resolves. `endTransition` is called from the
 *     completion callback *and* from a safety timeout, so an interrupted
 *     timeline cannot strand the visitor behind an opaque panel.
 */
export const SceneCurtain = () => {
  const transition = useJourneyStore((s) => s.transition);
  const label = useJourneyStore((s) => s.transitionLabel);
  const endTransition = useJourneyStore((s) => s.endTransition);
  const reducedMotion = useSettingsStore((s) => s.motion === 'reduced');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (transition === 'idle') {
      // Park it explicitly rather than clearing properties: the curtain must
      // remain collapsed, but React still needs its `visibility` intact.
      gsap.set(root, { scaleY: 0, opacity: 1, clearProps: 'transformOrigin' });
      return;
    }

    timelineRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        timelineRef.current = null;
        endTransition();
      },
    });

    if (reducedMotion) {
      tl.set(root, { opacity: 1, scaleY: 1 })
        .to(root, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 0.25)
        .set(root, { scaleY: 0, opacity: 1, transformOrigin: 'top' });
    } else {
      tl.set(root, { transformOrigin: 'bottom', scaleY: 0, opacity: 1 })
        .to(root, { scaleY: 1, duration: 0.72, ease: 'expo.inOut' })
        .to(root, { scaleY: 0, transformOrigin: 'top', duration: 1.05, ease: 'expo.inOut' }, '+=0.18');
    }

    // Safety net: never leave the curtain up.
    const safety = window.setTimeout(() => {
      tl.progress(1);
      endTransition();
    }, 4200);

    timelineRef.current = tl;
    return () => {
      window.clearTimeout(safety);
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [transition, reducedMotion, endTransition]);

  return (
    <div
      ref={rootRef}
      data-testid="scene-curtain"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[135] flex items-center justify-center bg-obsidian"
      // React owns visibility; GSAP owns the transform.
      style={{ visibility: transition === 'idle' ? 'hidden' : 'visible' }}
    >
      <div className="flex flex-col items-center gap-3">
        <span
          aria-hidden="true"
          className="block h-px w-16 bg-[color:var(--al-line-strong)]"
          style={{ animation: reducedMotion ? undefined : 'al-flicker 2.6s linear infinite' }}
        />
        <TechLabel tone="muted">{label || 'transition'}</TechLabel>
      </div>
    </div>
  );
};
