import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export default class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = {
    hasError: false,
    errorMessage: "",
  };

  static getDerivedStateFromError(error: unknown): RouteErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : "The command module failed to load.",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Route render failure", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-blue-50">
        <section className="w-full max-w-xl rounded-2xl border border-red-500/40 bg-gradient-to-br from-slate-950 via-blue-950/90 to-slate-950 p-8 text-center shadow-2xl shadow-blue-950/40">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-400/50 bg-red-500/10 text-2xl text-red-300">!</div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-300">Command module fault</p>
          <h1 className="mt-3 text-2xl font-bold text-white">Empire Progression could not render</h1>
          <p className="mt-3 text-sm leading-6 text-blue-200/80">The game caught the page failure instead of leaving a blank screen. Reload the command module to retry the current route.</p>
          <p className="mt-4 break-words rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-left font-mono text-xs text-red-200/80">{this.state.errorMessage || "Unknown client error"}</p>
          <button type="button" onClick={this.handleReload} className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">Reload command module</button>
        </section>
      </main>
    );
  }
}
