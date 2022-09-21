import { useInfiniteQuery, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { reviewAPI } from 'api';
import { PAGE_OPTION, QUERY_KEY } from 'constant';
import {
  ErrorResponse,
  InfiniteItem,
  ReviewAnswer,
  ReviewForm,
  ReviewFormAnswerList,
  ReviewPublicAnswerList,
} from 'types';
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

function useGetInfiniteReviewPublicAnswer(queryOptions?: any) {
  const fetchFunc = async ({ pageParam = 1 }) => {
    const data = await reviewAPI.getPublicAnswer(String(pageParam), PAGE_OPTION.REVIEW_ITEM_SIZE);

    return {
      data,
      currentPage: pageParam,
    };
  };

  return useInfiniteQuery<InfiniteItem<ReviewPublicAnswerList>>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEW_PUBLIC_ANSWER],
    fetchFunc,
    {
      getNextPageParam: (lastItem) =>
        lastItem.data.isLastPage ? undefined : lastItem.currentPage + 1,
      ...queryOptions,
    },
  );
}

export {
  useGetReviewForm,
  useGetReviewFormAnswer,
  useGetReviewAnswer,
  useGetInfiniteReviewPublicAnswer,
};
