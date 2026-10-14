import { useEffect } from 'react';
import { pointerField, resetPointerField } from '@/animation/progressRegistry';

/**
 * Writes the global pointer/touch state that every scene reads.
 *
 * Mounted once at the app root. Listeners are passive and write to a plain
 * object — never to React state — so moving the mouse cannot trigger a single
 * re-render.
 *
 * Touch is deliberately *not* mapped to the parallax vector: on mobile a drag
 * is a scroll gesture, and hijacking it as a look-around input fights the
 * native scroll the brief explicitly asks us to preserve. Touch instead feeds
 * `touchPresent`, which scenes use for tap-only affordances.
 */
export const usePointerField = (): void => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastX = 0;
    let lastY = 0;
    let lastT = 0;

    const onMove = (event: PointerEvent): void => {
      if (event.pointerType === 'touch') return;
      const now = performance.now();
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      pointerField.targetX = x;
      pointerField.targetY = -y; // screen-space Y is inverted
      if (lastT > 0) {
        const dt = Math.max(now - lastT, 1);
        pointerField.vx = (x - lastX) / dt * 1000;
        pointerField.vy = (-y - lastY) / dt * 1000;
      }
      lastX = x;
      lastY = -y;
      lastT = now;
      pointerField.activity = 1;
      pointerField.lastMoveAt = now;
      if (event.pointerType === 'mouse') pointerField.present = true;
    };

    const onLeave = (): void => {
      pointerField.targetX = 0;
      pointerField.targetY = 0;
      pointerField.activity = 0;
    };

    const onDown = (): void => {
      pointerField.activity = 1;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      resetPointerField();
    };
  }, []);
};
