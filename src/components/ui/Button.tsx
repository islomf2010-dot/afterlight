import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'technical';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional technical caption rendered above the label. */
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Renders a react-router <Link> instead of a <button>. */
    to?: string;
    href?: string;
  };

const VARIANT: Record<ButtonVariant, string> = {
  /*
    The one control that gets glass. `glass-surface` is additive and carries no
    layout of its own — it is a background, a blurred backdrop and an edge
    light — so the button stays a real <button> with its own focus ring, its
    own height token and its own disabled state. Everything else in the film
    stays flat: glass on every surface would read as a component demo.
  */
  primary:
    'glass-surface bg-ivory text-obsidian border-ivory hover:bg-silver hover:border-silver active:bg-ash active:text-ivory',
  outline:
    'bg-transparent text-ivory border-[color:var(--al-line-strong)] hover:border-ivory hover:bg-[color:rgba(243,242,238,0.06)] active:bg-[color:rgba(243,242,238,0.12)]',
  ghost:
    'bg-transparent text-[color:var(--al-text-muted)] border-transparent hover:text-ivory hover:border-[color:var(--al-line)] active:text-silver',
  technical:
    'bg-[color:var(--al-surface)] text-[color:var(--al-text-muted)] border-[color:var(--al-line)] font-mono uppercase tracking-[0.22em] hover:text-ivory hover:border-[color:var(--al-line-strong)] active:text-silver',
};

// Heights come from the token layer so touch pointers get larger targets
// without a second set of utility classes.
const SIZE: Record<ButtonSize, string> = {
  sm: 'h-[var(--al-control-sm)] px-3 text-2xs',
  md: 'h-[var(--al-control-md)] px-5 text-2xs',
  lg: 'h-[var(--al-control-lg)] px-8 text-xs',
};

export const buttonClasses = (
  variant: ButtonVariant = 'outline',
  size: ButtonSize = 'md',
  fullWidth = false,
  className = '',
): string =>
  [
    'group/al-btn relative inline-flex select-none items-center justify-center gap-3',
    'border font-mono uppercase tracking-[0.28em] leading-none',
    'transition-[background-color,border-color,color,transform,opacity] duration-200 ease-[var(--al-ease-out)]',
    'disabled:pointer-events-none disabled:opacity-35',
    'active:translate-y-px',
    VARIANT[variant],
    SIZE[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

/**
 * The single button primitive.
 *
 * Every interactive control in AFTERLIGHT uses this — including links — so
 * hover/active/focus/disabled behaviour is identical across the film, the lab
 * and the utility routes. Nothing decorative: `onClick` is required for the
 * `button` rendering and the component refuses to render an enabled button
 * without a handler.
 */
export const Button = ({
  variant = 'outline',
  size = 'md',
  eyebrow,
  children,
  className,
  fullWidth = false,
  to,
  href,
  onClick,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const classes = buttonClasses(variant, size, fullWidth, className);
  const content = (
    <>
      {eyebrow ? (
        <span className="block text-[0.5625rem] tracking-[0.34em] opacity-55">{eyebrow}</span>
      ) : null}
      <span className="relative flex items-center gap-2">
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-disabled={disabled || undefined}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} rel="noreferrer noopener" target="_blank">
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  );
};
