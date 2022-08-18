import { useQuery, UseQueryOptions } from 'react-query';

import {
  GetUserReviewAnswerResponse,
  GetUserReviewFormsResponse,
  ErrorResponse,
  GetUserProfileResponse,
} from 'service/@shared/types';

import { userAPI } from 'service/@shared/api';
import { QUERY_KEY } from 'service/@shared/constants';

interface UseGetUserProfile {
  socialId: number;
}

function useGetUserProfile(
  { socialId }: UseGetUserProfile,
  queryOptions?: UseQueryOptions<GetUserProfileResponse, ErrorResponse>,
) {
  return useQuery<GetUserProfileResponse, ErrorResponse>(
    [QUERY_KEY.DATA.USER, QUERY_KEY.API.GET_USER_PROFILE, { socialId }],
    () => userAPI.getUserProfile(socialId),
    {
      ...queryOptions,
    },
  );
}

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

export { useGetUserProfile, useGetUserReviewForms, useGetUserReviewAnswer };
