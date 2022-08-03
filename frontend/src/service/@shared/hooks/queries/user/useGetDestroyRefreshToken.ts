import { useQuery, UseQueryOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types';

import { userAPI } from 'service/@shared/api';
import { QUERY_KEY } from 'service/@shared/constants';

function useGetDestroyRefreshToken(queryOptions?: UseQueryOptions<null, ErrorResponse>) {
  return useQuery<null, ErrorResponse>(
    [QUERY_KEY.DATA.USER, QUERY_KEY.API.GET_ACCESS_TOKEN],
    () => userAPI.getDestroyRefreshToken(),
    {
      suspense: true,
      useErrorBoundary: false,
      staleTime: 0,
      ...queryOptions,
    },
  );
}

export default useGetDestroyRefreshToken;
