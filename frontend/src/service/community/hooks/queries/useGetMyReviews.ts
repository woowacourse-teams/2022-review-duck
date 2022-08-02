import { useQuery, UseQueryOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types/index';
import { GetMyReviewsResponse } from 'service/community/types';

import { QUERY_KEY } from 'service/@shared/constants';
import myReviewAPI from 'service/community/api';

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
