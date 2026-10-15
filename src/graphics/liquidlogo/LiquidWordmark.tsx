import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ShaderMaterial, type PerspectiveCamera, type Texture } from 'three';

import {
  LIQUID_METAL_COLOURS,
  LIQUID_METAL_DEFAULTS,
  LIQUID_METAL_FRAGMENT,
  LIQUID_METAL_VERTEX,
  type LiquidMetalParams,
} from './liquidMetal';
import { createTextMask } from './createTextMask';
import { clockField } from '@/animation/progressRegistry';
import { runtimeFlags } from '@/store/useSettingsStore';
import { useQualityBudget } from '@/graphics/capabilitiesContext';

export interface LiquidWordmarkProps {
  text?: string;
  params?: Partial<LiquidMetalParams>;
  /** Uniforms exposed to the laboratory so the experiment can drive them. */
  overrides?: Partial<LiquidMetalParams>;
  /** Seconds added per second. Zero freezes the material without unmounting. */
  speedScale?: number;
  /**
   * Width / height of the plane. Must agree with the generated mask's aspect:
   * the mask is sampled in UV space, so a mismatched plane stretches the glyphs.
   */
  aspect?: number;
  /** Fraction of the viewport width the wordmark occupies. */
  fill?: number;
  /**
   * Distance from the camera to this plane, in world units.
   *
   * The plane cannot be sized in pixels: three's world units have no relation
   * to them, so a "pixel" size produces a plane many times the height of the
   * frustum and the shader ends up displaying a hugely magnified crop of the
   * mask. The plane is therefore derived from the camera's own field of view.
   */
  distance?: number;
  className?: string;
}

/**
 * A liquid-metal wordmark rendered inside AFTERLIGHT's existing canvas.
 *
 * Deliberately *not* a `<Canvas>` of its own: the film already owns one WebGL
 * context and the brief — and this project's own architecture — both require
 * that adding an effect never adds a context. Mounting it inside whatever
 * canvas is already open costs one mesh and no extra renderer.
 *
 * Time comes from `runtimeFlags`, the same shared clock every scene reads, so
 * Pause, the animation-speed control and reduced motion apply here for free.
 */
export const LiquidWordmark = ({
  text = 'AFTERLIGHT',
  params,
  overrides,
  speedScale = 1,
  aspect = 4,
  fill = 0.52,
  distance = 13,
}: LiquidWordmarkProps) => {
  const budget = useQualityBudget();
  const size = useThree((state) => state.size);
  const fov = useThree((state) => {
    const cam = state.camera as PerspectiveCamera;
    return cam.isPerspectiveCamera ? cam.fov : 42;
  });
  const materialRef = useRef<ShaderMaterial>(null);
  const [mask, setMask] = useState<Texture | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resolved = useMemo<LiquidMetalParams>(
    () => ({ ...LIQUID_METAL_DEFAULTS, ...params, ...overrides }),
    [params, overrides],
  );

  // The mask is generated, not downloaded. Failure is reported rather than
  // left as an invisible plane.
  useEffect(() => {
    let cancelled = false;
    let created: Texture | null = null;

    void createTextMask({ text, aspect })
      .then((texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }
        created = texture;
        setMask(texture);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(cause instanceof Error ? cause.message : 'mask generation failed');
      });

    return () => {
      cancelled = true;
      // Release on unmount. Without this the texture survives the component and
      // every replay leaks one 512×N RGBA buffer.
      created?.dispose();
    };
  }, [text, aspect]);

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new Float32Array([size.width, size.height]) },
      uTime: { value: 0 },
      uMask: { value: mask },
      uSpeed: { value: resolved.speed },
      uIterations: { value: resolved.iterations },
      uScale: { value: resolved.scale },
      uDotFactor: { value: resolved.dotFactor },
      uVOffset: { value: resolved.vOffset },
      uIntensity: { value: resolved.intensity },
      uExpFactor: { value: resolved.expFactor },
      uColorFactors: { value: new Float32Array([0.16, 0.12, 0.2, 0]) },
      uColorShift: { value: 0.06 },
      uMaskScale: { value: resolved.maskScale },
      uMaskOpacity: { value: resolved.maskOpacity },
      uEdgeStrength: { value: resolved.edgeStrength },
      uNoiseAmount: { value: resolved.noiseAmount },
      uInk: { value: new Float32Array(LIQUID_METAL_COLOURS.ink) },
      uHighlight: { value: new Float32Array(LIQUID_METAL_COLOURS.highlight) },
    }),
    // Uniform objects are recreated when the mask or the resolved params
    // change; three uploads whatever it is handed.
    [mask, resolved, size.width, size.height],
  );

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;
    const u = material.uniforms;
    (u.uResolution.value as Float32Array).set([size.width, size.height]);
    // Shared clock, plus the project's own reduced-motion convention (the same
    // pair VoidScene uses): Pause stops `elapsed`, reduced motion zeroes speed.
    // A wordmark that keeps rippling when the visitor asked for stillness is a
    // regression, not a feature.
    u.uTime.value = clockField.elapsed * speedScale;
    u.uSpeed.value = runtimeFlags.reducedMotion ? 0 : resolved.speed;
    // The low tier runs a shorter integration: the banding is still legible and
    // the loop is the single most expensive thing in this material.
    u.uIterations.value = budget.density < 0.5 ? Math.min(resolved.iterations, 8) : resolved.iterations;
    u.uScale.value = resolved.scale;
    u.uIntensity.value = resolved.intensity;
    u.uEdgeStrength.value = resolved.edgeStrength;
    u.uNoiseAmount.value = resolved.noiseAmount;
    u.uMaskScale.value = resolved.maskScale;
  });

  if (error) return null;

  // Derive the plane from the frustum so `fill` means "fraction of the visible
  // width" and nothing else.
  const visibleHeight = 2 * distance * Math.tan((fov * Math.PI) / 360);
  const visibleWidth = visibleHeight * (size.width / Math.max(size.height, 1));
  const width = visibleWidth * fill;
  const height = width / aspect;

  return (
    <mesh frustumCulled={false} dispose={null}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={LIQUID_METAL_VERTEX}
        fragmentShader={LIQUID_METAL_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};

export default LiquidWordmark;