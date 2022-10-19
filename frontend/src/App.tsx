import { ReactNode, Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import { RecoilRoot } from 'recoil';

import useAuth from 'service/@shared/hooks/useAuth';

import { ErrorBoundary, SnackbarProvider } from 'common/components';

import ModalProvider from 'service/@shared/components/ModalProvider';

import queryClient from 'api/config/queryClient';
import UserAgentProvider from 'common/contexts/UserAgent';
import ROUTES from 'routes/route';
import ErrorPage from 'service/@shared/pages/ErrorPage';
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

function PageRoute() {
  useAuth();

  const routerDom = useRoutes(ROUTES);

  return routerDom;
}

function App() {
  return (
    <ContextWrapper>
      <SnackbarProvider />
      <Suspense>
        <ErrorBoundary fallback={ErrorPage}>
          <PageRoute />
        </ErrorBoundary>
      </Suspense>
    </ContextWrapper>
  );
}

export default App;
