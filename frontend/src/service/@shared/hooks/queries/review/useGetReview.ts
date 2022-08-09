import { useQuery, UseQueryOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types';
import { GetReviewResponse } from 'service/@shared/types/review';

import reviewAPI from 'service/@shared/api/review';
import { QUERY_KEY } from 'service/@shared/constants';

function useGetReview(
  reviewId: number,
  queryOptions?: UseQueryOptions<GetReviewResponse, ErrorResponse>,
) {
  return useQuery<GetReviewResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEW, { reviewId }],
    () => reviewAPI.getReview(reviewId),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export default useGetReview;
