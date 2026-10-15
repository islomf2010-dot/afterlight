import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ShaderGradient, presets } from '@shadergradient/react';
import { Mesh } from 'three';

import { clockField } from '@/animation/progressRegistry';
import { runtimeFlags } from '@/store/useSettingsStore';
import { useQualityBudget } from '@/graphics/capabilitiesContext';
import { applyShaderGradientThreeCompat } from './shadergradientThreeCompat';

export interface GradientParams {
  color1: string;
  color2: string;
  color3: string;
  speed: number;
  density: number;
  strength: number;
  frequency: number;
  type: 'plane' | 'sphere';
}

export const GRADIENT_DEFAULTS: GradientParams = {
  color1: '#050505',
  color2: '#151719',
  color3: '#BFC5CA',
  speed: 0.6,
  density: 1.1,
  strength: 0.32,
  frequency: 1.4,
  type: 'plane',
};

/** Swatches from AFTERLIGHT's own palette, plus the package's own presets. */
export const GRADIENT_PRESETS: { id: string; label: string; props: Partial<GradientParams> }[] = [
  { id: 'obsidian', label: 'Obsidian', props: { color1: '#050505', color2: '#151719', color3: '#BFC5CA' } },
  { id: 'halo', label: 'Halo', props: { color1: '#151719', color2: '#BFC5CA', color3: '#F3F2EE' } },
  { id: 'sea', label: 'Sea', props: { color1: '#050505', color2: '#0d1418', color3: '#BFC5CA' } },
  { id: 'dawn', label: 'Dawn', props: { color1: '#151719', color2: '#6f767d', color3: '#F3F2EE' } },
];

/** Bounds for every numeric parameter, so a hostile value cannot be passed on. */
export const GRADIENT_RANGES = {
  speed: [0, 3] as const,
  density: [0.1, 3] as const,
  strength: [0, 1] as const,
  frequency: [0.1, 4] as const,
};

/**
 * `@shadergradient/react`, mounted inside the laboratory's existing canvas.
 *
 * The package ships two entry points. `ShaderGradientCanvas` creates its own
 * `<Canvas>` — a second WebGL context, which this project does not allow a
 * decorative layer to create. `ShaderGradient` renders a plain `<mesh>`, so it
 * lives in the context that is already open and costs one draw call.
 *
 * Subcomponents deliberately switched off:
 *
 * - `grain="off"` — its `<PostProcessing>` would install a second
 *   `EffectComposer` over the laboratory's, and the two would fight.
 * - `toggleAxis={false}` — debug gizmo.
 * - `Controls` is mounted unconditionally by the package and grabs the shared
 *   camera through `useThree`, driving it with `camera-controls`. The film's
 *   camera is scroll-driven; a second controller writing the same object breaks
 *   both. This study is therefore lab-only and never mounted in the film, where
 *   the camera rig is authoritative.
 *
 * Time is taken over from the package. It only advances `uTime` while
 * `animate="on"`, using its own local clock, which would ignore PAUSE and
 * reduced motion — so AFTERLIGHT writes `uTime` itself each frame from the
 * shared clock instead.
 */
export const GradientStudy = ({ overrides }: { overrides?: Partial<GradientParams> }) => {
  const budget = useQualityBudget();
  const scene = useThree((state) => state.scene);
  const meshRef = useRef<Mesh | null>(null);

  const resolved = useMemo<GradientParams>(
    () => ({ ...GRADIENT_DEFAULTS, ...overrides }),
    [overrides],
  );

  // Must run before the package compiles any material — see the shim's notes.
  useEffect(() => {
    applyShaderGradientThreeCompat();
  }, []);

  useFrame(() => {
    const mesh = meshRef.current ?? scene.getObjectByName('shadergradient-mesh');
    if (!(mesh instanceof Mesh)) return;
    meshRef.current = mesh;
    // userData.uTime is the same uniform object the package passes in, so
    // writing here is writing the material's own uniform.
    const uniform = mesh.material.userData?.uTime as { value: number } | undefined;
    if (!uniform) return;
    uniform.value = runtimeFlags.reducedMotion ? 0 : clockField.elapsed;
  });

  return (
    <ShaderGradient
      color1={resolved.color1}
      color2={resolved.color2}
      color3={resolved.color3}
      type={resolved.type}
      shader="cosmic"
      uSpeed={resolved.speed}
      uDensity={budget.density < 0.5 ? resolved.density * 0.7 : resolved.density}
      uStrength={resolved.strength}
      uFrequency={resolved.frequency}
      /*
        "off" is load-bearing, not a default. With "on" the package runs its own
        local clock and writes uTime from its own useFrame, which runs after
        this component's and overwrites the value written there — so the study
        kept animating even under reduced motion. Verified: the frame delta
        under reduced motion was indistinguishable from running.
      */
      animate="off"
      grain="off"
      toggleAxis={false}
      lightType="3d"
      brightness={0.4}
      positionX={0}
      positionY={0}
      positionZ={0}
      enableTransition={false}
      enableCameraUpdate={false}
    />
  );
};

export { presets };