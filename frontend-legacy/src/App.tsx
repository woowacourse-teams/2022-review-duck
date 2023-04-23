import { ReactNode, Suspense } from 'react';
import { flushSync } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import { authAPI } from 'api';
import queryClient from 'api/config/queryClient';
import UserAgentProvider from 'common/contexts/UserAgent';
import ModalProvider from 'components/ModalProvider';
import { CreateRefreshResponse } from 'models/auth';
import { RecoilRoot } from 'recoil';
import 'styles/@global.scss';

import PageRoutes from 'routes';

import { ErrorBoundary, Snackbar, PageSuspense } from 'common/components';

import ErrorPage from 'pages/ErrorPage';

import { QUERY_KEY } from 'constant';
import { axiosInstanceUtils } from 'utils';

flushSync(async function getUserAccessToken() {
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.DATA.AUTH, QUERY_KEY.API.GET_ACCESS_TOKEN],
    queryFn: () => authAPI.getRefreshedAccessToken(),
  });

  const response = queryClient.getQueryData<CreateRefreshResponse>([
    QUERY_KEY.DATA.AUTH,
    QUERY_KEY.API.GET_ACCESS_TOKEN,
  ]);

  if (!response) return;

  axiosInstanceUtils.setHeader('Authorization', `Bearer ${response.accessToken}`);
});

function ContextWrapper({ children }: { children: ReactNode }) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ModalProvider />
          <UserAgentProvider>
            <PageSuspense.Provider>{children}</PageSuspense.Provider>
          </UserAgentProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

function App() {
  return (
    <ContextWrapper>
      <Snackbar.Provider />
      <Suspense>
        <ErrorBoundary fallback={ErrorPage}>
          <PageRoutes />
        </ErrorBoundary>
      </Suspense>
    </ContextWrapper>
  );
}

export default App;
