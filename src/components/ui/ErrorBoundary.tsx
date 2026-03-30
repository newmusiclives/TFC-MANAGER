"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback UI to render instead of the default error card. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const isDev = process.env.NODE_ENV === "development";

    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="p-5 rounded-2xl bg-red-500/10 mb-6">
          <svg
            className="w-10 h-10 text-red-400 opacity-60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
        {isDev && this.state.error && (
          <p className="text-sm text-red-400/80 max-w-md mb-4 font-mono break-all">
            {this.state.error.message}
          </p>
        )}
        <p className="text-sm text-zinc-400 max-w-sm mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={this.handleReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors bg-purple-600 hover:bg-purple-700 text-white"
        >
          Try again
        </button>
      </div>
    );
  }
}
