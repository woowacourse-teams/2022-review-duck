import { useQuery, UseQueryOptions } from 'react-query';

import { CreateRefreshResponse } from 'service/@shared/types';
import { ErrorResponse } from 'service/review/types';

import { userAPI } from 'service/@shared/api';
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_REFRESH_TIME,
  QUERY_KEY,
} from 'service/@shared/constants';

function useGetAccessToken(queryOptions?: UseQueryOptions<CreateRefreshResponse, ErrorResponse>) {
  return useQuery<CreateRefreshResponse, ErrorResponse>(
    [QUERY_KEY.DATA.USER, QUERY_KEY.API.GET_ACCESS_TOKEN],
    () => userAPI.getRefreshedAccessToken(),
    {
      suspense: true,
      useErrorBoundary: false,
      staleTime: ACCESS_TOKEN_EXPIRE_TIME,
      refetchInterval: ACCESS_TOKEN_REFRESH_TIME,
      refetchIntervalInBackground: true,
      ...queryOptions,
    },
  );
}

export default useGetAccessToken;
