import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';

import {
  CaptureBridge,
  CaptureReporter,
  ClockDriver,
  ExposureDriver,
  FpsSampler,
} from '@/graphics/effects/CanvasRuntime';
import { PostFX } from '@/graphics/effects/PostFX';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { StaticBackdrop } from '@/components/fallback/WebGLFallback';
import { capabilities, useQualityBudget } from '@/graphics/capabilitiesContext';
import { labParams, useLabStore, type ExhibitId } from '@/store/useLabStore';
import { ParticleExhibit } from '@/scenes/Echoes/exhibits/ParticleExhibit';
import { DistortionExhibit } from '@/scenes/Echoes/exhibits/DistortionExhibit';
import { PortalExhibit } from '@/scenes/Echoes/exhibits/PortalExhibit';
import { ExhibitBackdrop } from '@/scenes/Echoes/exhibits/ExhibitBackdrop';

/** Studio backdrop for each study — each exhibit gets its own air. */
const STUDIO: Record<ExhibitId, { fog: string; density: number }> = {
  particles: { fog: '#070a0d', density: 0.016 },
  shaders: { fog: '#08090b', density: 0.012 },
  portal: { fog: '#06080a', density: 0.018 },
};

export interface LabCanvasProps {
  exhibit: ExhibitId;
}

/**
 * The laboratory's viewport.
 *
 * A dedicated canvas (separate from the film) so a lab experiment can never
 * disturb the film's camera, progress or render loop — and so leaving the lab
 * tears the context down cleanly.
 */
export const LabCanvas = ({ exhibit }: LabCanvasProps) => {
  const budget = useQualityBudget();
  const paused = useLabStore((s) => s.paused);
  const params = useLabStore((s) => s.params);
  const [contextLost, setContextLost] = useState(false);

  // The fog is driven by the lab's FOG control, so the control is real.
  const fog = STUDIO[exhibit];

  if (!capabilities.webgl || contextLost) return <StaticBackdrop active />;

  return (
    <ErrorBoundary>
      <div className="h-full w-full">
        <Canvas
          dpr={[1, budget.dpr]}
          frameloop="always"
          gl={{
            antialias: budget.highPost,
            alpha: false,
            stencil: false,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
          }}
          camera={{ fov: 42, near: 0.1, far: 200, position: [0, 1.6, 15] }}
          onCreated={({ gl: renderer }) => {
            renderer.toneMapping = ACESFilmicToneMapping;
            const canvas = renderer.domElement;
            const onLost = (event: Event): void => {
              // Preventing the default lets the browser attempt restoration;
              // until it does, we show the CSS backdrop instead of a black box.
              event.preventDefault();
              setContextLost(true);
            };
            const onRestored = (): void => setContextLost(false);
            canvas.addEventListener('webglcontextlost', onLost, false);
            canvas.addEventListener('webglcontextrestored', onRestored, false);
          }}
        >
          <color attach="background" args={[fog.fog]} />
          <fogExp2 attach="fog" args={[fog.fog, params.fogDensity * 0.04]} />

          <ClockDriver running={!paused} />
          {/* The lab has no intro to fade up from, but it shares the film's
              exposure model — without this every exhibit that multiplies by
              `runtimeFlags.exposure` renders at zero opacity. */}
          <ExposureDriver target={1} />
          <FpsSampler />
          <CaptureBridge />
          <CaptureReporter />

          <Suspense fallback={null}>
            <LabStage exhibit={exhibit} density={budget.density} highDetail={budget.highPost} />
          </Suspense>

          <ErrorBoundary>
            <PostFX />
          </ErrorBoundary>
        </Canvas>
      </div>
    </ErrorBoundary>
  );
};

/**
 * Mounts exactly one study. Switching studies remounts this subtree, which
 * disposes the previous study's geometries and materials — the same guarantee a
 * route change gives you, without paying for a navigation.
 */
const LabStage = ({ exhibit, density, highDetail }: { exhibit: ExhibitId; density: number; highDetail: boolean }) => {
  const params = useLabStore((s) => s.params);
  useEffect(() => {
    // Keep the imperative mirror honest even if a future code path writes to the
    // store without the setter (e.g. a restored session).
    Object.assign(labParams, params);
  }, [params]);

  return (
    <group>
      <ExhibitBackdrop radius={16} intensity={0.34} />
      {exhibit === 'particles' ? <ParticleExhibit density={density} pointerDistance={10} live /> : null}
      {exhibit === 'shaders' ? <DistortionExhibit size={17} live highDetail={highDetail} /> : null}
      {exhibit === 'portal' ? <PortalExhibit size={17} live mode="proximity" /> : null}
    </group>
  );
};
