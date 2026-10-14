import { useCallback } from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useQualityBudget } from '@/graphics/capabilitiesContext';
import { useLabStore } from '@/store/useLabStore';
import { activeComposer } from './CanvasRuntime';

/**
 * The film's post chain.
 *
 * Deliberately minimal: a threshold bloom to give the light sources a halo in
 * the fog, a soft vignette to hold the eye in frame, and a whisper of grain to
 * match the DOM overlay. Nothing here is decorative-only — removing any of the
 * three measurably changes how the scenes read.
 *
 * The whole chain is skipped on the low tier (an extra fullscreen resolve is
 * the single most expensive thing on an integrated GPU). The lab's BLOOM
 * control feeds the same effect, so the laboratory and the film are one system.
 */
export const PostFX = () => {
  const budget = useQualityBudget();
  // Subscribing here (not in useFrame) means the composer only re-renders when
  // the slider actually moves.
  const bloom = useLabStore((s) => s.params.bloom);

  // Publish the composer so CAPTURE can re-render through the same pipeline
  // the visitor is looking at, instead of capturing an unprocessed frame.
  const attach = useCallback((instance: unknown) => {
    activeComposer.current = (instance ?? null) as typeof activeComposer.current;
  }, []);

  if (!budget.post) return null;

  return (
    <EffectComposer ref={attach as never} multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={bloom}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.34}
        mipmapBlur
        radius={budget.highPost ? 0.78 : 0.62}
        levels={budget.highPost ? 7 : 5}
      />
      <Vignette offset={0.26} darkness={0.7} eskil={false} blendFunction={BlendFunction.NORMAL} />
      <Noise premultiply opacity={0.026} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
};
