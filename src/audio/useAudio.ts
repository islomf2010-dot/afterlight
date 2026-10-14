import { useEffect } from 'react';
import { audioEngine } from './engine';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useJourneyStore } from '@/store/useJourneyStore';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useLabStore } from '@/store/useLabStore';

/**
 * Binds the audio engine to settings and narrative state.
 *
 * Mounted once. The engine itself only ever creates an AudioContext in response
 * to a gesture (see `unlock`), so mounting this hook is side-effect free with
 * respect to autoplay policy.
 */
export const useAudioBridge = (): void => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const volume = useSettingsStore((s) => s.volume);
  const ambientVolume = useSettingsStore((s) => s.ambientVolume);
  const pauseWhenHidden = useSettingsStore((s) => s.pauseWhenHidden);
  const activeScene = useJourneyStore((s) => s.activeScene);
  const hidden = usePageVisibility();

  useEffect(() => {
    audioEngine.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    audioEngine.setAmbientVolume(ambientVolume);
  }, [ambientVolume]);

  useEffect(() => {
    if (audioEngine.started) audioEngine.setScene(activeScene);
  }, [activeScene]);

  useEffect(() => {
    audioEngine.setSuspended(pauseWhenHidden && hidden);
  }, [hidden, pauseWhenHidden]);

  // Release the device when the app unmounts (tests, HMR, route teardown).
  useEffect(() => () => audioEngine.dispose(), []);
};

/** Unlocks audio from inside a user gesture handler. */
export const unlockAudio = (): Promise<boolean> => audioEngine.unlock();

/**
 * The only supported way to turn sound on or off.
 *
 * Both the unlock and the state change happen synchronously inside the caller's
 * click/pointer handler, which is what keeps the AudioContext inside the browser's
 * user-activation window. Every sound toggle in the app routes through here.
 */
export const setSoundEnabled = (next: boolean): void => {
  if (next) void audioEngine.unlock();
  audioEngine.setEnabled(next);
  useSettingsStore.getState().set('soundEnabled', next);
};

/**
 * Wires the laboratory's action buttons to audio cues.
 * Kept separate so the lab store stays free of audio concerns.
 */
export const useLabCues = (): void => {
  const status = useLabStore((s) => s.status);
  const notice = useLabStore((s) => s.notice);

  useEffect(() => {
    if (status === 'capturing') return;
    if (status === 'success') audioEngine.cue('capture');
    else if (status === 'error') audioEngine.cue('error');
  }, [status]);

  useEffect(() => {
    if (!notice) return;
    if (notice.kind === 'error') audioEngine.cue('error');
    else if (notice.kind === 'success') audioEngine.cue('click');
  }, [notice]);
};
