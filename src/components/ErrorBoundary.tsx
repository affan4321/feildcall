import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-strong border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 
              className="text-2xl font-bold text-primary-900 mb-4"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Something went wrong
            </h1>
            
            <p 
              className="text-gray-600 mb-6 leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              We encountered an error while loading the dashboard. Please try refreshing the page.
            </p>

            {/* Error details for debugging */}
            {this.state.error && (
              <details className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-strong"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Page</span>
            </button>
            
            <div className="mt-4">
              <a
                href="/"
                className="text-sm text-gray-500 hover:text-primary-900 transition-colors duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;