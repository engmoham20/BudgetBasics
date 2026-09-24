import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <AlertTriangle size={48} className="text-danger mb-4" strokeWidth={1.5} />
          <h1 className="text-xl font-semibold text-fg mb-2">Something went wrong</h1>
          <p className="text-muted text-sm mb-6 max-w-md">
            An unexpected error occurred. Please try again.
          </p>
          <Button variant="primary" onClick={this.handleReset}>
            Try Again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
