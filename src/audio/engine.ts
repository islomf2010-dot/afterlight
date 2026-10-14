/**
 * Procedural audio engine.
 *
 * AFTERLIGHT ships no audio files. Everything you hear is synthesised with the
 * Web Audio API: two detuned oscillators plus filtered noise for the ambient
 * bed, and short shaped envelopes for interface tones. That keeps the build
 * offline-capable and honest about the asset policy, and it means the ambience
 * can be *re-tuned per scene* rather than crossfaded between loops.
 *
 * The AudioContext is created lazily on the first explicit user gesture and is
 * never resumed by anything other than a gesture, so no browser will ever log
 * an autoplay violation or produce sound before the visitor asks for it.
 */

import type { SceneId } from '@/scenes/sceneManifest';

export type CueName = 'enter' | 'click' | 'hover' | 'fracture' | 'capture' | 'error' | 'scene';

export interface SceneTone {
  /** Base frequency of the drone, in Hz. */
  frequency: number;
  /** Detune between the two oscillators, in cents. */
  detune: number;
  /** Low-pass cutoff, in Hz. */
  cutoff: number;
  /** Noise bed level, 0–1. */
  noise: number;
  /** Overall drone level, 0–1. */
  drone: number;
}

export const SCENE_TONES: Record<SceneId, SceneTone> = {
  // Barely-there high sine — a signal, not a sound.
  awakening: { frequency: 220, detune: 3, cutoff: 620, noise: 0.05, drone: 0.05 },
  // Deep, wide, almost sub-bass. The sea.
  void: { frequency: 47.5, detune: 11, cutoff: 240, noise: 0.19, drone: 0.24 },
  // Detuned and restless; the upper partials carry the fracture.
  fracture: { frequency: 82, detune: 27, cutoff: 900, noise: 0.26, drone: 0.2 },
  // A single sustained fifth with a metallic ring — architecture.
  threshold: { frequency: 65, detune: 7, cutoff: 1400, noise: 0.1, drone: 0.22 },
  // Brighter, faster shimmer for the studies.
  echoes: { frequency: 110, detune: 19, cutoff: 2200, noise: 0.13, drone: 0.18 },
  // Returns to the opening sine, a fifth up.
  afterlight: { frequency: 330, detune: 4, cutoff: 900, noise: 0.04, drone: 0.12 },
};

interface Voice {
  oscA: OscillatorNode;
  oscB: OscillatorNode;
  oscGain: GainNode;
  filter: BiquadFilterNode;
  droneGain: GainNode;
  noiseGain: GainNode;
}

class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private voice: Voice | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private lfo: OscillatorNode | null = null;

  private enabled = false;
  private volume = 0.6;
  private ambientVolume = 0.7;
  private currentScene: SceneId = 'awakening';
  private _started = false;

  /** True once a gesture has unlocked the context. */
  get started(): boolean {
    return this._started;
  }

  /** True when the browser has no Web Audio at all. */
  get available(): boolean {
    return typeof window !== 'undefined' && 'AudioContext' in window;
  }

  get running(): boolean {
    return this._started && this.context?.state === 'running';
  }

  /**
   * Creates (or resumes) the context. MUST be called from a user gesture
   * handler; every caller in the app is a click/pointerdown/keypress path.
   */
  async unlock(): Promise<boolean> {
    if (!this.available) return false;
    try {
      // Create the context, but wire nothing into it yet.
      if (!this.context) this.createContext();
      const ctx = this.context;
      if (!ctx) return false;

      if (ctx.state === 'suspended') await ctx.resume();
      // Bail out if the browser refused. Building the graph on a suspended
      // context is what makes Chrome log an autoplay warning per node.
      if (ctx.state !== 'running') return false;

      if (!this.voice) this.build(ctx);
      this._started = true;
      this.applyGain(0.35);
      return true;
    } catch {
      // Some browsers throw when the context is created outside a gesture.
      this.context = null;
      return false;
    }
  }

  private createContext(): void {
    const Ctor: typeof AudioContext =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) throw new Error('Web Audio is unavailable in this browser');
    this.context = new Ctor({ latencyHint: 'playback' });
  }

  /** Wires the ambient voice and the cue bus onto an already-running context. */
  private build(ctx: AudioContext): void {
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    this.ambientBus = ctx.createGain();
    this.ambientBus.gain.value = 1;
    this.ambientBus.connect(this.master);

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = 0.85;
    this.sfxBus.connect(this.master);

    // --- Ambient voice ------------------------------------------------------
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = SCENE_TONES[this.currentScene].cutoff;
    filter.Q.value = 0.9;

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0;
    filter.connect(droneGain);
    droneGain.connect(this.ambientBus);

    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.5;
    oscGain.connect(filter);

    const oscA = ctx.createOscillator();
    oscA.type = 'sawtooth';
    const oscB = ctx.createOscillator();
    oscB.type = 'sawtooth';
    oscA.connect(oscGain);
    oscB.connect(oscGain);
    oscA.start();
    oscB.start();

    // --- Noise bed ----------------------------------------------------------
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 620;
    noiseFilter.Q.value = 0.6;
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ambientBus);

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Pink-ish noise (Voss-McCartney lite): sums of decaying random walks read
    // far less "hissy" than white noise at low levels.
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099;
      b1 = 0.963 * b1 + white * 0.2965;
      b2 = 0.57 * b2 + white * 1.0526;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.16;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;
    noiseSource.connect(noiseFilter);
    noiseSource.start();
    this.noiseSource = noiseSource;

    // Slow filter sweep — the drone "breathes" instead of sitting still.
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.045;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.lfo = lfo;

    this.voice = { oscA, oscB, oscGain, filter, droneGain, noiseGain };

    this.applyTone(this.currentScene, 0.01);
  }

  private applyGain(rampSeconds: number): void {
    if (!this.context || !this.master) return;
    const now = this.context.currentTime;
    const target = this.enabled ? this.volume : 0;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(target, now + Math.max(0.01, rampSeconds));
  }

  private applyTone(scene: SceneId, rampSeconds: number): void {
    const voice = this.voice;
    if (!voice || !this.context) return;
    const tone = SCENE_TONES[scene];
    const now = this.context.currentTime;
    const t = Math.max(0.01, rampSeconds);

    voice.oscA.frequency.setTargetAtTime(tone.frequency, now, t / 3);
    voice.oscB.frequency.setTargetAtTime(tone.frequency * 1.5, now, t / 3);
    voice.oscB.detune.setTargetAtTime(tone.detune, now, t / 3);
    voice.filter.frequency.setTargetAtTime(tone.cutoff, now, t / 3);
    voice.droneGain.gain.setTargetAtTime(tone.drone * this.ambientVolume, now, t / 3);
    voice.noiseGain.gain.setTargetAtTime(tone.noise * this.ambientVolume, now, t / 3);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!this.context) return;
    if (enabled && this.context.state === 'suspended') void this.context.resume();
    this.applyGain(enabled ? 0.6 : 0.35);
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.applyGain(0.12);
  }

  setAmbientVolume(volume: number): void {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    this.applyTone(this.currentScene, 0.4);
  }

  /** Crossfades the ambient bed to a new scene's tone. */
  setScene(scene: SceneId): void {
    if (scene === this.currentScene) return;
    this.currentScene = scene;
    this.applyTone(scene, 2.4);
  }

  /** Suspends the context while the tab is hidden to save CPU. */
  setSuspended(suspended: boolean): void {
    const ctx = this.context;
    if (!ctx || !this._started) return;
    if (suspended && ctx.state === 'running') void ctx.suspend();
    else if (!suspended && ctx.state === 'suspended' && this.enabled) void ctx.resume();
  }

  /**
   * Fires a one-shot cue. Cues are additive over the ambient bed and are
   * ignored entirely when sound is disabled or the context is not running, so
   * there is no cost to calling them unconditionally.
   */
  cue(name: CueName, intensity = 1): void {
    const ctx = this.context;
    const bus = this.sfxBus;
    if (!ctx || !bus || !this.enabled || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const level = Math.max(0, Math.min(1, intensity));

    const spec: Record<CueName, { type: OscillatorType; freq: number; endFreq: number; dur: number; gain: number }> = {
      enter: { type: 'sine', freq: 180, endFreq: 62, dur: 2.6, gain: 0.3 },
      click: { type: 'triangle', freq: 880, endFreq: 620, dur: 0.09, gain: 0.14 },
      hover: { type: 'sine', freq: 1760, endFreq: 1760, dur: 0.045, gain: 0.05 },
      fracture: { type: 'sawtooth', freq: 140, endFreq: 44, dur: 1.4, gain: 0.22 },
      capture: { type: 'sine', freq: 1320, endFreq: 1980, dur: 0.32, gain: 0.16 },
      error: { type: 'square', freq: 150, endFreq: 96, dur: 0.2, gain: 0.12 },
      scene: { type: 'sine', freq: 440, endFreq: 330, dur: 0.7, gain: 0.12 },
    };

    const { type, freq, endFreq, dur, gain } = spec[name];
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + dur);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(gain * level, now + Math.min(0.02, dur * 0.2));
    env.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 5200;

    osc.connect(filter);
    filter.connect(env);
    env.connect(bus);
    osc.start(now);
    osc.stop(now + dur + 0.05);
    // Nodes are GC'd once stopped and disconnected; explicit teardown keeps the
    // graph tidy in browsers that are more conservative.
    osc.onended = (): void => {
      osc.disconnect();
      filter.disconnect();
      env.disconnect();
    };
  }

  dispose(): void {
    try {
      this.voice?.oscA.stop();
      this.voice?.oscB.stop();
      this.lfo?.stop();
      this.noiseSource?.stop();
    } catch {
      /* already stopped */
    }
    try {
      void this.context?.close();
    } catch {
      /* already closed */
    }
    this.voice = null;
    this.context = null;
    this.master = null;
    this.ambientBus = null;
    this.sfxBus = null;
    this.noiseSource = null;
    this.lfo = null;
    this._started = false;
  }
}

export const audioEngine = new AudioEngine();

/**
 * Fires an interface cue. Bound to the singleton so call sites never need the
 * instance, and safe to call unconditionally: it is a no-op when sound is off.
 */
export const cue: (name: CueName, intensity?: number) => void = (name, intensity) =>
  audioEngine.cue(name, intensity);
