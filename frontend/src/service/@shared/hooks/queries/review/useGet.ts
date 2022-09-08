import { useQuery, UseQueryOptions } from 'react-query';

import { reviewAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { ErrorResponse, ReviewAnswer, ReviewForm, ReviewFormAnswerList } from 'types';
import 'types';

function useGetReviewForm(
  reviewFormCode: string,
  queryOptions?: UseQueryOptions<ReviewForm, ErrorResponse>,
) {
  return useQuery<ReviewForm, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW_FORM, QUERY_KEY.API.GET_REVIEW_FORM, { reviewFormCode }],
    () => reviewAPI.getForm(reviewFormCode),
    {
      ...queryOptions,
    },
  );
}

function useGetReviewAnswer(
  reviewId: number,
  queryOptions?: UseQueryOptions<ReviewAnswer, ErrorResponse>,
) {
  return useQuery<ReviewAnswer, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEW, { reviewId }],
    () => reviewAPI.getAnswer(reviewId),
    {
      ...queryOptions,
    },
  );
}

interface UseGetReviewFormAnswer {
  reviewFormCode: string;
  display?: string;
}

function useGetReviewFormAnswer(
  { reviewFormCode, display }: UseGetReviewFormAnswer,
  queryOptions?: UseQueryOptions<ReviewFormAnswerList, ErrorResponse>,
) {
  return useQuery<ReviewFormAnswerList, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEWS, { reviewFormCode, display }],
    () => reviewAPI.getFormAnswer(reviewFormCode, display),
    {
      ...queryOptions,
    },
  );
}

export { useGetReviewForm, useGetReviewFormAnswer, useGetReviewAnswer };
