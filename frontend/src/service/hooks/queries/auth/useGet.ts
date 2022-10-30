import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { authAPI } from 'api';

import { UserProfileResponse, CreateRefreshResponse } from 'service/types';
import { ErrorResponse } from 'service/types';

import { ACCESS_TOKEN_REFRESH_TIME, PERMISSION_VALID_TIME, QUERY_KEY } from 'constant';

function useGetAccessToken(queryOptions?: UseQueryOptions<CreateRefreshResponse, ErrorResponse>) {
  return useQuery<CreateRefreshResponse, ErrorResponse>(
    [QUERY_KEY.DATA.AUTH, QUERY_KEY.API.GET_ACCESS_TOKEN],
    () => authAPI.getRefreshedAccessToken(),
    {
      useErrorBoundary: false,
      staleTime: ACCESS_TOKEN_REFRESH_TIME,
      refetchInterval: ACCESS_TOKEN_REFRESH_TIME,
      refetchIntervalInBackground: true,
      refetchOnReconnect: true,
      ...queryOptions,
    },
  );
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
