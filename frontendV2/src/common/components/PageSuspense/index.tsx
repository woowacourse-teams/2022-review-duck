import React, { useContext, useEffect, Suspense } from 'react';

import PageProgress from './PagePrgress';
import PageSuspenseProvider, { SetPageLoadedContext, SuspenseFallbackContext } from './Provider';

import styles from './styles.module.scss';

interface ProviderProps {
  children: React.ReactNode;
}

function SuspenseContainer({ children }: ProviderProps) {
  const setPageLoaded = useContext(SetPageLoadedContext);
  const fallbackContext = useContext(SuspenseFallbackContext);

  if (!fallbackContext) {
    throw new Error(
      'SuspenseFallbackProvider가 호출되지 않았거나, 상태 업데이트에 문제가 있습니다.',
    );
  }

  const { fallbackRef } = fallbackContext;

  const FallbackComponent = () => {
    useEffect(() => {
      setPageLoaded && setPageLoaded(false);
    }, []);
    return <div className={styles.fallback}>{fallbackRef.current}</div>;
  };

  return (
    <>
      <PageProgress />
      <Suspense fallback={<FallbackComponent />}>{children}</Suspense>
    </>
  );
}

function PageChildrenWrapper(children: JSX.Element) {
  const context = useContext(SuspenseFallbackContext);
  const setPageLoaded = useContext(SetPageLoadedContext);

  if (!context) {
    throw new Error(
      'SuspenseFallbackProvider가 호출되지 않았거나, 상태 업데이트에 문제가 있습니다.',
    );
  }

  useEffect(() => {
    context.setFallback(children);
    setPageLoaded && setPageLoaded(true);

    return () => context.setFallback(null);
  }, [children]);

  return <div className={styles.content}>{children}</div>;
}

const PageSuspense = Object.assign(SuspenseContainer, {
  Provider: PageSuspenseProvider,
  subscribe: PageChildrenWrapper,
});

export default PageSuspense;
