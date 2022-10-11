import { ReactNode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import PageRoutes from 'PageRoutes';
import { RecoilRoot } from 'recoil';

import { ErrorBoundary, SnackbarProvider } from 'common/components';

import ModalProvider from 'service/@shared/components/ModalProvider';

import queryClient from 'api/config/queryClient';
import ErrorPage from 'service/@shared/pages/ErrorPage';
import 'styles/@app.scss';

function ContextWrapper({ children }: { children: ReactNode }) {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ModalProvider />
          {children}
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
