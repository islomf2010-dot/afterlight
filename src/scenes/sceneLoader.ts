/**
 * Scene bundle loader.
 *
 * Each scene is a separate chunk. They are streamed during the Awakening gate
 * (which is exactly what the loading progress is reporting) and wrapped in
 * Suspense so a slow network can never block the route from painting.
 */

export type SceneModule = { default: React.ComponentType };

export const SCENE_LOADERS: Record<string, () => Promise<SceneModule>> = {
  void: () => import('./Void/VoidScene') as Promise<SceneModule>,
  fracture: () => import('./Fracture/FractureScene') as Promise<SceneModule>,
  threshold: () => import('./Threshold/ThresholdScene') as Promise<SceneModule>,
  echoes: () => import('./Echoes/EchoesScene') as Promise<SceneModule>,
  afterlight: () => import('./Afterlight/AfterlightScene') as Promise<SceneModule>,
};

export const SCENE_CHUNK_IDS = Object.keys(SCENE_LOADERS);
