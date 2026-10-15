import { useEffect, useRef, useState } from 'react';
import { Panel, Segmented, Slider, Toggle } from '@/components/ui/Controls';
import { Button } from '@/components/ui/Button';
import { TechLabel } from '@/components/ui/TechLabel';
import { useSettingsStore, runtimeFlags, DPR_CAP_OPTIONS, type MotionPreference, type QualityPreset } from '@/store/useSettingsStore';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { capabilities } from '@/graphics/capabilitiesContext';
import { setSoundEnabled } from '@/audio/useAudio';

export interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Settings drawer.
 *
 * Every control writes to the settings store, which is persisted and mirrored
 * onto `runtimeFlags` for the render loop — so switching quality or motion mode
 * takes effect on the very next frame without remounting the canvas.
 */
export const SettingsPanel = ({ open, onClose }: SettingsPanelProps) => {
  const settings = useSettingsStore();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [fps, setFps] = useState(0);

  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Sample the non-reactive FPS mirror on an interval instead of subscribing
  // to it — a 60Hz React subscription for a diagnostic number is not worth it.
  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setFps(Math.round(runtimeFlags.fps)), 750);
    return () => window.clearInterval(id);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] flex justify-end">
      <button
        type="button"
        aria-label="Close settings"
        className="absolute inset-0 bg-[color:rgba(5,5,5,0.72)] backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className="glass-surface relative flex h-full w-[min(24rem,100vw)] flex-col gap-5 overflow-y-auto p-[var(--al-gutter)] shadow-[var(--al-shadow-panel)]"
          data-glass="quiet"
        style={{ paddingBottom: 'calc(var(--al-gutter) + env(safe-area-inset-bottom))' }}
      >
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <TechLabel tone="muted">System</TechLabel>
            <h2 className="text-lg tracking-[-0.02em]">Settings</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close settings">
            Close
          </Button>
        </header>

        <Panel title="Rendering" eyebrow="Performance">
          <Segmented<QualityPreset>
            label="Quality preset"
            value={settings.quality}
            onChange={(quality) => settings.set('quality', quality)}
            options={[
              { value: 'auto', label: 'Auto', hint: 'Choose a tier from the detected device' },
              { value: 'low', label: 'Low', hint: 'No post-processing, minimal geometry' },
              { value: 'medium', label: 'Med', hint: 'Bloom on, reduced density' },
              { value: 'high', label: 'High', hint: 'Full density and effects' },
            ]}
            hint="Lower presets remove the post-processing chain and scale every instanced count down."
          />

          <Segmented<string>
            label="Pixel ratio cap"
            value={String(settings.dprCap)}
            onChange={(value) => settings.set('dprCap', Number(value))}
            options={DPR_CAP_OPTIONS.map((cap) => ({
              value: String(cap),
              label: `${cap}×`,
              hint: `Limit the device pixel ratio to ${cap}`,
            }))}
            hint="The single most effective control on a high-DPI laptop. 1× halves the fragment cost."
          />

          <Segmented<MotionPreference>
            label="Motion"
            value={settings.motion}
            onChange={(motion) => settings.set('motion', motion)}
            options={[
              { value: 'system', label: 'System', hint: 'Follow prefers-reduced-motion' },
              { value: 'full', label: 'Full', hint: 'Play every animation' },
              { value: 'reduced', label: 'Reduced', hint: 'Remove camera drift and long transitions' },
            ]}
            hint="Reduced motion stops camera parallax and scroll smoothing, and replaces transitions with fades."
          />

          <Toggle
            label="Pause when hidden"
            checked={settings.pauseWhenHidden}
            onChange={(checked) => settings.set('pauseWhenHidden', checked)}
            hint="Suspends rendering when the tab is in the background."
          />
        </Panel>

        <Panel title="Audio" eyebrow="Sound">
          <Toggle
            label="Sound"
            checked={settings.soundEnabled}
            onChange={setSoundEnabled}
            hint="Ambient bed and interface tones. Never starts before you press something."
          />
          <Slider
            label="Master volume"
            value={settings.volume}
            min={0}
            max={1}
            step={0.01}
            decimals={2}
            disabled={!settings.soundEnabled}
            onChange={(volume) => settings.set('volume', volume)}
          />
          <Slider
            label="Ambient level"
            value={settings.ambientVolume}
            min={0}
            max={1}
            step={0.01}
            decimals={2}
            disabled={!settings.soundEnabled}
            onChange={(ambientVolume) => settings.set('ambientVolume', ambientVolume)}
            hint="Relative weight of the drone against the interface tones."
          />
        </Panel>

        <Panel title="Interface" eyebrow="Display">
          <Toggle
            label="Film grain"
            checked={settings.grain}
            onChange={(grain) => settings.set('grain', grain)}
          />
          <Toggle
            label="Smooth scrolling"
            checked={settings.smoothScroll}
            onChange={(smoothScroll) => settings.set('smoothScroll', smoothScroll)}
            hint="Uses Lenis. Turning this off restores completely native scrolling."
          />
          <Toggle
            label="Custom cursor"
            checked={settings.customCursor}
            onChange={(customCursor) => settings.set('customCursor', customCursor)}
            hint="Fine pointers only. The native cursor is hidden in its place."
          />
        </Panel>

        <Panel title="Diagnostics" eyebrow="Device">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-2xs text-[color:var(--al-text-faint)]">
            <Row label="Tier" value={['Low', 'Medium', 'High'][runtimeFlags.tier]} />
            <Row label="Frame rate" value={`${fps} fps`} />
            <Row label="Frames" value={runtimeFlags.frames.toLocaleString('en-US')} />
            <Row label="WebGL" value={runtimeFlags.webgl ? 'available' : 'unavailable'} />
            <Row label="Pointer" value={capabilities.coarsePointer ? 'coarse' : 'fine'} />
            <Row label="Cores" value={String(capabilities.cores)} />
            <Row label="Memory" value={capabilities.deviceMemory ? `${capabilities.deviceMemory} GB` : 'unknown'} />
            <div className="col-span-2 flex flex-col gap-1">
              <dt className="label-mono opacity-60">Renderer</dt>
              <dd className="break-all text-[color:var(--al-text-muted)]">{capabilities.renderer}</dd>
            </div>
          </dl>
        </Panel>

        <Button variant="technical" size="md" onClick={settings.reset} fullWidth>
          Restore defaults
        </Button>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <>
    <dt className="label-mono opacity-60">{label}</dt>
    <dd className="text-right text-[color:var(--al-text-muted)]">{value}</dd>
  </>
);
