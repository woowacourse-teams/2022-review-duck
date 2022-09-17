import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { userAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { ErrorResponse, GetUserProfileResponse, UserItemList } from 'types';

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
  queryOptions?: UseQueryOptions<UserItemList, ErrorResponse>,
) {
  return useQuery<UserItemList, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW_FORM, QUERY_KEY.API.GET_USER_REVIEW_FORMS, { socialId, pageNumber }],
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
  queryOptions?: UseQueryOptions<UserItemList, ErrorResponse>,
) {
  return useQuery<UserItemList, ErrorResponse>(
    [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_USER_REVIEWS, { socialId, pageNumber }],
    () => userAPI.getUserReviewAnswers(socialId, pageNumber),
    {
      ...queryOptions,
      keepPreviousData: true,
    },
  );
}

function useGetUserTemplates(
  socialId: number,
  pageNumber: string,
  queryOptions?: UseQueryOptions<UserItemList, ErrorResponse>,
) {
  return useQuery<UserItemList, ErrorResponse>(
    [QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_USER_TEMPLATES, { socialId, pageNumber }],
    () => userAPI.getUserTemplates(socialId, pageNumber),
    {
      ...queryOptions,
      keepPreviousData: true,
    },
  );
}

export { useGetUserProfile, useGetUserReviewForms, useGetUserTemplates, useGetUserReviewAnswer };
