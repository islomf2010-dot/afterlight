import type { ReactNode } from 'react';
import { Component, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/Button';
import { TechLabel } from '@/components/ui/TechLabel';

interface Props {
  children: ReactNode;
  /** Rendered instead of the default shell when a boundary catches. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Route-level error boundary.
 *
 * WebGL context loss, a driver reset and a React render error all end up here
 * rather than as a blank page. The visitor always keeps the text of the film and
 * a way forward — the boundary is part of the accessibility story, not just
 * developer tooling.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console -- surface the failure for diagnostics
    console.error('[AFTERLIGHT] render error', error, info.componentStack);
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div className="flex min-h-[70vh] items-center justify-center px-[var(--al-gutter)] py-16">
        <div className="flex w-full max-w-[36rem] flex-col gap-6">
          <TechLabel tone="warn">Signal interrupted</TechLabel>
          <h1 className="display-title text-xl">The frame stopped.</h1>
          <p className="text-base text-[color:var(--al-text-muted)]">
            A rendering error interrupted this view. The written log of every scene is intact — you can keep
            reading, or try the frame again.
          </p>
          <pre className="hairline overflow-x-auto bg-[color:var(--al-surface)] p-4 font-mono text-2xs text-[color:var(--al-text-faint)]">
            {error.message}
          </pre>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="md" onClick={this.reset}>
              Retry
            </Button>
            <Button variant="outline" size="md" to="/archive">
              Read the log
            </Button>
            <Button variant="ghost" size="md" to="/">
              Back to the film
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
