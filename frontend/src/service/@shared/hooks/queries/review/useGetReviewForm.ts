import { useQuery, UseQueryOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types';
import { GetReviewFormResponse } from 'service/@shared/types/review';

import reviewAPI from 'service/@shared/api/review';
import { QUERY_KEY } from 'service/@shared/constants';

function useGetReviewForm(
  reviewFormCode: string,
  queryOptions?: UseQueryOptions<GetReviewFormResponse, ErrorResponse>,
) {
  return useQuery<GetReviewFormResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW_FORM, QUERY_KEY.API.GET_REVIEW_FORM, { reviewFormCode }],
    () => reviewAPI.getForm(reviewFormCode),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export default useGetReviewForm;
