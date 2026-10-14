import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';

import {
  CaptureBridge,
  CaptureReporter,
  ClockDriver,
  ExposureDriver,
  FpsSampler,
  ShaderWarmup,
} from '@/graphics/effects/CanvasRuntime';
import { PostFX } from '@/graphics/effects/PostFX';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { capabilities, useQualityBudget } from '@/graphics/capabilitiesContext';
import { useJourneyStore } from '@/store/useJourneyStore';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SCENE_CHUNK_IDS, SCENE_LOADERS } from './sceneLoader';
import { loadingRegistry } from '@/app/loadingRegistry';
import type { SceneId } from './sceneManifest';

const SCENE_COMPONENTS: Partial<Record<SceneId, React.LazyExoticComponent<React.ComponentType>>> = {
  void: lazy(() => SCENE_LOADERS.void()),
  fracture: lazy(() => SCENE_LOADERS.fracture()),
  threshold: lazy(() => SCENE_LOADERS.threshold()),
  echoes: lazy(() => SCENE_LOADERS.echoes()),
  afterlight: lazy(() => SCENE_LOADERS.afterlight()),
};

/** Detach callbacks for canvas-level listeners R3F does not clean up for us. */
const alCanvasRegistry: Array<() => void> = [];

/** Atmosphere per scene. Recreated only when the scene changes, never per frame. */
const SCENE_ATMOSPHERE: Record<SceneId, { fog: string; density: number }> = {
  awakening: { fog: '#050505', density: 0.04 },
  void: { fog: '#080a0d', density: 0.0135 },
  fracture: { fog: '#0a0b0e', density: 0.017 },
  threshold: { fog: '#070809', density: 0.029 },
  echoes: { fog: '#06070a', density: 0.019 },
  afterlight: { fog: '#030304', density: 0.034 },
};

/**
 * Renders exactly one scene — the active one. Nothing else is resident, so the
 * narrative advances without ever holding six scenes in memory or paying for
 * six draw loops. At the swap point both scenes are fully fogged, which hides
 * the cut.
 */
const SceneDirector = () => {
  const activeScene = useJourneyStore((s) => s.activeScene);
  const Component = SCENE_COMPONENTS[activeScene];
  if (!Component) return null;
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
};

const SceneAtmosphere = ({ scene }: { scene: SceneId }) => {
  const { fog, density } = SCENE_ATMOSPHERE[scene];
  return (
    <>
      {/* Fog + background for whichever scene is mounted. Rebuilt on scene
          change only — never inside the frame loop. */}
      <fogExp2 attach="fog" args={[fog, density]} />
      <color attach="background" args={[fog]} />
    </>
  );
};

/**
 * The film's single WebGL surface.
 *
 * One canvas for the whole journey — not one per scene. Scenes mount and
 * unmount inside it as the narrative advances; the DOM above it carries the
 * text, the navigation, the settings and the no-WebGL fallback.
 */
export const JourneyCanvas = ({ className }: { className?: string }) => {
  const budget = useQualityBudget();
  const hidden = usePageVisibility();
  const pauseWhenHidden = useSettingsStore((s) => s.pauseWhenHidden);
  const entered = useJourneyStore((s) => s.entered);
  const activeScene = useJourneyStore((s) => s.activeScene);
  const [contextLost, setContextLost] = useState(false);

  const suspended = pauseWhenHidden && hidden;
  const dpr: [number, number] = [1, budget.dpr];

  if (!capabilities.webgl || contextLost) return null;

  return (
    <div className={className} data-testid="journey-canvas">
      <Canvas
        frameloop={suspended ? 'never' : 'always'}
        dpr={dpr}
        gl={{
          antialias: budget.highPost,
          alpha: false,
          stencil: false,
          depth: true,
          powerPreference: 'high-performance',
          // CAPTURE re-renders on demand and snapshots the buffer in the same
          // task, so normal playback does not pay for preserveDrawingBuffer.
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ fov: 42, near: 0.1, far: 900, position: [0, 3, 18] }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
          loadingRegistry.complete(
            'webgl',
            gl.capabilities.isWebGL2 ? 'WebGL2 context granted' : 'WebGL1 context granted',
          );

          const canvas = gl.domElement;
          const onLost = (event: Event): void => {
            // Preventing the default lets the browser attempt restoration.
            event.preventDefault();
            setContextLost(true);
          };
          const onRestored = (): void => setContextLost(false);
          canvas.addEventListener('webglcontextlost', onLost, false);
          canvas.addEventListener('webglcontextrestored', onRestored, false);
          // The canvas outlives React's cleanup in R3F, so the detach function
          // is parked in a module list and never leaks a listener.
          alCanvasRegistry.push(() => {
            canvas.removeEventListener('webglcontextlost', onLost);
            canvas.removeEventListener('webglcontextrestored', onRestored);
          });
        }}
      >
        <SceneAtmosphere scene={activeScene} />
        <ClockDriver running={!suspended} />
        <ExposureDriver target={entered ? 1 : 0} />
        <FpsSampler />
        <ShaderWarmup />
        <CaptureBridge />
        <CaptureReporter />
        <SceneDirector />
        {/* A failure inside the post chain must degrade to plain rendering, not
            to a black screen — hence its own boundary. */}
        <ErrorBoundary>
          <PostFX />
        </ErrorBoundary>
      </Canvas>
    </div>
  );
};

/**
 * Streams every scene chunk and reports genuine per-chunk progress.
 *
 * Lives outside the canvas on purpose: with WebGL unavailable the canvas never
 * mounts, and the film still has to be able to reach the point where ENTER is
 * enabled. The loading sequence describes the whole application, not the parts
 * of it that happen to need a GPU.
 */
export const useScenePreload = (): void => {
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!capabilities.webgl) {
      // Nothing will ever compile or render: settle those tasks immediately so
      // the gate cannot wait on work that will not happen.
      loadingRegistry.skip('webgl', 'No WebGL context — static mode');
      loadingRegistry.skip('shaders', 'No shaders to compile');
    }

    let cancelled = false;
    loadingRegistry.start('scenes');
    void (async () => {
      let done = 0;
      await Promise.all(
        SCENE_CHUNK_IDS.map(async (id) => {
          try {
            await SCENE_LOADERS[id]();
          } catch (error) {
            // eslint-disable-next-line no-console -- the fallback is surfaced in the DOM
            console.warn(`[AFTERLIGHT] scene chunk "${id}" unavailable`, error);
          }
          done += 1;
          if (!cancelled) loadingRegistry.setProgress('scenes', done / SCENE_CHUNK_IDS.length);
        }),
      );
      if (!cancelled) loadingRegistry.complete('scenes', `${SCENE_CHUNK_IDS.length} chunks streamed`);
    })();

    return () => {
      cancelled = true;
    };
  }, []);
};
