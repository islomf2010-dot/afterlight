/**
 * Library playground studies.
 *
 * Kept deliberately separate from the three *film* studies (`ExhibitId`). The
 * film is described to the visitor as "Study I / II / III" and the Echoes
 * overlay reports a live "Study N of 3", so adding these to that enumeration
 * would make the film lie about its own contents. They are experiments with
 * libraries, labelled as such.
 */
export type PlaygroundId = 'liquid' | 'gradient' | 'glass';

export interface PlaygroundMeta {
  id: PlaygroundId;
  numeral: string;
  title: string;
  source: string;
  summary: string;
  affects: string;
}

export const PLAYGROUNDS: readonly PlaygroundMeta[] = [
  {
    id: 'liquid',
    numeral: 'IV',
    title: 'Liquid metal wordmark',
    source: 'liquid-logo (MIT) — shader adapted',
    summary:
      'A flow-field integration wrapped around the outline of a generated text mask. The mask is rendered from live text at runtime, so no third-party logo asset ships with this project and the wordmark stays editable.',
    affects:
      'Every uniform below is wired to the material. Speed and edge strength respond to the pointer; the loop length and noise amount are the expensive ones.',
  },
  {
    id: 'gradient',
    numeral: 'V',
    title: 'Shader gradient',
    source: '@shadergradient/react (MIT) — mounted in this canvas',
    summary:
      'The ShaderGradient mesh, rendered inside the laboratory’s existing WebGL context rather than the package’s own <Canvas>, so this experiment adds a mesh and not a second renderer.',
    affects:
      'Colours, noise speed, density, strength and frequency are the package’s documented uniforms. Presets come from the package itself.',
  },
  {
    id: 'glass',
    numeral: 'VI',
    title: 'Liquid glass',
    source: 'liquid-glass-js (MIT) — shader model adapted',
    summary:
      'The library’s rounded-rect SDF, displacement and edge-lighting model, running as a real WebGL surface over the laboratory backdrop. The original’s html2canvas page-snapshot pipeline is deliberately not used: it rasterises the whole document, cannot capture a WebGL canvas, and would mean a second context.',
    affects: 'Warp, edge, rim and corner gain, all ported from the library’s uniforms.',
  },
] as const;

export const isPlayground = (value: string | undefined): value is PlaygroundId =>
  value === 'liquid' || value === 'gradient' || value === 'glass';