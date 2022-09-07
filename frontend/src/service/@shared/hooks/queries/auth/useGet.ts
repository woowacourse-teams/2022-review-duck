import { useQuery, UseQueryOptions } from 'react-query';

import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_REFRESH_TIME,
  PERMISSION_VALID_TIME,
  QUERY_KEY,
} from 'constant';

import { UserProfileResponse, CreateRefreshResponse } from 'service/@shared/types';
import { ErrorResponse } from 'service/@shared/types';

import authAPI from 'api/auth';

function useGetAccessToken(queryOptions?: UseQueryOptions<CreateRefreshResponse, ErrorResponse>) {
  return useQuery<CreateRefreshResponse, ErrorResponse>(
    [QUERY_KEY.DATA.AUTH, QUERY_KEY.API.GET_ACCESS_TOKEN],
    () => authAPI.getRefreshedAccessToken(),
    {
      useErrorBoundary: false,
      staleTime: ACCESS_TOKEN_EXPIRE_TIME,
      refetchInterval: ACCESS_TOKEN_REFRESH_TIME,
      refetchIntervalInBackground: true,
      ...queryOptions,
    },
  );

  // TODO: 402 에러 시, 메시지 변경 처리.
}

function useGetAuthProfile(queryOptions?: UseQueryOptions<UserProfileResponse, ErrorResponse>) {
  return useQuery<UserProfileResponse, ErrorResponse>(
    [QUERY_KEY.DATA.AUTH, QUERY_KEY.API.GET_AUTH_MY_PROFILE],
    () => authAPI.getProfile(),
    {
      useErrorBoundary: false,
      staleTime: PERMISSION_VALID_TIME,
      ...queryOptions,
    },
  );
}

export { useGetAccessToken, useGetAuthProfile };
