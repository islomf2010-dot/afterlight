/**
 * Journey store — narrative state for the six-scene film on `/`.
 *
 * Deliberately low-frequency: it only changes when the visitor enters, crosses
 * a scene boundary, replays, or opens the settings. Nothing here updates on a
 * scroll frame, so the DOM overlay can subscribe to it safely.
 */

import { create } from 'zustand';
import { loadPersisted, persistDebounced } from './persistedState';
import { SCENE_IDS, type SceneId } from '@/scenes/sceneManifest';

export type TransitionPhase = 'idle' | 'covering' | 'revealing';

export interface JourneyState {
  /** True once ENTER has been pressed and the intro has handed off to the film. */
  entered: boolean;
  /** Real asset/compile warm-up finished. */
  ready: boolean;
  /** Non-reactive mirror consumed by the render loop and the canvas overlay. */
  activeScene: SceneId;
  /** Scene order the visitor has actually reached, in order of first visit. */
  visited: SceneId[];
  /** Increments on REPLAY; scenes watch it to re-arm their sequences. */
  replayToken: number;
  /** Cinematic curtain used between the intro and the film, and on replay. */
  transition: TransitionPhase;
  transitionLabel: string;
  settingsOpen: boolean;
  hasScrolled: boolean;
  enter: () => void;
  setReady: (ready: boolean) => void;
  setActiveScene: (scene: SceneId) => void;
  beginTransition: (label: string) => void;
  endTransition: () => void;
  replay: () => void;
  setSettingsOpen: (open: boolean) => void;
  setHasScrolled: (hasScrolled: boolean) => void;
}

/** Non-reactive mirrors for use inside `useFrame`. */
export const journeyRuntime = {
  entered: false,
  ready: false,
  activeScene: 'awakening' as SceneId,
  replayToken: 0,
  /** 0 → 1 exposure ramp applied to the film as a whole after ENTER. */
  exposure: 0,
};

const persistedVisited = loadPersisted<SceneId[]>('journey.visited', (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is SceneId => SCENE_IDS.includes(id as SceneId));
}, []);

export const useJourneyStore = create<JourneyState>((set, get) => ({
  entered: false,
  ready: false,
  activeScene: 'awakening',
  visited: persistedVisited,
  replayToken: 0,
  transition: 'idle',
  transitionLabel: '',
  settingsOpen: false,
  hasScrolled: false,

  enter: () => {
    if (get().entered) return;
    journeyRuntime.entered = true;
    set({ entered: true, transition: 'covering', transitionLabel: 'descending' });
  },

  setReady: (ready) => {
    journeyRuntime.ready = ready;
    set({ ready });
  },

  setActiveScene: (scene) => {
    if (get().activeScene === scene) return;
    journeyRuntime.activeScene = scene;
    const visited = get().visited.includes(scene) ? get().visited : [...get().visited, scene];
    set({ activeScene: scene, visited });
    persistDebounced('journey.visited', visited, 900);
  },

  beginTransition: (label) => set({ transition: 'covering', transitionLabel: label }),
  endTransition: () => set({ transition: 'idle', transitionLabel: '' }),

  replay: () => {
    journeyRuntime.replayToken += 1;
    set((state) => ({
      replayToken: state.replayToken + 1,
      activeScene: 'awakening' as SceneId,
      transition: 'covering' as TransitionPhase,
      transitionLabel: 'reinitialising',
    }));
  },

  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  setHasScrolled: (hasScrolled) => {
    if (get().hasScrolled === hasScrolled) return;
    set({ hasScrolled });
  },
}));

export const hasVisitedAll = (visited: SceneId[]): boolean =>
  SCENE_IDS.every((id) => visited.includes(id));
