import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log additional context for debugging
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    console.error('Error boundary location:', window.location.pathname);
    
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-slate-600 mb-8">
              We encountered an unexpected error. Don't worry, your data is safe. 
              Try refreshing the page or go back to the homepage.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={this.handleReload}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Page</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go to Homepage</span>
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-4 p-4 bg-slate-100 rounded-lg text-xs text-slate-700 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;