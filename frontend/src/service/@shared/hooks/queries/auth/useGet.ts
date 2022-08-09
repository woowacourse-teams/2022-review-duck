import { useQuery, UseQueryOptions } from 'react-query';

import { UserProfileResponse, CreateRefreshResponse } from 'service/@shared/types';
import { ErrorResponse } from 'service/@shared/types';

import authAPI from 'service/@shared/api/auth';
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_REFRESH_TIME,
  PERMISSION_VALID_TIME,
  QUERY_KEY,
} from 'service/@shared/constants';

function useGetAccessToken(queryOptions?: UseQueryOptions<CreateRefreshResponse, ErrorResponse>) {
  return useQuery<CreateRefreshResponse, ErrorResponse>(
    [QUERY_KEY.DATA.USER, QUERY_KEY.API.GET_ACCESS_TOKEN],
    () => authAPI.getRefreshedAccessToken(),
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

function useGetUserInfo(queryOptions?: UseQueryOptions<UserProfileResponse, ErrorResponse>) {
  return useQuery<UserProfileResponse, ErrorResponse>(
    [QUERY_KEY.DATA.USER, QUERY_KEY.API.GET_USER_PROFILE],
    () => authAPI.getProfile(),
    {
      suspense: true,
      useErrorBoundary: false,
      staleTime: PERMISSION_VALID_TIME,
      ...queryOptions,
    },
  );
}

export { useGetAccessToken, useGetUserInfo };
