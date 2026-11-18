import React, { Component } from 'react';
import { RefreshCw, LogIn, AlertTriangle, ChevronDown } from 'lucide-react';

/**
 * Sahara Warm styled top-level error boundary.
 * Replaces unstyled "Something went wrong. Please reload the page." with a
 * polished recovery screen matching the Obsidian / Sahara design system.
 */
export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AppErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoLogin = () => {
    try {
      localStorage.removeItem('userInfo');
    } catch (err) {
      console.warn('Could not clear userInfo:', err);
    }
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError || this.props.error) {
      const err = this.state.error || this.props.error;

      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-on-surface p-4 sm:p-6 font-body transition-colors relative overflow-hidden select-none">
          {/* Ambient Warm Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-error-container/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          {/* Main Error Recovery Card */}
          <div className="relative z-10 w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/30 shadow-[0_12px_40px_rgba(58,48,42,0.1)] flex flex-col items-center text-center animate-scale-in">
            {/* Accent Top Trim */}
            <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-error/60 to-transparent rounded-full" />

            {/* Glowing Shield Icon */}
            <div className="w-16 h-16 rounded-2xl bg-error-container/40 border border-error/30 flex items-center justify-center text-error mb-5 shadow-[0_0_24px_rgba(192,57,43,0.18)]">
              <AlertTriangle size={32} />
            </div>

            {/* Headline */}
            <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-on-surface leading-tight mb-2">
              Neural Workspace Interrupted
            </h1>
            <p className="text-[11px] font-label font-bold uppercase tracking-widest text-primary mb-4">
              StudyTantra Session Recovery
            </p>

            {/* Engaging Explanation Message */}
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed font-body">
              StudyTantra encountered a temporary hiccup while establishing connection to your learning vault. A quick refresh will safely resynchronize your workspace.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mb-6">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 cursor-pointer shrink-0"
              >
                <RefreshCw size={15} />
                <span>Refresh Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoLogin}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-on-surface font-label text-xs font-semibold transition-all cursor-pointer shrink-0"
              >
                <LogIn size={15} />
                <span>Sign In Again</span>
              </button>
            </div>

            {/* Technical Details Toggle */}
            {err && (
              <div className="w-full text-left pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="flex items-center justify-between w-full text-[11px] font-label text-on-surface-variant hover:text-on-surface py-1 transition-colors cursor-pointer"
                >
                  <span>Diagnostic details</span>
                  <ChevronDown
                    size={14}
                    className={`transform transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`}
                  />
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-left font-mono text-[11px] text-error/90 overflow-x-auto max-h-40">
                    <p className="font-bold mb-1">{err.toString()}</p>
                    {err.stack && (
                      <pre className="text-[10px] text-on-surface-variant whitespace-pre-wrap leading-tight">
                        {err.stack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="mt-6 text-[11px] font-label text-on-surface-variant/70 tracking-wider uppercase">
            StudyTantra • Active Recall & Spaced Intelligence
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
