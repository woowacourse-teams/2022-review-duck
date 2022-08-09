import { useQuery, UseQueryOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types/index';
import { GetMyReviewsResponse } from 'service/@shared/types/profile';

import myReviewAPI from 'service/@shared/api/user';
import { QUERY_KEY } from 'service/@shared/constants';

function useGetMyReviews(queryOptions?: UseQueryOptions<GetMyReviewsResponse, ErrorResponse>) {
  return useQuery<GetMyReviewsResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_MY_REVIEWS],
    () => myReviewAPI.getMyReviews(),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export default useGetMyReviews;
