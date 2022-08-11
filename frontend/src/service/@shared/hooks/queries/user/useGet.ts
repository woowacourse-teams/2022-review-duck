import { useQuery, UseQueryOptions } from 'react-query';

import {
  GetMyReviewFormsResponse,
  GetMyReviewsResponse,
  ErrorResponse,
} from 'service/@shared/types';

import userAPI from 'service/@shared/api/user';
import { QUERY_KEY } from 'service/@shared/constants';

function useGetMyReviewForms(
  queryOptions?: UseQueryOptions<GetMyReviewFormsResponse, ErrorResponse>,
) {
  return useQuery<GetMyReviewFormsResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW_FORM, QUERY_KEY.API.GET_MY_REVIEW_FORMS],
    () => userAPI.getMyReviewForms(),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

function useGetMyReviews(queryOptions?: UseQueryOptions<GetMyReviewsResponse, ErrorResponse>) {
  return useQuery<GetMyReviewsResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_MY_REVIEWS],
    () => userAPI.getMyReviews(),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export { useGetMyReviewForms, useGetMyReviews };
