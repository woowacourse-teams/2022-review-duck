import React from 'react';
import { Component, ReactNode } from 'react';

import axios from 'axios';

interface ErrorBoundaryProps {
  fallback: React.FunctionComponent<{
    status?: string | number;
    title: string;
    description: string;
    onResetError?: () => void;
  }>;
  children: ReactNode;
}

interface States {
  hasError?: boolean;
  error: unknown;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, States> {
  previousPath: string | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false, error: null };
  }

  componentDidMount() {
    this.previousPath = location.pathname;
  }

  componentDidUpdate() {
    if (window.location.pathname !== this.previousPath) {
      this.setState({ hasError: false, error: null });
    }

    this.previousPath = window.location.pathname;
  }

  resetError() {
    this.setState({ hasError: false });
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError && fallback && axios.isAxiosError(error)) {
      console.log(error);
      return React.createElement(fallback, {
        status: error.response?.status || ':(',
        title: error.message || '알 수 없는 오류가 발생하였습니다',
        description: error.response?.statusText.toLowerCase() || '알 수 없는 오류',
        onResetError: this.resetError.bind(this),
      });
    }

    return children;
  }
}

export default ErrorBoundary;
