import { Suspense, useCallback, useEffect, useState } from 'react';
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
import { CanvasLifecycle } from '@/graphics/effects/CanvasLifecycle';
import { labParams, useLabStore, type ExhibitId } from '@/store/useLabStore';
import { ParticleExhibit } from '@/scenes/Echoes/exhibits/ParticleExhibit';
import { DistortionExhibit } from '@/scenes/Echoes/exhibits/DistortionExhibit';
import { PortalExhibit } from '@/scenes/Echoes/exhibits/PortalExhibit';
import { ExhibitBackdrop } from '@/scenes/Echoes/exhibits/ExhibitBackdrop';
import { GradientStudy } from './studies/GradientStudy';
import { LiquidGlassSurface } from './studies/LiquidGlassSurface';
import { LiquidWordmarkStage } from './studies/LiquidWordmarkStage';
import type { PlaygroundId } from './playground';

/** Studio backdrop for each study — each exhibit gets its own air. */
const STUDIO: Record<ExhibitId, { fog: string; density: number }> = {
  particles: { fog: '#070a0d', density: 0.016 },
  shaders: { fog: '#08090b', density: 0.012 },
  portal: { fog: '#06080a', density: 0.018 },
};

/** The library experiments get their own air so they never read as a film scene. */
const PLAYGROUND_STUDIO: Record<PlaygroundId, { fog: string; density: number }> = {
  liquid: { fog: '#050607', density: 0.006 },
  gradient: { fog: '#050505', density: 0.004 },
  glass: { fog: '#08090b', density: 0.01 },
};

export interface LabCanvasProps {
  exhibit: ExhibitId;
  /** Library experiment, if this canvas is showing one instead of a film study. */
  playground?: PlaygroundId;
}

/**
 * The laboratory's viewport.
 *
 * A dedicated canvas (separate from the film) so a lab experiment can never
 * disturb the film's camera, progress or render loop — and so leaving the lab
 * tears the context down cleanly.
 */
export const LabCanvas = ({ exhibit, playground }: LabCanvasProps) => {
  const budget = useQualityBudget();
  const paused = useLabStore((s) => s.paused);
  const params = useLabStore((s) => s.params);
  const [contextLost, setContextLost] = useState(false);

  // Stable identities: these feed an effect's dependency list.
  const handleContextLost = useCallback(() => setContextLost(true), []);
  const handleContextRestored = useCallback(() => setContextLost(false), []);

  // The fog is driven by the lab's FOG control, so the control is real.
  const fog = playground ? PLAYGROUND_STUDIO[playground] : STUDIO[exhibit];

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
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
          }}
        >
          <CanvasLifecycle
            onContextLost={handleContextLost}
            onContextRestored={handleContextRestored}
          />
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
            <LabStage
              exhibit={exhibit}
              playground={playground}
              density={budget.density}
              highDetail={budget.highPost}
            />
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
const LabStage = ({
  exhibit,
  playground,
  density,
  highDetail,
}: {
  exhibit: ExhibitId;
  playground?: PlaygroundId;
  density: number;
  highDetail: boolean;
}) => {
  const params = useLabStore((s) => s.params);
  useEffect(() => {
    // Keep the imperative mirror honest even if a future code path writes to the
    // store without the setter (e.g. a restored session).
    Object.assign(labParams, params);
  }, [params]);

  // A playground experiment replaces the stage entirely rather than sharing
  // it: these are not film exhibits and must not inherit their fog or backdrop.
  if (playground) {
    return (
      <group>
        {playground === 'gradient' ? <GradientStudy /> : null}
        {playground === 'glass' ? <LiquidGlassSurface /> : null}
        {playground === 'liquid' ? <LiquidWordmarkStage /> : null}
      </group>
    );
  }

  return (
    <group>
      <ExhibitBackdrop radius={16} intensity={0.34} />
      {exhibit === 'particles' ? <ParticleExhibit density={density} pointerDistance={10} live /> : null}
      {exhibit === 'shaders' ? <DistortionExhibit size={17} live highDetail={highDetail} /> : null}
      {exhibit === 'portal' ? <PortalExhibit size={17} live mode="proximity" /> : null}
    </group>
  );
};
