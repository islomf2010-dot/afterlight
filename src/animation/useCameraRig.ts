import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, type PerspectiveCamera, type Camera } from 'three';
import { damp, saturate, smootherstep } from '@/utils/math';
import { pointerField } from './progressRegistry';

export interface CameraKeyframe {
  position: readonly [number, number, number];
  lookAt: readonly [number, number, number];
  fov?: number;
  /** Radians of camera roll, used sparingly to sell a drifting handheld feel. */
  roll?: number;
}

export interface CameraRigOptions {
  frames: CameraKeyframe[];
  /** Normalised 0→1 progress along the path (ignored if `getProgress` is set). */
  progress?: number;
  /**
   * Imperative progress source. Scenes pass a getter that reads the scroll
   * registry, so the camera never depends on a React render having happened.
   */
  getProgress?: () => number;
  /** Metres of camera offset at the extremes of the pointer vector. */
  parallax?: number;
  /** Extra drift from the pointer on the camera's local right/up axes. */
  parallaxLook?: number;
  /** Exponential smoothing rate; higher tracks the scroll more tightly. */
  damping?: number;
  /** Keep the subject framed on tall/narrow viewports. */
  aspectAdjust?: boolean;
  enabled?: boolean;
}

/**
 * Drives a camera along a keyframed path from a single normalised progress
 * value.
 *
 * Deliberately allocation-free in the frame loop: every vector, quaternion and
 * array here is created once in `useMemo`. This hook is the single place where
 * scroll progress becomes camera motion, so pointer parallax, damping and
 * responsive framing behave identically in every scene.
 */
export const useCameraRig = (options: CameraRigOptions): void => {
  const {
    frames,
    progress = 0,
    getProgress,
    parallax = 1.2,
    parallaxLook = 0.6,
    damping = 3.4,
    aspectAdjust = true,
    enabled = true,
  } = options;

  const camera = useThree((s) => s.camera) as Camera & Partial<PerspectiveCamera>;
  const smoothed = useRef({ progress, x: 0, y: 0 });
  const initialised = useRef(false);

  const scratch = useMemo(
    () => ({
      position: new Vector3(),
      target: new Vector3(),
      right: new Vector3(),
      up: new Vector3(0, 1, 0),
      offset: new Vector3(),
      forward: new Vector3(),
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!enabled || frames.length === 0) return;

    // Damped progress: scrubbing the scrollbar produces a large jump, and the
    // camera should still arrive smoothly rather than teleporting.
    const target = saturate(getProgress ? getProgress() : progress);
    const state = smoothed.current;
    state.progress = initialised.current ? damp(state.progress, target, damping, delta) : target;
    initialised.current = true;

    const p = saturate(state.progress);
    const segmentCount = frames.length - 1;
    const scaled = p * segmentCount;
    const index = Math.min(Math.floor(scaled), segmentCount - 1);
    const local = scaled - index;
    // Smootherstep between keyframes removes the mechanical "stop at each
    // waypoint" feel of linear interpolation.
    const t = smootherstep(local);

    const a = frames[Math.max(0, index)];
    const b = frames[Math.min(index + 1, frames.length - 1)];

    scratch.position.set(
      a.position[0] + (b.position[0] - a.position[0]) * t,
      a.position[1] + (b.position[1] - a.position[1]) * t,
      a.position[2] + (b.position[2] - a.position[2]) * t,
    );
    scratch.target.set(
      a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * t,
      a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * t,
      a.lookAt[2] + (b.lookAt[2] - a.lookAt[2]) * t,
    );

    const fov = (a.fov ?? 45) + ((b.fov ?? 45) - (a.fov ?? 45)) * t;
    const roll = (a.roll ?? 0) + ((b.roll ?? 0) - (a.roll ?? 0)) * t;

    // --- Pointer parallax ----------------------------------------------------
    // Smoothed in normalised screen space, then applied along the camera's own
    // basis so "right" always means right regardless of where the camera looks.
    state.x = damp(state.x, pointerField.x, 2.6, delta);
    state.y = damp(state.y, pointerField.y, 2.6, delta);

    scratch.forward.copy(scratch.target).sub(scratch.position).normalize();
    scratch.right.crossVectors(scratch.forward, scratch.up).normalize();

    scratch.offset
      .copy(scratch.right)
      .multiplyScalar(state.x * parallax)
      .addScaledVector(scratch.up, -state.y * parallax * 0.62);

    camera.position.copy(scratch.position).add(scratch.offset);
    scratch.target.addScaledVector(scratch.right, -state.x * parallaxLook);
    scratch.target.addScaledVector(scratch.up, state.y * parallaxLook * 0.5);

    // --- Responsive framing --------------------------------------------------
    // Portrait viewports keep the same *vertical* field of view, so a tall
    // subject does not get any taller — and widening the lens (the obvious
    // reflex) only makes it smaller. The correct move is to dolly in toward
    // the subject instead, which preserves its vertical framing while keeping
    // the horizontal extent in shot.
    let fovScale = 1;
    if (aspectAdjust) {
      const persp = camera as PerspectiveCamera;
      const aspect = persp.aspect || 1;
      if (aspect < 1) {
        const shortfall = 1 - aspect;
        fovScale = 1 + shortfall * 0.22;
        const distance = camera.position.distanceTo(scratch.target);
        scratch.offset.addScaledVector(scratch.forward, distance * shortfall * 0.55);
      } else if (aspect > 2.1) {
        // Ultrawide: ease back so the subject does not sit in a letterbox.
        scratch.offset.addScaledVector(scratch.forward, -2.2 * (aspect - 2.1));
      }
    }

    camera.lookAt(scratch.target);
    if (roll !== 0) camera.rotateZ(roll);

    const persp = camera as PerspectiveCamera;
    const nextFov = fov * fovScale;
    if (Math.abs(persp.fov - nextFov) > 0.001) {
      persp.fov = nextFov;
      persp.updateProjectionMatrix();
    }
  });
};
