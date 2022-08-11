import { ReactNode, Suspense } from 'react';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

import PageRoutes from 'PageRoutes';
import { RecoilRoot } from 'recoil';

import { ErrorBoundary, ModalProvider, SnackbarProvider } from 'common/components';

import queryClient from 'service/@shared/api/config/queryClient';
import * as modalContentList from 'service/@shared/pages/modals';
import 'styles/@app.scss';

function ContextWrapper({ children }: { children: ReactNode }) {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}

function App() {
  // TODO: 전역 페이지 로딩 화면 구현하기, 페이지 단위로 lazy 로드 처리
  return (
    <ContextWrapper>
      <ErrorBoundary>
        <SnackbarProvider />
        <Suspense>
          <ModalProvider contentList={modalContentList} />
          <PageRoutes />
        </Suspense>
      </ErrorBoundary>
    </ContextWrapper>
  );
}

export default App;
