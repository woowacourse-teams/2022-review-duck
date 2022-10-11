import { useInfiniteQuery, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { reviewAPI } from 'api';
import { PAGE_OPTION, QUERY_KEY } from 'constant';
import {
  DisplayModeType,
  ErrorResponse,
  InfiniteItem,
  ReviewAnswer,
  ReviewForm,
  ReviewFormAnswerList,
  ReviewPublicAnswerList,
  TimelineFilterType,
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

function useGetInfiniteReviewFormAnswer(
  reviewFormCode: string,
  display?: DisplayModeType,
  queryOptions?: any,
) {
  const fetchFunc = async ({ pageParam = 1 }) => {
    const data = await reviewAPI.getFormAnswer({
      pageNumber: pageParam,
      size: PAGE_OPTION.REVIEW_ITEM_SIZE,
      reviewFormCode,
      display,
    });

    return {
      data,
      currentPage: pageParam,
    };
  };

  return useInfiniteQuery<InfiniteItem<ReviewFormAnswerList>>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEWS, { display, reviewFormCode }],
    fetchFunc,
    {
      getNextPageParam: (lastItem) =>
        lastItem.data.isLastPage ? undefined : lastItem.currentPage + 1,
      ...queryOptions,
    },
  );
}

function useGetInfiniteReviewPublicAnswer(filter: TimelineFilterType, queryOptions?: any) {
  const fetchFunc = async ({ pageParam = 1 }) => {
    const data = await reviewAPI.getPublicAnswer(
      String(pageParam),
      PAGE_OPTION.REVIEW_ITEM_SIZE,
      filter,
    );

    return {
      data,
      currentPage: pageParam,
    };
  };

  return useInfiniteQuery<InfiniteItem<ReviewPublicAnswerList>>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEW_PUBLIC_ANSWER, { filter }],
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
  useGetReviewAnswer,
  useGetInfiniteReviewPublicAnswer,
  useGetInfiniteReviewFormAnswer,
};
