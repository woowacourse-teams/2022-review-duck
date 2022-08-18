import { QueryClient } from 'react-query';

import axios from 'axios';

const handleServerException = (count: number, error: unknown): boolean => {
  if (!error || !axios.isAxiosError(error)) return false;

  const isServerExceptionError = !!error.response?.status && error.response?.status >= 500;
  return count < 2 && isServerExceptionError;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 60000,
      retry: handleServerException,
    },
    mutations: {
      retry: handleServerException,
    },
  },
});

export default queryClient;
