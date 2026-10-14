import { Panel, Slider } from '@/components/ui/Controls';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { TechLabel } from '@/components/ui/TechLabel';
import { useLabStore } from '@/store/useLabStore';
import { EFFECT_PARAM_SPECS, paramSpec } from '@/store/effectConfig';
import { runtimeFlags } from '@/store/useSettingsStore';
import { cue } from '@/audio/engine';
import { formatFixed } from '@/utils/format';

/**
 * The laboratory's control surface.
 *
 * Contract enforced here: every control below maps to a field in
 * `EffectParams`, and every field in `EffectParams` is read by at least one
 * running material (particle count → geometry, distortion → vertex warp and
 * wave energy, pointer influence → the displacement field, fog density →
 * scene.fog, bloom → the post chain, speed → the shared clock). There is no
 * decorative slider in this panel, and the unit test for the schema fails if
 * one appears.
 */
export const EffectControls = () => {
  const params = useLabStore((s) => s.params);
  const paused = useLabStore((s) => s.paused);
  const status = useLabStore((s) => s.status);
  const lastCapture = useLabStore((s) => s.lastCapture);
  const notice = useLabStore((s) => s.notice);
  const setParam = useLabStore((s) => s.setParam);
  const togglePause = useLabStore((s) => s.togglePause);
  const reset = useLabStore((s) => s.reset);
  const randomize = useLabStore((s) => s.randomize);
  const requestCapture = useLabStore((s) => s.requestCapture);
  const exportConfig = useLabStore((s) => s.exportConfig);
  const importConfig = useLabStore((s) => s.importConfig);
  const dismissNotice = useLabStore((s) => s.dismissNotice);

  return (
    <div className="flex flex-col gap-5">
      <Panel title="Parameters" eyebrow="Live">
        {EFFECT_PARAM_SPECS.map((spec) => (
          <Slider
            key={spec.key}
            label={spec.label}
            value={params[spec.key]}
            min={spec.min}
            max={spec.max}
            step={spec.step}
            decimals={spec.decimals}
            unit={spec.unit}
            hint={spec.hint}
            disabled={paused && spec.key === 'speed'}
            onChange={(value) => {
              setParam(spec.key, value);
              cue('hover', 0.35);
            }}
          />
        ))}
      </Panel>

      <Panel title="Actions" eyebrow="Transport">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="technical"
            size="md"
            onClick={() => {
              togglePause();
              cue('click');
            }}
            aria-pressed={paused}
          >
            {paused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            variant="technical"
            size="md"
            onClick={() => {
              randomize();
              cue('scene');
            }}
          >
            Randomise
          </Button>
          <Button
            variant="technical"
            size="md"
            onClick={() => {
              reset();
              cue('click');
            }}
          >
            Reset
          </Button>
          <Button
            variant="technical"
            size="md"
            onClick={() => {
              requestCapture();
              cue('click');
            }}
            disabled={status === 'capturing'}
          >
            {status === 'capturing' ? 'Capturing…' : 'Capture'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              exportConfig();
              cue('click');
            }}
          >
            Export JSON
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              void importConfig();
            }}
          >
            Import JSON
          </Button>
        </div>

        <TechLabel tone="muted">
          Capture writes a PNG of the current frame via canvas.toBlob. Export writes the six parameters
          above as JSON; import validates and clamps whatever it is given.
        </TechLabel>
      </Panel>

      <Panel title="Readout" eyebrow="Telemetry">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-2xs">
          <Readout label="Transport" value={paused ? 'paused' : 'running'} />
          <Readout label="Frame rate" value={`${Math.round(runtimeFlags.fps)} fps`} />
          <Readout label="Particles" value={Math.round(params.particleCount).toLocaleString('en-US')} />
          <Readout label="Fog" value={formatFixed(params.fogDensity)} />
          <Readout
            label="Particle range"
            value={`${paramSpec('particleCount').min}–${paramSpec('particleCount').max}`}
          />
          <Readout label="Speed" value={`${formatFixed(params.speed, 2)}×`} />
        </dl>
        <p
          className={[
            'font-mono text-2xs leading-relaxed',
            lastCapture === null
              ? 'text-[color:var(--al-text-quiet)]'
              : lastCapture.ok
                ? 'text-[color:var(--al-text-muted)]'
                : 'text-[color:var(--al-danger)]',
          ].join(' ')}
        >
          <span className="label-mono mr-2 opacity-60">Last capture</span>
          {lastCapture === null
            ? 'none yet'
            : `${lastCapture.label} · ${new Date(lastCapture.at).toLocaleTimeString('en-GB')}`}
        </p>
      </Panel>

      <Notice notice={notice} onDismiss={dismissNotice} />
    </div>
  );
};

const Readout = ({ label, value }: { label: string; value: string }) => (
  <>
    <dt className="label-mono text-[color:var(--al-text-faint)]">{label}</dt>
    <dd className="text-right tabular-nums text-[color:var(--al-text-muted)]">{value}</dd>
  </>
);
