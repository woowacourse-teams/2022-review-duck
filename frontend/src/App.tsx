import { ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

import PageRoutes from 'PageRoutes';

import 'styles/@app.scss';

const queryClient = new QueryClient();

function ContextRapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function App() {
  return (
    <ContextRapper>
      <PageRoutes />
    </ContextRapper>
  );
}

export default App;
