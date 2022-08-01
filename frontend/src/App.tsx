import { ReactNode, Suspense } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

import PageRoutes from 'PageRoutes';
import { RecoilRoot } from 'recoil';

import { ErrorBoundary, SnackbarContainer } from 'common/components';

import 'styles/@app.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 60000,
    },
  },
});

function ContextWrapper({ children }: { children: ReactNode }) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RecoilRoot>
  );
}

function App() {
  // TODO: 전역 페이지 로딩 화면 구현하기, 페이지 단위로 lazy 로드 처리
  return (
    <ContextWrapper>
      <Suspense>
        <ErrorBoundary>
          <SnackbarContainer />
          <PageRoutes />
        </ErrorBoundary>
      </Suspense>
    </ContextWrapper>
  );
}

export default App;
