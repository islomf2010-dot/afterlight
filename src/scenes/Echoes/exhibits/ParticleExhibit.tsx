import { useMemo } from 'react';
import { Vector3 } from 'three';

import { ParticleCloud } from '@/graphics/particles/ParticleCloud';
import { ExhibitPointer } from './ExhibitPointer';

export interface ParticleExhibitProps {
  /** Density multiplier — the film mounts this smaller than the laboratory. */
  density?: number;
  /** Distance from the camera at which the pointer influence sphere sits. */
  pointerDistance?: number;
  /** Wire the field to the shared laboratory parameters. */
  live?: boolean;
  /** Show the specimen armature (film) or hide it (tight lab framing). */
  showArmature?: boolean;
}

/**
 * STUDY I — PARTICLE FIELD.
 *
 * A torus-hugging cloud inside a wire armature. The interaction is the point:
 * the pointer displaces the field with a quadratic falloff plus a tangential
 * swirl, and every laboratory control (count, distortion, influence, speed)
 * changes something visible here, in Fracture and in the lab route.
 */
export const ParticleExhibit = ({
  density = 1,
  pointerDistance = 9,
  live = true,
  showArmature = true,
}: ParticleExhibitProps) => {
  const pointerTarget = useMemo(() => new Vector3(0, 0, -9999), []);

  return (
    <group>
      <ExhibitPointer target={pointerTarget} distance={pointerDistance} />
      <ParticleCloud
        count={Math.round(4200 * density)}
        extent={[7, 4.4, 7]}
        distribution="halo"
        seed={0x9a17c3}
        variant="field"
        color="#93a6b5"
        accent="#eef4f9"
        size={2.1}
        opacity={0.85}
        bounds={9}
        pointerRadius={4.2}
        liveControls={live}
        pointerTarget={pointerTarget}
      />
      {showArmature ? <Armature /> : null}
      <ambientLight intensity={0.12} color="#4a5865" />
      <directionalLight intensity={0.6} color="#c4d3e0" position={[5, 8, 6]} />
      <pointLight position={[0, 0, 4]} intensity={12} distance={22} decay={2} color="#dce7f0" />
    </group>
  );
};

/** Two thin rings at right angles: a specimen's mount and a scale reference. */
const Armature = () => (
  <>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[7.4, 0.035, 6, 128]} />
      <meshBasicMaterial color="#5d6b78" transparent opacity={0.4} depthWrite={false} />
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[5.2, 0.03, 6, 128]} />
      <meshBasicMaterial color="#5d6b78" transparent opacity={0.28} depthWrite={false} />
    </mesh>
  </>
);
