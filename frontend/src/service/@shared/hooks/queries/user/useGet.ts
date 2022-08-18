import { useQuery, UseQueryOptions } from 'react-query';

import {
  GetUserReviewAnswerResponse,
  GetUserReviewFormsResponse,
  ErrorResponse,
} from 'service/@shared/types';

import { userAPI } from 'service/@shared/api';
import { QUERY_KEY } from 'service/@shared/constants';

function useGetUserReviewForms(
  socialId: number,
  queryOptions?: UseQueryOptions<GetUserReviewFormsResponse, ErrorResponse>,
) {
  return useQuery<GetUserReviewFormsResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW_FORM, QUERY_KEY.API.GET_MY_REVIEW_FORMS],
    () => userAPI.getUserReviewForms(socialId),
    {
      ...queryOptions,
    },
  );
}

function useGetUserReviewAnswer(
  socialId: number,
  queryOptions?: UseQueryOptions<GetUserReviewAnswerResponse, ErrorResponse>,
) {
  return useQuery<GetUserReviewAnswerResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_MY_REVIEWS],
    () => userAPI.getUserReviewAnswers(socialId),
    {
      ...queryOptions,
    },
  );
}

export { useGetUserReviewForms, useGetUserReviewAnswer };
