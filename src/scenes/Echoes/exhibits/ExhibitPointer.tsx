import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { pointerField } from '@/animation/progressRegistry';

/**
 * Maps the global pointer field onto a world-space point in front of an
 * exhibit, writing into a shared vector that the exhibit's shaders read.
 *
 * One vector per exhibit, pre-allocated by the caller and mutated in place —
 * the alternative (a React ref per pointer move) would re-render the canvas
 * tree at input frequency.
 */
export const ExhibitPointer = ({
  target,
  distance = 9,
  enabled = true,
}: {
  target: Vector3;
  distance?: number;
  enabled?: boolean;
}) => {
  const scratch = useMemo(() => new Vector3(), []);

  useFrame(({ camera }) => {
    if (!enabled) return;
    if (!pointerField.present) {
      // Park the influence point far away when the pointer is absent so the
      // exhibit settles instead of holding the last position forever.
      target.set(0, 0, -9999);
      return;
    }
    scratch
      .set(pointerField.x, pointerField.y, -1)
      .applyQuaternion(camera.quaternion)
      .normalize()
      .multiplyScalar(distance)
      .add(camera.position);
    target.lerp(scratch, 0.22);
  });

  return null;
};
