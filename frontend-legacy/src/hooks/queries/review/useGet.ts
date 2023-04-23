import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { reviewAPI } from 'api';
import {
  DisplayModeType,
  ErrorResponse,
  ReviewAnswer,
  ReviewForm,
  TimelineFilterType,
} from 'types';
import 'types';

import { QUERY_KEY } from 'constant';

import useInfiniteScrollQuery from '../useInfiniteScrollQuery';

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

function useGetInfiniteReviewFormAnswer(reviewFormCode: string, display?: DisplayModeType) {
  return useInfiniteScrollQuery(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEWS, { display, reviewFormCode }],
    (page) => reviewAPI.getFormAnswer({ pageNumber: page, reviewFormCode, display }),
    'isLastPage',
  );
}

function useGetInfiniteReviewPublicAnswer(filter: TimelineFilterType) {
  return useInfiniteScrollQuery(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEW_PUBLIC_ANSWER, { filter }],
    (page) => reviewAPI.getPublicAnswer({ pageNumber: page, filter }),
    'isLastPage',
  );
}

export {
  useGetReviewForm,
  useGetReviewAnswer,
  useGetInfiniteReviewPublicAnswer,
  useGetInfiniteReviewFormAnswer,
};
