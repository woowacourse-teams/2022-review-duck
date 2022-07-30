import { useQuery, UseQueryOptions } from 'react-query';

import { UserProfileResponse } from 'service/@shared/types';
import { ErrorResponse } from 'service/review/types';

import { userAPI } from 'service/@shared/api';
import { ACCESS_VALID_TIME, QUERY_KEY } from 'service/@shared/constants';

function useGetUserProfile(queryOptions?: UseQueryOptions<UserProfileResponse, ErrorResponse>) {
  return useQuery<UserProfileResponse, ErrorResponse>(
    [QUERY_KEY.DATA.USER, QUERY_KEY.API.GET_USER_PROFILE],
    () => userAPI.getProfile(),
    {
      suspense: true,
      useErrorBoundary: false,
      staleTime: ACCESS_VALID_TIME,
      ...queryOptions,
    },
  );
}

export default useGetUserProfile;
