import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface States {
  hasError: boolean;
  error: unknown;
}

class ErrorBoundary extends Component<Props, States> {
  constructor(props: Props) {
    super(props);

    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: object) {
    return { hasError: true, error };
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      console.error('ErrorBoundary : ', error);
      return <p>엇, 캐치되지 않은 오류가 발견되었습니다.</p>;
    }

    return children;
  }
}

export default ErrorBoundary;
