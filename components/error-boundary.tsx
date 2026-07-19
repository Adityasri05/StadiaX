"use client";

import { Component, ErrorInfo, ReactNode } from "react";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — catches unhandled React rendering errors and shows
 * a graceful fallback UI instead of crashing the entire application.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[StadiaX ErrorBoundary] Uncaught error:", error, info);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center min-h-screen bg-[#07111F] text-[#F8FAFC] px-6 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[rgba(255,77,109,0.1)] border border-[#FF4D6D]/30 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-[#FF4D6D]" aria-hidden="true" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-white mb-2">
            System Anomaly Detected
          </h1>
          <p className="text-[#94A3B8] text-sm font-mono mb-1 max-w-md">
            An unexpected error occurred in the StadiaX AI OS. The incident has been logged.
          </p>
          {this.state.error && (
            <code className="text-[10px] text-[#FF4D6D]/70 font-mono bg-[rgba(255,77,109,0.05)] px-3 py-1.5 rounded mt-2 mb-6 max-w-lg truncate">
              {this.state.error.message}
            </code>
          )}
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] text-[#07111F] font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
            aria-label="Reload the application"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Reinitialize System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
