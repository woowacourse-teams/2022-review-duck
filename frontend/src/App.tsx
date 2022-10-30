import { ReactNode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import queryClient from 'api/config/queryClient';
import UserAgentProvider from 'common/contexts/UserAgent';
import ErrorPage from 'service/pages/ErrorPage';
import 'styles/@app.scss';

import { RecoilRoot } from 'recoil';
import PageRoutes from 'routes';

import { ErrorBoundary, SnackbarProvider } from 'common/components';
import PageSuspenseProvider from 'common/components/PageSuspense/Provider';

import ModalProvider from 'service/components/ModalProvider';

function ContextWrapper({ children }: { children: ReactNode }) {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ModalProvider />
          <UserAgentProvider>
            <PageSuspenseProvider>{children}</PageSuspenseProvider>
          </UserAgentProvider>
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
