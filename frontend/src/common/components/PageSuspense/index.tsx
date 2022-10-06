import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  Suspense,
  useRef,
} from 'react';

import { API_REQUEST_TIMEOUT } from 'constant';

import styles from './styles.module.scss';

import ProgressBar from '../ProgressBar';

export interface FallbackContextType {
  setFallback: (children: React.ReactNode) => void /* 
  clearFallback: () => void; */;
}

export const SuspenseContext = createContext<FallbackContextType | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}

function Provider({ children }: ProviderProps) {
  const progress = useRef(0);
  const [fallback, setFallback] = useState<React.ReactNode>(null);

  useEffect(() => {
    return () => {
      progress.current += 1;
    };
  }, [fallback]);

  const memo = useMemo(() => ({ setFallback }), [setFallback]);
  const content = useMemo(() => {
    const fallbackContent = <div className={styles.fallback}>{fallback}</div>;

    return fallback ? (
      <Suspense fallback={fallbackContent}>
        <div className={styles.content}>{children}</div>
      </Suspense>
    ) : (
      children
    );
  }, [children, fallback]);

  return (
    <SuspenseContext.Provider value={memo}>
      <ProgressBar
        key={progress.current}
        className={styles.progress}
        autoFill
        duration={`${500 / 1000}s`}
      />
      {content}
    </SuspenseContext.Provider>
  );
}

function PageChildrenWrapper(children: JSX.Element) {
  const context = useContext(SuspenseContext);

  if (!context) {
    throw new Error(
      'PageSuspense.Provider가 사용되지 않았습니다. 상위 컴포넌트에서 추가하여주세요.',
    );
  }

  useEffect(() => {
    context.setFallback(children);
    return () => context.setFallback(null);
  }, [children]);

  return children;
}

const PageSuspense = Object.assign(PageChildrenWrapper, {
  Provider,
});

export default PageSuspense;
