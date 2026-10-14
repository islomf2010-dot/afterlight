import { Button } from '@/components/ui/Button';
import { TechLabel, SectionHeading } from '@/components/ui/TechLabel';
import { capabilities } from '@/graphics/capabilitiesContext';
import { runtimeFlags } from '@/store/useSettingsStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SCENES } from '@/scenes/sceneManifest';

interface Credit {
  role: string;
  names: string;
  note?: string;
}

/**
 * CREDITS
 *
 * Includes the parts that are usually left off: exactly what is in the build,
 * where it came from, what was deliberately left out, and how the piece behaves
 * for people who cannot use the WebGL layer, the audio or fast animation.
 */
export const Credits = () => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const reduced = useSettingsStore((s) => s.motion === 'reduced');

  const credits: Credit[] = [
    { role: 'Direction, design, engineering', names: 'One author, end to end' },
    { role: 'Environment, geometry, shaders', names: 'Procedural — generated at runtime' },
    { role: 'Sound design', names: 'Synthesised live with the Web Audio API' },
    { role: 'Typefaces', names: 'Space Grotesk · IBM Plex Mono (SIL OFL 1.1)' },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[72rem] px-[var(--al-gutter)] pb-24 pt-[calc(var(--al-nav-h)+4rem)]">
      <SectionHeading
        numeral="04 / Credits"
        title="AFTERLIGHT"
        lede="An experimental film that renders itself. Six scenes, one WebGL context, no downloaded assets."
      />

      <section className="mt-14 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <TechLabel tone="muted">Credits</TechLabel>
            <dl className="flex flex-col gap-4">
              {credits.map((credit) => (
                <div key={credit.role} className="flex flex-col gap-1 border-b border-[color:var(--al-line)] pb-3">
                  <dt className="label-mono text-[color:var(--al-text-faint)]">{credit.role}</dt>
                  <dd className="text-base text-[color:var(--al-text-muted)]">{credit.names}</dd>
                  {credit.note ? <dd className="text-sm text-[color:var(--al-text-quiet)]">{credit.note}</dd> : null}
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-4">
            <TechLabel tone="muted">Scenes</TechLabel>
            <ol className="flex flex-col gap-2">
              {SCENES.map((scene) => (
                <li key={scene.id} className="flex items-baseline gap-4">
                  <span className="label-mono w-8 shrink-0 text-[color:var(--al-text-faint)]">{scene.numeral}</span>
                  <span className="text-sm text-[color:var(--al-text-muted)]">{scene.title}</span>
                  <span className="ml-auto text-2xs text-[color:var(--al-text-quiet)]">{scene.telemetry}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <TechLabel tone="muted">Assets &amp; licensing</TechLabel>
            <div className="panel-surface flex flex-col gap-3 p-5 text-sm leading-relaxed text-[color:var(--al-text-muted)]">
              <p>
                There are no downloaded images, models, HDRIs or audio files in this build. Every surface,
                every particle and every sound is generated in the browser from a fixed seed, so the piece
                looks and sounds identical offline and cannot break because a host disappeared.
              </p>
              <p>
                The only third-party assets are the two typefaces, packaged locally through Fontsource:
                <strong className="font-normal text-ivory"> Space Grotesk </strong>by Florian Karsten and
                <strong className="font-normal text-ivory"> IBM Plex Mono </strong>by Mike Abbink, both
                released under the SIL Open Font License 1.1.
              </p>
              <p>
                The 3D noise implementation is the classic Ashima Arts / Stefan Gustavson simplex noise
                (MIT), adapted for GLSL.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <TechLabel tone="muted">Accessibility</TechLabel>
            <ul className="flex flex-col gap-3 text-sm leading-relaxed text-[color:var(--al-text-muted)]">
              <li>
                <strong className="font-normal text-ivory">Everything is in the text.</strong> The full
                narrative lives in the document, so the film is watchable with WebGL unavailable, with a
                screen reader, or with images and canvas switched off entirely.
              </li>
              <li>
                <strong className="font-normal text-ivory">Reduced motion is honoured twice.</strong> The
                OS setting is detected automatically and can be overridden in Settings. With motion
                reduced, camera parallax and scroll smoothing are removed and transitions become fades.
              </li>
              <li>
                <strong className="font-normal text-ivory">No interaction is hover-only.</strong> Every
                control is a real focusable element with visible focus, and the scene rail is a keyboard
                route through the whole film.
              </li>
              <li>
                <strong className="font-normal text-ivory">Audio is opt-in and optional.</strong> Nothing
                is audible until you press Enter, and every scene reads identically with sound off.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <TechLabel tone="muted">This session</TechLabel>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-2xs">
              <Row label="Renderer" value={capabilities.renderer} />
              <Row label="Tier" value={['low', 'medium', 'high'][runtimeFlags.tier]} />
              <Row label="Audio" value={soundEnabled ? 'enabled' : 'disabled'} />
              <Row label="Motion" value={reduced ? 'reduced' : 'full'} />
            </dl>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="md" to="/">
              Watch the film
            </Button>
            <Button variant="outline" size="md" to="/archive">
              Read the log
            </Button>
            <Button variant="ghost" size="md" to="/lab">
              Laboratory
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <>
    <dt className="label-mono text-[color:var(--al-text-faint)]">{label}</dt>
    <dd className="truncate text-right text-[color:var(--al-text-muted)]" title={value}>
      {value}
    </dd>
  </>
);

export default Credits;
