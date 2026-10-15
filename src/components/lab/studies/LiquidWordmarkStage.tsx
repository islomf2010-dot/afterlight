import { LiquidWordmark } from '@/graphics/liquidlogo/LiquidWordmark';
import { useQualityBudget } from '@/graphics/capabilitiesContext';
import { pointerField } from '@/animation/progressRegistry';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';

/**
 * The liquid-metal study, staged for the laboratory's camera.
 *
 * The wordmark plane is sized to the viewport inside `LiquidWordmark`, so the
 * stage only has to place it and let the pointer push the material around. It
 * sits in front of the camera rather than inside the scene's fog: a metal
 * surface that fogged out would not read as metal.
 */
export const LiquidWordmarkStage = () => {
  const budget = useQualityBudget();
  const group = useRef<Group>(null);

  // The pointer tilts the wordmark very slightly. A little parallax is enough
  // to read as a physical object; more would fight the camera.
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = pointerField.targetX * 0.12;
    g.rotation.x = -pointerField.targetY * 0.08;
  });

  return (
    <group ref={group} position={[0, -0.9, 2]}>
      <LiquidWordmark
        text="AFTERLIGHT"
        fill={0.44}
        params={{
          // The loop is the single most expensive term in this material, so it
          // follows the quality budget rather than being fixed.
          iterations: budget.density < 0.5 ? 8 : 12,
        }}
      />
    </group>
  );
};

export default LiquidWordmarkStage;