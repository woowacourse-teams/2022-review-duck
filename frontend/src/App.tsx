import { ReactNode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import PageRoutes from 'PageRoutes';
import { RecoilRoot } from 'recoil';

import { ErrorBoundary, SnackbarProvider } from 'common/components';

import queryClient from 'api/config/queryClient';
import UserAgentProvider from 'common/contexts/UserAgent';
import ModalProvider from 'service/components/ModalProvider';
import ErrorPage from 'service/pages/ErrorPage';
import 'styles/@app.scss';

function ContextWrapper({ children }: { children: ReactNode }) {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ModalProvider />
          <UserAgentProvider>{children}</UserAgentProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}

function App() {
  return (
    <ContextWrapper>
      <SnackbarProvider />
      <Suspense>
        <ErrorBoundary fallback={ErrorPage}>
          <PageRoutes />
        </ErrorBoundary>
      </Suspense>
    </ContextWrapper>
  );
}

export default App;
