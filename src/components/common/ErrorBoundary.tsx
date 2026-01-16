import { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '../../utils/performance';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-white)' }}>
            Something went wrong
          </h1>
          <p style={{ color: 'var(--medium-grey)', marginBottom: '2rem' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--lime-green)',
              color: 'var(--primary-black)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
