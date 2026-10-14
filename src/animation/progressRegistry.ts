/**
 * Imperative scroll-progress registry.
 *
 * ScrollTrigger writes normalised 0→1 progress here every frame; `useFrame`
 * reads it. Deliberately *outside* React: routing scroll position through
 * component state would re-render the tree at 60Hz, which is exactly the
 * class of bug this architecture exists to prevent.
 *
 * React consumers that need to know which scene is active subscribe through
 * `useJourneyStore`, which is only ever updated on scene *changes*.
 */

export interface SceneProgressRecord {
  /** Normalised 0→1 progress through the scene's scroll range. */
  value: number;
  /** Last non-zero delta per second, used for velocity-driven effects. */
  velocity: number;
  /** True once the scene has entered the render window (active or adjacent). */
  active: boolean;
  /** Monotonic counter, incremented on every write. Cheap change detector. */
  revision: number;
}

const EMPTY: SceneProgressRecord = { value: 0, velocity: 0, active: false, revision: 0 };

class ProgressRegistry {
  private readonly records = new Map<string, SceneProgressRecord>();

  record(id: string): SceneProgressRecord {
    let entry = this.records.get(id);
    if (!entry) {
      entry = { ...EMPTY };
      this.records.set(id, entry);
    }
    return entry;
  }

  /** Called from ScrollTrigger's onUpdate — hot path, must stay allocation-free. */
  write(id: string, value: number, delta = 0): void {
    const entry = this.record(id);
    const clamped = value < 0 ? 0 : value > 1 ? 1 : value;
    entry.velocity = delta;
    if (entry.value === clamped) return;
    entry.value = clamped;
    entry.revision += 1;
  }

  setActive(id: string, active: boolean): void {
    const entry = this.record(id);
    if (entry.active === active) return;
    entry.active = active;
    entry.revision += 1;
  }

  value(id: string): number {
    return this.records.get(id)?.value ?? 0;
  }

  velocity(id: string): number {
    return this.records.get(id)?.velocity ?? 0;
  }

  isActive(id: string): boolean {
    return this.records.get(id)?.active ?? false;
  }

  reset(id?: string): void {
    if (id) {
      const entry = this.records.get(id);
      if (entry) Object.assign(entry, EMPTY);
      return;
    }
    this.records.forEach((entry) => Object.assign(entry, EMPTY));
  }
}

export const progressRegistry = new ProgressRegistry();

/* ---------------------------------------------------------------------------
   Global pointer state.
   Normalised to -1..1 and smoothed once per frame by `PointerField` inside the
   canvas, so scenes read a single shared, already-damped vector.
   ------------------------------------------------------------------------- */

export interface PointerField {
  /** Raw normalised pointer (-1..1), written by the DOM listener. */
  targetX: number;
  targetY: number;
  /** Smoothed pointer, written by the per-frame integrator. */
  x: number;
  y: number;
  /** Smoothed pointer velocity (units/second), used for kick/bloom accents. */
  vx: number;
  vy: number;
  /** 0 → pointer never seen, 1 → actively moving. */
  activity: number;
  /** True once the user has actually moved a pointer (vs. touch scroll). */
  present: boolean;
  lastMoveAt: number;
}

export const pointerField: PointerField = {
  targetX: 0,
  targetY: 0,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  activity: 0,
  present: false,
  lastMoveAt: 0,
};

export const resetPointerField = (): void => {
  pointerField.targetX = 0;
  pointerField.targetY = 0;
  pointerField.x = 0;
  pointerField.y = 0;
  pointerField.vx = 0;
  pointerField.vy = 0;
  pointerField.activity = 0;
  pointerField.present = false;
  pointerField.lastMoveAt = 0;
};

/* ---------------------------------------------------------------------------
   Global clock. Scenes advance their own time from this so the `speed`
   control and PAUSE take effect everywhere without per-scene plumbing.
   ------------------------------------------------------------------------- */

export interface ClockField {
  /** Scaled, pausable elapsed seconds. */
  elapsed: number;
  /** Real elapsed seconds since start (never pauses). */
  absolute: number;
  /** 0 while paused, 1 while running. */
  running: number;
  /** Speed multiplier currently applied. */
  speed: number;
}

export const clockField: ClockField = { elapsed: 0, absolute: 0, running: 1, speed: 1 };

/**
 * Advances the shared clock. `delta` is the raw frame delta in seconds,
 * already clamped by the caller. Returns the scaled delta so callers that
 * need it do not recompute.
 */
export const advanceClock = (delta: number): number => {
  clockField.absolute += delta;
  const scaled = delta * clockField.speed * clockField.running;
  clockField.elapsed += scaled;
  return scaled;
};
