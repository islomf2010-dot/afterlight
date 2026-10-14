/**
 * Vitest setup.
 *
 * jsdom has no WebGL implementation and prints a multi-line "Not implemented"
 * stack for every `getContext('webgl')` call. AFTERLIGHT's capability probe is
 * *supposed* to survive that (it is the same path a browser without WebGL
 * takes), so rather than silence the output we stub `getContext` to return
 * `null` — which is exactly what a real WebGL-less browser returns, and keeps
 * the test output readable.
 */

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  writable: true,
  value: function getContext(): null {
    return null;
  },
});
