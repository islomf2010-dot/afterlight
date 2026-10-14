import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Navigation } from '@/components/navigation/Navigation';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { CustomCursor } from '@/components/overlay/CustomCursor';
import { FilmOverlay } from '@/components/overlay/FilmOverlay';
import { SceneCurtain } from '@/components/transitions/SceneCurtain';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useJourneyStore } from '@/store/useJourneyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { cue } from '@/audio/engine';
import { setSoundEnabled, unlockAudio, useLabCues } from '@/audio/useAudio';

/**
 * The application shell.
 *
 * Owns the chrome that persists across routes — navigation, overlays, the
 * settings drawer and the transition curtain — and nothing else. Route content
 * is rendered through <Outlet />, so navigating never tears down the shell, the
 * WebGL context or the audio graph.
 */
export const AppShell = () => {
  const location = useLocation();
  const settingsOpen = useJourneyStore((s) => s.settingsOpen);
  const setSettingsOpen = useJourneyStore((s) => s.setSettingsOpen);
  const entered = useJourneyStore((s) => s.entered);
  const transition = useJourneyStore((s) => s.transition);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const [chromeHidden, setChromeHidden] = useState(false);

  useLabCues();

  // Route changes always land at the top of the new page, and the shell's
  // transient UI closes.
  useEffect(() => {
    setSettingsOpen(false);
    setChromeHidden(false);
  }, [location.pathname, setSettingsOpen]);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    // Synchronous, inside the click: this is what keeps the AudioContext inside
    // the browser's user-activation window.
    setSoundEnabled(next);
    if (next) void unlockAudio().then((ok) => cue('scene', ok ? 1 : 0));
  }, [soundEnabled]);

  const openSettings = useCallback(() => {
    setSettingsOpen(true);
    cue('click');
  }, [setSettingsOpen]);

  const chromeVisible = (entered || location.pathname !== '/') && transition === 'idle' && !chromeHidden;

  return (
    <div className="relative min-h-dvh">
      <a
        href="#main"
        className={[
          'label-mono fixed left-4 top-4 z-[200] -translate-y-24 bg-ivory px-4 py-3 text-obsidian',
          'transition-transform duration-200 ease-[var(--al-ease-out)] focus:translate-y-0',
        ].join(' ')}
      >
        Skip to content
      </a>

      <Navigation
        visible={chromeVisible}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenSettings={openSettings}
      />

      <main id="main" className="relative">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>

      <FilmOverlay />
      <CustomCursor />
      <SceneCurtain />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};
