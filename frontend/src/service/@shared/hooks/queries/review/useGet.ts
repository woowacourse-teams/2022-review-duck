import { useQuery, UseQueryOptions } from 'react-query';

import {
  ErrorResponse,
  GetReviewAnswerResponse,
  GetReviewFormAnswerResponse,
  GetReviewFormResponse,
} from 'service/@shared/types';
import 'service/@shared/types';

import { reviewAPI } from 'service/@shared/api';
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

function useGetReviewFormAnswer(
  reviewFormCode: string,
  queryOptions?: UseQueryOptions<GetReviewFormAnswerResponse, ErrorResponse>,
) {
  return useQuery<GetReviewFormAnswerResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEWS, { reviewFormCode }],
    () => reviewAPI.getFormAnswer(reviewFormCode),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

function useGetReviewAnswer(
  reviewId: number,
  queryOptions?: UseQueryOptions<GetReviewAnswerResponse, ErrorResponse>,
) {
  return useQuery<GetReviewAnswerResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEW, { reviewId }],
    () => reviewAPI.getAnswer(reviewId),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export { useGetReviewForm, useGetReviewFormAnswer, useGetReviewAnswer };
