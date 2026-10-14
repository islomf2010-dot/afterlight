import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { ScrollTrigger } from '@/animation/smoothScroll';
import { progressRegistry } from '@/animation/progressRegistry';
import { useJourneyStore } from '@/store/useJourneyStore';
import type { SceneId } from '@/scenes/sceneManifest';

export interface SceneScrollOptions {
  /**
   * Which scene this section represents when it owns the viewport centre.
   * Ignored when `trackAsScene` is false.
   */
  sceneId?: SceneId;
  trackAsScene?: boolean;
  enabled?: boolean;
}

/**
 * Binds a DOM section to the imperative progress registry and to the narrative
 * "active scene" state.
 *
 * Two triggers, deliberately:
 *
 *  - a *progress* trigger spanning `top bottom → bottom top`, which is the full
 *    scroll range the camera scrubs across. Its output goes into the imperative
 *    registry, never into React state;
 *  - an *activation* trigger spanning `top center → bottom center`, which fires
 *    only when the section actually owns the middle of the screen. That is the
 *    only thing allowed to update React, and it changes a handful of times per
 *    visit.
 *
 * Sections are 300vh tall with a 100vh sticky child, so the camera only moves
 * while the content is pinned (raw progress 0.25 → 0.75) — see `travel()`.
 */
export const useSceneScroll = (
  ref: RefObject<HTMLElement | null>,
  sceneId: SceneId,
  options: SceneScrollOptions = {},
): void => {
  const { trackAsScene = true, enabled = true } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const progressTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        progressRegistry.write(sceneId, self.progress, self.getVelocity() / 900);
      },
      onToggle: (self) => {
        progressRegistry.setActive(sceneId, self.isActive);
      },
    });

    const activate = (active: boolean): void => {
      if (!trackAsScene) return;
      if (active) useJourneyStore.getState().setActiveScene(sceneId);
    };

    const activationTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => activate(self.isActive),
      onEnter: () => activate(true),
      onEnterBack: () => activate(true),
    });

    // Deep links (`/#fracture`) and restored scroll positions need the active
    // scene resolved immediately rather than on the first scroll event.
    const raf = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const centre = rect.top + rect.height / 2;
      const owns = centre <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      activate(owns);
    });

    return () => {
      cancelAnimationFrame(raf);
      progressTrigger.kill();
      activationTrigger.kill();
      progressRegistry.setActive(sceneId, false);
    };
  }, [ref, sceneId, trackAsScene, enabled]);
};

/**
 * Reads a scene's progress on an interval and re-renders only when the value
 * crosses a coarse bucket.
 *
 * Used by the DOM overlays that need to show a scroll-linked number (cohesion
 * percentage, corridor depth). Bucketing means a full-width drag produces a few
 * dozen renders rather than a few hundred.
 */
export const useBucketedProgress = (
  sceneId: SceneId,
  buckets = 20,
): { value: number; bucket: number } => {
  const [state, setState] = useState({ value: 0, bucket: 0 });

  useEffect(() => {
    let frame = 0;
    let lastBucket = -1;
    const loop = (): void => {
      frame = requestAnimationFrame(loop);
      const value = progressRegistry.value(sceneId);
      const bucket = Math.round(value * buckets);
      if (bucket === lastBucket) return;
      lastBucket = bucket;
      setState((prev) => (prev.bucket === bucket ? prev : { value, bucket }));
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [sceneId, buckets, setState]);

  return state;
};
