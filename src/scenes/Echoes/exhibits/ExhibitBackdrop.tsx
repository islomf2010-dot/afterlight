import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BackSide, Color, ShaderMaterial } from 'three';
import { clockField } from '@/animation/progressRegistry';
import { runtimeFlags } from '@/store/useSettingsStore';

export interface ExhibitBackdropProps {
  radius?: number;
  color?: string;
  intensity?: number;
}

/**
 * A rim-lit shell behind each exhibit.
 *
 * Three back-facing sphere shells with a rim term give the exhibits a sense of
 * an enclosing volume — a vitrine rather than a void — for the cost of three
 * tiny draw calls and no lights.
 */
export const ExhibitBackdrop = ({
  radius = 17,
  color = '#46525e',
  intensity = 0.4,
}: ExhibitBackdropProps) => {
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uColor: { value: new Color(color) },
        uIntensity: { value: intensity },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vNormalW = normalize(mat3(modelMatrix) * normal);
          vViewDir = normalize(cameraPosition - world.xyz);
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uTime;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        void main() {
          // Rim-weighted: brightest where the shell turns away from the eye.
          float rim = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewDir))), 2.6);
          float breathe = 0.92 + sin(uTime * 0.25) * 0.08;
          gl_FragColor = vec4(uColor, rim * uIntensity * breathe);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: BackSide,
    });
  }, [color, intensity]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    material.uniforms.uTime.value = clockField.elapsed;
    material.uniforms.uIntensity.value = intensity * runtimeFlags.exposure;
  });

  return (
    <mesh material={material} scale={radius} renderOrder={0}>
      <sphereGeometry args={[1, 24, 16]} />
    </mesh>
  );
};
