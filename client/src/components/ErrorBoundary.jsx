import React from 'react';
import { AlertTriangle, RefreshCw, Home, MessageSquare, ShieldAlert } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("EstateSocial Runtime Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#090E17] flex items-center justify-center p-4 transition-colors duration-200">
          <div className="bg-white dark:bg-[#0B111E] p-8 rounded-3xl border border-gray-200/80 dark:border-zinc-800 shadow-2xl max-w-lg w-full text-center">
            
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>

            <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50 mb-2">
              Application Encountered an Issue
            </h1>
            
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mb-6 leading-relaxed">
              We've logged this exception and our engineering team is on it. Try refreshing the page or navigating back to the homepage.
            </p>

            {this.state.error && (
              <div className="text-left bg-gray-50 dark:bg-zinc-900/80 border border-gray-200/80 dark:border-zinc-800 p-3.5 rounded-xl text-xs font-mono text-gray-700 dark:text-zinc-300 overflow-auto max-h-36 mb-6">
                <p className="font-bold text-red-600 dark:text-red-400 mb-1">{this.state.error.toString()}</p>
                <p className="text-[10px] text-gray-500 whitespace-pre-wrap">{this.state.error.stack?.split('\n').slice(0, 3).join('\n')}</p>
              </div>
            )}

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={() => { window.location.href = '/'; }}
                className="w-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 py-3 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>Go to Homepage</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-6">
              Need immediate assistance? Contact support@estatesocial.pk
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
