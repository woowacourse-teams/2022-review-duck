import { useQuery, UseQueryOptions } from 'react-query';

import { GetReviewsResponse, ErrorResponse } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

function useGetReviews(
  reviewFormCode: string,
  queryOptions?: UseQueryOptions<GetReviewsResponse, ErrorResponse>,
) {
  return useQuery<GetReviewsResponse, ErrorResponse>(
    [QUERY_KEY.GET_REVIEWS, { reviewFormCode }],
    () => reviewAPI.getReviews(reviewFormCode),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export default useGetReviews;
