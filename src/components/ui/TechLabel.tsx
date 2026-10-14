import type { ReactNode } from 'react';

export interface TechLabelProps {
  children: ReactNode;
  /** Small leading marker dot — used for live/active states. */
  dot?: boolean;
  tone?: 'default' | 'muted' | 'live' | 'warn';
  className?: string;
  /** Announce changes to assistive technology (used by live telemetry). */
  live?: boolean;
}

const TONE: Record<NonNullable<TechLabelProps['tone']>, string> = {
  default: 'text-[color:var(--al-text-muted)]',
  muted: 'text-[color:var(--al-text-faint)]',
  live: 'text-[color:var(--al-text-muted)]',
  warn: 'text-[color:var(--al-danger)]',
};

const DOT: Record<NonNullable<TechLabelProps['tone']>, string> = {
  default: 'bg-[color:var(--al-text-faint)]',
  muted: 'bg-[color:var(--al-text-ghost)]',
  live: 'bg-[color:var(--al-ok)]',
  warn: 'bg-[color:var(--al-danger)]',
};

/** Small, precise, monospaced technical label. Used for all HUD metadata. */
export const TechLabel = ({ children, dot = false, tone = 'default', className = '', live = false }: TechLabelProps) => (
  <span
    className={`label-mono inline-flex items-center gap-2 ${TONE[tone]} ${className}`}
    {...(live ? { 'aria-live': 'polite' as const } : {})}
  >
    {dot ? (
      <span
        aria-hidden="true"
        className={`al-animated inline-block h-[3px] w-[3px] rounded-full ${DOT[tone]}`}
        style={tone === 'live' ? { animation: 'al-pulse-dot 2.4s var(--al-ease-in-out) infinite' } : undefined}
      />
    ) : null}
    {children}
  </span>
);

export interface SectionHeadingProps {
  numeral?: string;
  title: string;
  lede?: string;
  align?: 'left' | 'center';
  id?: string;
}

/** Editorial section header used on the archive, lab and credits routes. */
export const SectionHeading = ({ numeral, title, lede, align = 'left', id }: SectionHeadingProps) => (
  <header className={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : 'items-start'}`}>
    {numeral ? <TechLabel tone="muted">{numeral}</TechLabel> : null}
    <h2 id={id} className="display-title text-xl">
      {title}
    </h2>
    {lede ? (
      <p className={`max-w-[var(--al-measure)] text-base text-[color:var(--al-text-muted)] ${align === 'center' ? 'mx-auto' : ''}`}>
        {lede}
      </p>
    ) : null}
  </header>
);
