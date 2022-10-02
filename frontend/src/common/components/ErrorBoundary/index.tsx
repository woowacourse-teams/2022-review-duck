import React from 'react';
import { Component, ReactNode } from 'react';

import axios from 'axios';

export interface ErrorBoundaryFallbackProps {
  status?: string | number;
  title: string;
  description: string;
  onResetError?: () => void;
}

interface ErrorBoundaryProps {
  fallback: React.FunctionComponent<ErrorBoundaryFallbackProps>;
  children: ReactNode;
}

interface ErrorBoundaryStates {
  hasError?: boolean;
  error: unknown;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryStates> {
  previousPath: string | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false, error: null };
  }

  componentDidMount() {
    this.previousPath = location.pathname;
  }

  resetError() {
    this.state.hasError && this.setState({ hasError: false });
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (!hasError) {
      return children;
    }

    if (!fallback) {
      console.error('ErrorBoundary의 fallback props가 정의되지 않았습니다.');
      return <>오류가 발생하였습니다.</>;
    }

    const fallbackProps: ErrorBoundaryFallbackProps = {
      status: ':(',
      title: '알 수 없는 오류가 발생하였습니다',
      description: 'Error',
      onResetError: this.resetError.bind(this),
    };

    if (axios.isAxiosError(error)) {
      fallbackProps.status = error.response?.status || ':(';
      fallbackProps.title = error.message || '알 수 없는 오류가 발생하였습니다';
      fallbackProps.description = error.response?.statusText.toLowerCase() || 'Error';
    } else if (error instanceof Error) {
      fallbackProps.status = ':(';
      fallbackProps.title = error.message;
      fallbackProps.description = 'Error';
    }

    return React.createElement(fallback, fallbackProps);
  }
}

export default ErrorBoundary;
