import React, { Component } from 'react';

interface Props {
  children: any;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component {
  declare props: Props;
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6F6F9] p-4">
          <div className="bg-white rounded-[24px] p-8 max-w-md w-full text-center shadow-lg">
            <div className="w-20 h-20 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-[#111111] mb-3">Something went wrong</h1>
            <p className="text-[#666666] mb-2">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <p className="text-sm text-[#999999] mb-6">
              Don't worry, your data is safe. Try reloading the app.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="flex-1 px-6 py-3 bg-[#F6F6F9] text-[#111111] rounded-[16px] hover:bg-[#E5E5E5] transition-all font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="flex-1 px-6 py-3 bg-[#6B4BFF] text-white rounded-[16px] hover:bg-[#5a3edb] transition-all font-medium"
              >
                Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

