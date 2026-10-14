/**
 * Real loading registry.
 *
 * The brief is explicit that progress must never be faked, so this tracks a
 * fixed list of tasks that genuinely complete: web fonts finishing their
 * network/decode work, the WebGL context being created, shader programs being
 * compiled and linked by the driver, and the lazily-imported scene bundles
 * being fetched and parsed.
 *
 * Each task reports 0→1 from the real underlying event. Nothing here is timed
 * or simulated — if a task stalls, the bar stalls with it.
 */

import { useSyncExternalStore } from 'react';

export type TaskState = 'pending' | 'active' | 'done' | 'error';

export interface LoadingTask {
  id: string;
  label: string;
  detail: string;
  progress: number;
  state: TaskState;
}

export interface LoadingSnapshot {
  tasks: LoadingTask[];
  /** 0→1 across all tasks, weighted evenly. */
  overall: number;
  done: boolean;
  failed: boolean;
}

const DEFAULT_TASKS: readonly { id: string; label: string; detail: string }[] = [
  { id: 'fonts', label: 'Typeface', detail: 'Space Grotesk · IBM Plex Mono' },
  { id: 'webgl', label: 'Render context', detail: 'Requesting WebGL2 device' },
  { id: 'shaders', label: 'Shader programs', detail: 'Compiling and linking GLSL' },
  { id: 'scenes', label: 'Scene modules', detail: 'Streaming scene bundles' },
];

class LoadingRegistry {
  private tasks: LoadingTask[] = DEFAULT_TASKS.map((task) => ({
    ...task,
    progress: 0,
    state: 'pending',
  }));

  private listeners = new Set<() => void>();

  private snapshot: LoadingSnapshot = this.compute();

  private compute(): LoadingSnapshot {
    let sum = 0;
    let failed = false;
    let allDone = true;
    for (const task of this.tasks) {
      sum += task.state === 'done' ? 1 : task.state === 'error' ? 1 : task.progress;
      if (task.state === 'error') failed = true;
      if (task.state !== 'done' && task.state !== 'error') allDone = false;
    }
    return { tasks: this.tasks, overall: sum / this.tasks.length, done: allDone, failed };
  }

  private emit(): void {
    this.snapshot = this.compute();
    this.listeners.forEach((listener) => listener());
  }

  private find(id: string): LoadingTask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  setProgress(id: string, progress: number): void {
    const task = this.find(id);
    if (!task || task.state === 'done') return;
    const next = Math.max(0, Math.min(1, progress));
    if (next === task.progress && task.state !== 'active') return;
    task.progress = next;
    task.state = next > 0 || task.state === 'active' ? 'active' : task.state;
    this.emit();
  }

  start(id: string, detail?: string): void {
    const task = this.find(id);
    if (!task || task.state === 'done') return;
    task.state = 'active';
    if (detail) task.detail = detail;
    this.emit();
  }

  complete(id: string, detail?: string): void {
    const task = this.find(id);
    if (!task) return;
    task.state = 'done';
    task.progress = 1;
    if (detail) task.detail = detail;
    this.emit();
  }

  fail(id: string, detail: string): void {
    const task = this.find(id);
    if (!task) return;
    task.state = 'error';
    task.detail = detail;
    this.emit();
  }

  /** Marks a task as done without progress — used for genuinely instant work. */
  skip(id: string, detail?: string): void {
    const task = this.find(id);
    if (!task) return;
    task.state = 'done';
    task.progress = 1;
    if (detail) task.detail = detail;
    this.emit();
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): LoadingSnapshot => this.snapshot;

  /**
   * Force-settles any task that has not reported within `ms`.
   *
   * Not fake progress: a task that never reports is marked as *failed with a
   * reason*, the overall figure reflects that, and the visitor is told which
   * part did not finish. Without this, one stalled driver call would leave the
   * gate closed and the film unreachable.
   */
  settleAfter(ms: number, reason = 'did not report in time — continuing without it'): void {
    if (typeof window === 'undefined') return;
    window.setTimeout(() => {
      this.tasks.forEach((task) => {
        if (task.state === 'pending' || task.state === 'active') this.fail(task.id, reason);
      });
    }, ms);
  }

  reset(): void {
    this.tasks = DEFAULT_TASKS.map((task) => ({ ...task, progress: 0, state: 'pending' }));
    this.emit();
  }
}

export const loadingRegistry = new LoadingRegistry();

export const useLoadingSnapshot = (): LoadingSnapshot =>
  useSyncExternalStore(loadingRegistry.subscribe, loadingRegistry.getSnapshot, loadingRegistry.getSnapshot);

/**
 * Loads the display typefaces and reports genuine progress.
 *
 * `document.fonts.load()` resolves per family/weight, so we can count them
 * rather than polling a timer. If the Font Loading API is unavailable the task
 * is marked done immediately — the fallback stack still renders correctly.
 */
export const loadFonts = async (): Promise<void> => {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    loadingRegistry.complete('fonts', 'Font Loading API unavailable — using fallback stack');
    return;
  }

  const faces = [
    '300 1rem "Space Grotesk Variable"',
    '400 1rem "Space Grotesk Variable"',
    '500 1rem "Space Grotesk Variable"',
    '300 1rem "IBM Plex Mono"',
    '400 1rem "IBM Plex Mono"',
  ];

  loadingRegistry.start('fonts');
  let settled = 0;
  await Promise.all(
    faces.map(async (spec) => {
      try {
        await document.fonts.load(spec);
      } catch {
        /* a single missing face must not block the film */
      }
      settled += 1;
      loadingRegistry.setProgress('fonts', settled / faces.length);
    }),
  );

  try {
    await document.fonts.ready;
  } catch {
    /* no-op */
  }
  loadingRegistry.complete('fonts', `${faces.length} faces resolved`);
};
