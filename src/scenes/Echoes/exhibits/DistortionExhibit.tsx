import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { DoubleSide, ShaderMaterial, Vector2, Vector3 } from 'three';

import { DISTORTION_FRAGMENT, DISTORTION_VERTEX } from '@/graphics/shaders/portal';
import { clockField, pointerField } from '@/animation/progressRegistry';
import { labParams } from '@/store/useLabStore';
import { runtimeFlags } from '@/store/useSettingsStore';
import { damp } from '@/utils/math';

export interface DistortionExhibitProps {
  /** Plane size in world units. */
  size?: number;
  /** Wire the warp to the shared laboratory parameters. */
  live?: boolean;
  /** Extra resolution for the domain warp (low tier drops the second octave). */
  highDetail?: boolean;
}

/**
 * STUDY II — DOMAIN-WARPED PROJECTION.
 *
 * The "source image" is generated rather than sampled: a horizon, the film's
 * monolith and a star field, warped twice by simplex noise. The pointer applies
 * a local radial lens on top of the warp, so dragging the cursor pulls the
 * image around like something under glass rather than merely shifting it.
 */
export const DistortionExhibit = ({
  size = 17,
  live = true,
  highDetail = true,
}: DistortionExhibitProps) => {
  const size3 = useThree((s) => s.size);
  const aspect = size3.width / Math.max(1, size3.height);
  const distortion = useRef(0.45);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDistortion: { value: 0.45 },
      uSpeed: { value: 1 },
      uPointer: { value: new Vector2(0, 0) },
      uPointerInfluence: { value: 1 },
      uAspect: { value: aspect },
      // vec3 uniforms must expose x/y/z for three's uniform setter.
      uInk: { value: new Vector3(0.018, 0.022, 0.028) },
      uPaper: { value: new Vector3(0.86, 0.88, 0.9) },
      uAberration: { value: highDetail ? 1 : 0 },
    }),
    [aspect, highDetail],
  );

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: uniforms as unknown as Record<string, { value: unknown }>,
        vertexShader: DISTORTION_VERTEX,
        fragmentShader: DISTORTION_FRAGMENT,
        side: DoubleSide,
      }),
    [uniforms],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    const target = live ? labParams.distortion : 0.45;
    // Damped so dragging the slider produces a visible swell rather than a cut.
    distortion.current = damp(distortion.current, target, 5, delta);

    uniforms.uTime.value = clockField.elapsed;
    uniforms.uDistortion.value = distortion.current * runtimeFlags.exposure;
    uniforms.uSpeed.value = runtimeFlags.reducedMotion ? 0 : labParams.speed * clockField.running;
    uniforms.uPointerInfluence.value = live ? labParams.pointerInfluence : 0.8;
    uniforms.uPointer.value.x = pointerField.present ? pointerField.x : 99;
    uniforms.uPointer.value.y = pointerField.present ? pointerField.y : 99;
    uniforms.uAspect.value = aspect;
  });

  return (
    <group>
      <mesh material={material} renderOrder={1}>
        <planeGeometry args={[size, size]} />
      </mesh>
      <Frame size={size + 1.2} />
      <ambientLight intensity={0.08} color="#39434d" />
    </group>
  );
};

/** A hairline frame around the projection so it reads as an instrument. */
const Frame = ({ size }: { size: number }) => {
  const half = size / 2;
  const thickness = 0.06;
  const depth = 0.06;
  return (
    <group position={[0, 0, -0.2]}>
      {[
        [0, half, size, thickness],
        [0, -half, size, thickness],
        [-half, 0, thickness, size],
        [half, 0, thickness, size],
      ].map(([x, y, w, h], index) => (
        <mesh key={index} position={[x, y, 0]}>
          <boxGeometry args={[w, h, depth]} />
          <meshBasicMaterial color="#4c5a67" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
};
