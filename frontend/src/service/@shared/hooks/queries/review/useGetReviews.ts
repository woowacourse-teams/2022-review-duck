import { useQuery, UseQueryOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types';
import { GetReviewsResponse } from 'service/@shared/types/review';

import reviewAPI from 'service/@shared/api/review';
import { QUERY_KEY } from 'service/@shared/constants';

function useGetReviews(
  reviewFormCode: string,
  queryOptions?: UseQueryOptions<GetReviewsResponse, ErrorResponse>,
) {
  return useQuery<GetReviewsResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEWS, { reviewFormCode }],
    () => reviewAPI.getReviews(reviewFormCode),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export default useGetReviews;
