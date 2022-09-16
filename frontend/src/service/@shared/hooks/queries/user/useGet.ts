import { userAPI } from 'api';
import { QUERY_KEY } from 'constant';
import {
  GetUserReviewAnswerResponse,
  GetUserReviewFormsResponse,
  ErrorResponse,
  GetUserProfileResponse,
} from 'types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

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
  pageNumber: string,
  queryOptions?: UseQueryOptions<GetUserReviewFormsResponse, ErrorResponse>,
) {
  return useQuery<GetUserReviewFormsResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW_FORM, QUERY_KEY.API.GET_MY_REVIEW_FORMS, { socialId, pageNumber }],
    () => userAPI.getUserReviewForms(socialId, pageNumber),
    {
      ...queryOptions,
      keepPreviousData: true,
    },
  );
}

function useGetUserReviewAnswer(
  socialId: number,
  pageNumber: string,
  queryOptions?: UseQueryOptions<GetUserReviewAnswerResponse, ErrorResponse>,
) {
  return useQuery<GetUserReviewAnswerResponse, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_MY_REVIEWS, { socialId, pageNumber }],
    () => userAPI.getUserReviewAnswers(socialId, pageNumber),
    {
      ...queryOptions,
      keepPreviousData: true,
    },
  );
}

export { useGetUserProfile, useGetUserReviewForms, useGetUserReviewAnswer };
