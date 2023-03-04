import { QueryClient } from '@tanstack/react-query';

import { authAPI } from 'api';
import axios from 'axios';

import { QUERY_KEY } from 'constant';

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

// 인증 정보가 필요한 API 요청을 위해 access token을 미리 가져온다.
queryClient.prefetchQuery({
  queryFn: () => authAPI.getRefreshedAccessToken(),
  queryKey: [QUERY_KEY.DATA.AUTH, QUERY_KEY.API.GET_ACCESS_TOKEN],
});

export default queryClient;
