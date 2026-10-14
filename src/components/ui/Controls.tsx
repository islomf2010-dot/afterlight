import { useId } from 'react';
import type { ReactNode } from 'react';
import { clamp } from '@/utils/math';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  hint?: string;
  decimals?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  /** Renders the current value in a monospace field (technical readouts). */
  readout?: boolean;
}

/**
 * Range control with full keyboard and screen-reader support.
 *
 * Uses a native `<input type="range">` rather than a div+pointer-events
 * reimplementation: that gives us arrow keys, Home/End, Page Up/Down and
 * correct semantics for free, and it stays usable with a screen reader.
 * The visible track is styled on top of it; the input itself remains the
 * accessible, focusable element.
 */
export const Slider = ({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  hint,
  decimals = 2,
  disabled = false,
  onChange,
  readout = true,
}: SliderProps) => {
  const id = useId();
  const hintId = `${id}-hint`;
  const numeric = Number.isFinite(value) ? value : min;
  const clamped = clamp(numeric, min, max);
  const percent = ((clamped - min) / (max - min)) * 100;

  return (
    <div className={`group/slider flex flex-col gap-2 ${disabled ? 'opacity-40' : ''}`}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="label-mono text-[color:var(--al-text-muted)] transition-colors group-hover/slider:text-ivory">
          {label}
        </label>
        {readout ? (
          <output htmlFor={id} className="font-mono text-2xs tabular-nums text-[color:var(--al-text-faint)]">
            {clamped.toFixed(decimals)}
            {unit}
          </output>
        ) : null}
      </div>

      <div className="relative flex h-[var(--al-control-track)] items-center">
        {/* Filled portion of the track */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 h-px -translate-y-1/2 bg-[color:var(--al-silver)] transition-[width] duration-75"
          style={{ width: `${percent}%` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          disabled={disabled}
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) => onChange(Number(event.target.value))}
          className={[
            'relative z-10 h-[var(--al-control-track)] w-full cursor-pointer appearance-none bg-transparent',
            '[&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-[color:var(--al-line-strong)]',
            '[&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:h-[11px] [&::-webkit-slider-thumb]:w-[11px]',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-ivory',
            '[&::-webkit-slider-thumb]:bg-obsidian [&::-webkit-slider-thumb]:transition-[background-color,transform]',
            'hover:[&::-webkit-slider-thumb]:bg-ivory active:[&::-webkit-slider-thumb]:scale-125',
            '[&::-moz-range-track]:h-px [&::-moz-range-track]:bg-[color:var(--al-line-strong)]',
            '[&::-moz-range-thumb]:h-[10px] [&::-moz-range-thumb]:w-[10px] [&::-moz-range-thumb]:rounded-none',
            '[&::-moz-range-thumb]:border-ivory [&::-moz-range-thumb]:bg-obsidian',
            'focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:bg-ivory',
            'focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(143,212,255,0.45)]',
            'focus-visible:[&::-moz-range-thumb]:bg-ivory',
            'disabled:cursor-not-allowed',
          ].join(' ')}
        />
      </div>

      {hint ? (
        <p id={hintId} className="text-sm leading-relaxed text-[color:var(--al-text-quiet)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: readonly { value: T; label: string; hint?: string }[];
  onChange: (value: T) => void;
  hint?: string;
}

/** Radio-group styled as a segmented control (used for quality/motion presets). */
export const Segmented = <T extends string>({ label, value, options, onChange, hint }: SegmentedProps<T>) => {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="label-mono text-[color:var(--al-text-muted)]">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        aria-describedby={hint ? hintId : undefined}
        className="flex flex-wrap gap-1"
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              title={option.hint}
              onClick={() => onChange(option.value)}
              className={[
                'label-mono border px-3 py-2 transition-colors duration-200 sm:px-4',
                active
                  ? 'border-[color:var(--al-line-strong)] bg-[color:rgba(243,242,238,0.1)] text-ivory'
                  : 'border-[color:var(--al-line)] text-[color:var(--al-text-faint)] hover:border-[color:var(--al-line-strong)] hover:text-ivory',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {hint ? (
        <p id={hintId} className="text-sm leading-relaxed text-[color:var(--al-text-quiet)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  disabled?: boolean;
}

/** Switch built on a real checkbox so it is keyboard- and AT-friendly. */
export const Toggle = ({ label, checked, onChange, hint, disabled = false }: ToggleProps) => {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div
      className={`flex min-h-[var(--al-control-tap)] items-center justify-between gap-4 ${disabled ? 'opacity-40' : ''}`}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="label-mono cursor-pointer text-[color:var(--al-text-muted)]">
          {label}
        </label>
        {hint ? (
          <p id={hintId} className="text-sm leading-relaxed text-[color:var(--al-text-quiet)]">
            {hint}
          </p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={hint ? hintId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative h-[22px] w-11 shrink-0 border transition-colors duration-200',
          checked
            ? 'border-[color:var(--al-line-strong)] bg-[color:rgba(243,242,238,0.16)]'
            : 'border-[color:var(--al-line)] bg-transparent',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'absolute top-1/2 block h-[8px] w-[8px] -translate-y-1/2 transition-[left,background-color] duration-200 ease-[var(--al-ease-out)]',
            checked ? 'left-[22px] bg-ivory' : 'left-[4px] bg-[color:var(--al-text-faint)]',
          ].join(' ')}
        />
      </button>
    </div>
  );
};

export interface PanelProps {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** id of the element that names this panel, for aria-labelledby. */
  labelledBy?: string;
}

/** Hairline-bordered surface used by the settings and laboratory panels. */
export const Panel = ({ title, eyebrow, children, footer, className = '', labelledBy }: PanelProps) => {
  const headingId = labelledBy ?? (title ? `panel-${slug(title)}` : undefined);
  return (
    <section
      aria-labelledby={headingId}
      className={`panel-surface flex flex-col gap-5 p-5 shadow-[var(--al-shadow-panel)] ${className}`}
    >
      {title || eyebrow ? (
        <header className="flex items-baseline justify-between gap-3 border-b border-[color:var(--al-line)] pb-3">
          <div className="flex flex-col gap-1">
            {eyebrow ? <span className="label-mono text-[color:var(--al-text-faint)]">{eyebrow}</span> : null}
            {title ? (
              <h2 id={headingId} className="text-md tracking-[-0.01em] text-ivory">
                {title}
              </h2>
            ) : null}
          </div>
        </header>
      ) : null}
      <div className="flex flex-col gap-4">{children}</div>
      {footer ? <footer className="border-t border-[color:var(--al-line)] pt-3">{footer}</footer> : null}
    </section>
  );
};

const slug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
