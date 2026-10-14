import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { CapabilitiesProvider, capabilities } from '@/graphics/capabilitiesContext';
import { applyRuntimeFlags, useSettingsStore } from '@/store/useSettingsStore';
import { loadFonts, loadingRegistry } from '@/app/loadingRegistry';
import { installPersistenceFlush } from '@/store/persistedState';
import { destroySmoothScroll, initSmoothScroll, refreshScrollTriggers } from '@/animation/smoothScroll';
import { usePointerField } from '@/hooks/usePointerField';
import { useAudioBridge } from '@/audio/useAudio';
import { progressRegistry, resetPointerField } from '@/animation/progressRegistry';

/**
 * Application-level bootstrap.
 *
 * Order matters here and is deliberate:
 *   1. device profile  — before the first frame, so the canvas starts at the
 *                        right pixel ratio and with the right context flags;
 *   2. fonts           — real loading work, reported to the intro;
 *   3. scroll engine   — only once fonts have landed, because a font swap
 *                        reflows the document and invalidates every trigger;
 *   4. pointer + audio — pure listeners, no ordering constraints.
 */
const AppRuntime = ({ children }: { children: ReactNode }) => {
  const settings = useSettingsStore();
  const fontsSettled = useRef(false);

  // 0 — never lose a debounced settings write to a reload or a closed tab.
  useEffect(() => installPersistenceFlush(), []);

  // 1 — device profile + CSS-level flags.
  useEffect(() => {
    useSettingsStore.getState().applyDeviceProfile({
      tier: capabilities.tier,
      webgl: capabilities.webgl,
      systemReducedMotion: capabilities.systemReducedMotion,
      dprCap: capabilities.dprCap,
    });
  }, []);

  // 2 — fonts, plus a hard ceiling on the whole loading gate.
  useEffect(() => {
    void loadFonts().finally(() => {
      fontsSettled.current = true;
      // The document just reflowed; every trigger's start/end is stale.
      refreshScrollTriggers();
    });
    // Whatever happens, the film must be enterable. Anything still outstanding
    // after this is reported as failed rather than leaving the gate shut.
    loadingRegistry.settleAfter(15_000);
  }, []);

  // 3 — smooth scrolling, rebuilt only when the relevant settings change.
  useEffect(() => {
    if (!fontsSettled.current && document.fonts?.status !== 'loaded') {
      // Lenis is created after the first ScrollTrigger-free paint; creating it
      // earlier would measure a document whose type is still swapping.
      const id = window.setTimeout(() => {
        initSmoothScroll({ enabled: settings.smoothScroll, reducedMotion: isReduced(settings.motion) });
      }, 60);
      return () => window.clearTimeout(id);
    }
    initSmoothScroll({ enabled: settings.smoothScroll, reducedMotion: isReduced(settings.motion) });
    return () => destroySmoothScroll();
  }, [settings.smoothScroll, settings.motion]);

  // CSS custom properties + runtime mirror follow every settings change.
  useEffect(() => {
    applyRuntimeFlags(settings);
  }, [settings]);

  // Re-measure after a resize that changes layout width (mobile URL bar, etc).
  useEffect(() => {
    let timer = 0;
    const onResize = (): void => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => refreshScrollTriggers(), 180);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  // Warn loudly if a driver context is lost without restoration.
  useEffect(() => {
    const onLost = (): void => {
      progressRegistry.reset();
      resetPointerField();
    };
    window.addEventListener('pagehide', onLost);
    return () => window.removeEventListener('pagehide', onLost);
  }, []);

  usePointerField();
  useAudioBridge();

  return <>{children}</>;
};

const isReduced = (motion: string): boolean =>
  motion === 'reduced' || (motion === 'system' && capabilities.systemReducedMotion);

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <CapabilitiesProvider>
    <AppRuntime>{children}</AppRuntime>
  </CapabilitiesProvider>
);
