import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Owns the lifetime of the canvas element itself.
 *
 * R3F creates and destroys the `<canvas>` behind `<Canvas>`, but a DOM element
 * outlives React's commit phase, so listeners attached from `onCreated` are not
 * cleaned up by unmounting the tree. Mounting this component *inside* the
 * canvas gives us a real effect cleanup that runs when the canvas goes away.
 *
 * The previous approach — pushing detach closures onto a module-level array —
 * looked like cleanup but was not: the array was never drained, so every visit
 * to the film retained its canvas and its listeners for the life of the page.
 */
export const CanvasLifecycle = ({
  onContextLost,
  onContextRestored,
}: {
  onContextLost: () => void;
  onContextRestored: () => void;
}) => {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleLost = (event: Event): void => {
      // Preventing the default is what allows the browser to attempt a restore
      // rather than immediately dropping the context for good.
      event.preventDefault();
      onContextLost();
    };
    const handleRestored = (): void => onContextRestored();

    canvas.addEventListener('webglcontextlost', handleLost, false);
    canvas.addEventListener('webglcontextrestored', handleRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost, false);
      canvas.removeEventListener('webglcontextrestored', handleRestored, false);
    };
  }, [gl, onContextLost, onContextRestored]);

  return null;
};
