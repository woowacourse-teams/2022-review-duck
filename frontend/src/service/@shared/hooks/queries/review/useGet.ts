import { useQuery, UseQueryOptions } from 'react-query';

import { reviewAPI } from 'api';
import { QUERY_KEY } from 'constant';

import {
  ErrorResponse,
  GetReviewAnswerResponse,
  GetReviewFormAnswerResponse,
  GetReviewFormResponse,
  ReviewAnswer,
  ReviewForm,
  ReviewFormAnswerList,
} from 'service/@shared/types';
import 'service/@shared/types';

import { getElapsedTimeText } from 'service/@shared/utils';

function useGetReviewForm(
  reviewFormCode: string,
  queryOptions?: UseQueryOptions<GetReviewFormResponse, ErrorResponse, ReviewForm>,
) {
  return useQuery<GetReviewFormResponse, ErrorResponse, ReviewForm>(
    [QUERY_KEY.DATA.REVIEW_FORM, QUERY_KEY.API.GET_REVIEW_FORM, { reviewFormCode }],
    () => reviewAPI.getForm(reviewFormCode),
    {
      ...queryOptions,

      select: (data) => ({
        title: data.reviewFormTitle,
        questions: data.questions,
        info: {
          creator: data.creator,
          isSelf: data.isCreator,
          updateDate: getElapsedTimeText(data.updatedAt),
        },
      }),
    },
  );
}

function useGetReviewAnswer(
  reviewId: number,
  queryOptions?: UseQueryOptions<GetReviewAnswerResponse, ErrorResponse, ReviewAnswer>,
) {
  return useQuery<GetReviewAnswerResponse, ErrorResponse, ReviewAnswer>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEW, { reviewId }],
    () => reviewAPI.getAnswer(reviewId),
    {
      ...queryOptions,

      select: (data) => ({
        id: data.id,
        questions: data.contents.map((content) => ({
          id: content.question.id,
          value: content.question.value,
          description: content.question.description,
          answer: content.answer,
        })),
        info: {
          creator: data.creator,
          isSelf: data.isCreator,
          updateDate: getElapsedTimeText(data.updatedAt),
        },
      }),
    },
  );
}

interface UseGetReviewFormAnswer {
  reviewFormCode: string;
  display?: string;
}

function useGetReviewFormAnswer(
  { reviewFormCode, display }: UseGetReviewFormAnswer,
  queryOptions?: UseQueryOptions<GetReviewFormAnswerResponse, ErrorResponse, ReviewFormAnswerList>,
) {
  return useQuery<GetReviewFormAnswerResponse, ErrorResponse, ReviewFormAnswerList>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEWS, { reviewFormCode, display }],
    () => reviewAPI.getFormAnswer(reviewFormCode, display),
    {
      ...queryOptions,

      select: (data) =>
        data.map((review) => ({
          id: review.id,
          questions: review.contents.map((content) => ({
            id: content.question.id,
            value: content.question.value,
            description: content.question.description,
            answer: content.answer,
          })),
          info: {
            creator: review.creator,
            isSelf: review.isCreator,
            updateDate: getElapsedTimeText(review.updatedAt),
          },
        })),
    },
  );
}

export { useGetReviewForm, useGetReviewFormAnswer, useGetReviewAnswer };
