import React, { useContext, useEffect, Suspense, useRef } from 'react';

import { useSetRecoilState } from 'recoil';

import styles from './styles.module.scss';

import PageProgress from './PagePrgress';
import { pageLoadedAtom, SuspenseContext } from './store';

interface ProviderProps {
  children: React.ReactNode;
}

function Provider({ children }: ProviderProps) {
  const fallbackChildrenRef = useRef<React.ReactNode>(null);
  const setPageLoaded = useSetRecoilState(pageLoadedAtom);
  const setFallback = (children: React.ReactNode) => {
    fallbackChildrenRef.current = children;
  };

  const FallbackContent = () => {
    setPageLoaded(false);
    return <div className={styles.fallback}>{fallbackChildrenRef.current}</div>;
  };

  return (
    <SuspenseContext.Provider value={{ fallbackChildrenRef, setFallback }}>
      <PageProgress />
      <Suspense fallback={<FallbackContent />}>{children}</Suspense>
    </SuspenseContext.Provider>
  );
}

function PageChildrenWrapper(children: JSX.Element) {
  const context = useContext(SuspenseContext);

  const setPageLoaded = useSetRecoilState(pageLoadedAtom);

  if (!context) {
    throw new Error(
      'PageSuspense.Provider가 사용되지 않았습니다. 상위 컴포넌트에서 추가하여주세요.',
    );
  }

  useEffect(() => {
    context.setFallback(children);
    setPageLoaded(true);

    return () => context.setFallback(null);
  }, [children]);

  return <div className={styles.content}>{children}</div>;
}

const PageSuspense = Object.assign(PageChildrenWrapper, {
  Provider,
});

export default PageSuspense;
