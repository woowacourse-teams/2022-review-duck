import { useQuery, UseQueryOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types';
import { GetReviewResponse } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

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
