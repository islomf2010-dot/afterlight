/**
 * The canonical scene manifest.
 *
 * One source of truth shared by the progress indicator, the transition
 * curtain, the archive, the ending credits and the scroll director. Scenes
 * are declared in narrative order; `scrollId` matches the DOM id used by the
 * scroll-linked sections.
 */

export type SceneId = 'awakening' | 'void' | 'fracture' | 'threshold' | 'echoes' | 'afterlight';

export interface SceneDefinition {
  id: SceneId;
  index: number;
  numeral: string;
  title: string;
  subtitle: string;
  /** Longer log entry, shown in the archive and the scene overlay. */
  log: string;
  /** Technical tag shown in the HUD. */
  telemetry: string;
  /** Route that isolates this scene's research, when one exists. */
  labRoute?: string;
  /** Awakening is a gate, not a scroll section. */
  gated?: boolean;
}

export const SCENES: readonly SceneDefinition[] = [
  {
    id: 'awakening',
    index: 0,
    numeral: 'I',
    title: 'The Awakening',
    subtitle: 'Cold open',
    telemetry: 'SIGNAL ACQUIRED · 0.000 LUX',
    log: 'A point of light persists in total darkness. It is the only thing that has not yet decided what it is. Systems come online around it, one at a time, naming things that are not there yet.',
    gated: true,
  },
  {
    id: 'void',
    index: 1,
    numeral: 'II',
    title: 'The Void',
    subtitle: 'Monolith',
    telemetry: 'SURFACE REFLECTANCE 0.04 · SEA STATE 2',
    log: 'A structure too large to have been built stands above an ocean that remembers nothing. The camera drifts. Everything it passes is indifferent to it.',
  },
  {
    id: 'fracture',
    index: 2,
    numeral: 'III',
    title: 'Fracture',
    subtitle: 'Disintegration',
    telemetry: 'COHESION 0.31 · FRAGMENTS 2 400',
    log: 'The structure loses its argument with itself. Each fragment keeps the shape it was given, travelling a long way from the shape it was in. Drag the field; it will reassemble if you let it.',
    labRoute: '/lab/particles',
  },
  {
    id: 'threshold',
    index: 3,
    numeral: 'IV',
    title: 'The Threshold',
    subtitle: 'Passage',
    telemetry: 'APERTURE OPEN · PASSAGE LENGTH ∞',
    log: 'Architecture repeats until repetition becomes a door. There is a point beyond the repetition where the corridor stops being a place and becomes a direction.',
    labRoute: '/lab/shaders',
  },
  {
    id: 'echoes',
    index: 4,
    numeral: 'V',
    title: 'Echoes',
    subtitle: 'Studies',
    telemetry: '3 STUDIES MOUNTED · INPUT LIVE',
    log: 'Three effects, isolated and left running. Particle field, refractive surface, and a portal that only opens for the pointer. Every parameter is exposed; nothing is decorative.',
    labRoute: '/lab',
  },
  {
    id: 'afterlight',
    index: 5,
    numeral: 'VI',
    title: 'Afterlight',
    subtitle: 'Coda',
    telemetry: 'FRAME COUNT ∞ · LIGHT RETAINED',
    log: 'The camera withdraws until there is nothing to withdraw from. What remains is the afterlight — the shape left behind by things that were briefly visible.',
    labRoute: '/lab/portal',
  },
] as const;

export const SCENE_IDS = SCENES.map((s) => s.id);

export const sceneById = (id: SceneId): SceneDefinition => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene: ${id}`);
  return found;
};

export const sceneIndex = (id: SceneId): number => SCENES.findIndex((s) => s.id === id);

export const adjacentScenes = (id: SceneId): SceneId[] => {
  const i = sceneIndex(id);
  if (i < 0) return [];
  return SCENES.slice(Math.max(0, i - 1), Math.min(SCENES.length, i + 2))
    .map((s) => s.id)
    .filter((s) => s !== id);
};
