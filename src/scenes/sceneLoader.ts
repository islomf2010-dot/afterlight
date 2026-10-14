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

/**
 * Streams every scene chunk and reports genuine per-chunk progress.
 * A failed chunk resolves to `null` rather than rejecting: the director then
 * falls back to the static backdrop for that scene and the narrative still
 * plays.
 */
export const preloadScenes = async (
  onProgress: (done: number, total: number, failed: string[]) => void,
): Promise<Record<string, boolean>> => {
  const ids = SCENE_CHUNK_IDS;
  const result: Record<string, boolean> = {};
  let done = 0;
  const failed: string[] = [];

  await Promise.all(
    ids.map(async (id) => {
      try {
        await SCENE_LOADERS[id]();
        result[id] = true;
      } catch (error) {
        result[id] = false;
        failed.push(id);
        // eslint-disable-next-line no-console -- the fallback surfaces this to the visitor
        console.error(`[AFTERLIGHT] failed to load scene "${id}"`, error);
      }
      done += 1;
      onProgress(done, ids.length, failed);
    }),
  );

  return result;
};
