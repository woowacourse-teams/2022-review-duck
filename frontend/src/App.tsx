import { ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

import PageRoutes from 'PageRoutes';

import { ErrorBoundary } from 'common/components';

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
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function App() {
  return (
    <ContextWrapper>
      <ErrorBoundary>
        <PageRoutes />
      </ErrorBoundary>
    </ContextWrapper>
  );
}

export default App;
