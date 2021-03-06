import { useQuery, UseQueryOptions } from 'react-query';

import { ErrorResponse, ReviewForm as GetReviewFormResponse } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

function useGetReviewForm(
  reviewFormCode: string,
  queryOptions?: UseQueryOptions<GetReviewFormResponse, ErrorResponse>,
) {
  return useQuery<GetReviewFormResponse, ErrorResponse>(
    [QUERY_KEY.GET_REVIEW_FORM, { reviewFormCode }],
    () => reviewAPI.getForm(reviewFormCode),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export default useGetReviewForm;
