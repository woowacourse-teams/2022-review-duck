import * as UserType from '../service/types';

import { API_URI, FILTER, PAGE_OPTION } from '../constant';
import * as transformer from './user.transformer';
import axiosInstance from 'api/config/axiosInstance';

export const getUserReviewAnswers = async (
  socialId: number,
  pageNumber: number,
): Promise<UserType.UserArticleList> => {
  const { data } = await axiosInstance.get(
    `${API_URI.USER.GET_REVIEW_ANSWERS}?member=${socialId}&${FILTER.PAGE}=${pageNumber}&${FILTER.SIZE}=${PAGE_OPTION.REVIEW_ITEM_SIZE}`,
  );

  return transformer.transformUserReviews(data);
};

export const getUserReviewForms = async (
  socialId: number,
  pageNumber: number,
): Promise<UserType.UserArticleList> => {
  const { data } = await axiosInstance.get(
    `${API_URI.USER.GET_REVIEW_FORMS}?member=${socialId}&${FILTER.PAGE}=${pageNumber}&${FILTER.SIZE}=${PAGE_OPTION.REVIEW_ITEM_SIZE}`,
  );

  return transformer.transformUserReviewForms(data);
};

export const getUserTemplates = async (
  socialId: number,
  pageNumber: number,
): Promise<UserType.UserArticleList> => {
  const { data } = await axiosInstance.get(
    `${API_URI.USER.GET_TEMPLATES(socialId)}&${FILTER.PAGE}=${pageNumber}&${FILTER.SIZE}=${
      PAGE_OPTION.USER_TEMPLATE_SIZE
    }`,
  );

  return transformer.transformUserTemplates(data);
};

export const getUserProfile = async (
  socialId: number,
): Promise<UserType.GetUserProfileResponse> => {
  const { data } = await axiosInstance.get(API_URI.USER.GET_PROFILE(socialId));

  return data;
};

export const updateProfile = async (nickname: string): Promise<UserType.UpdateProfileResponse> => {
  const { data } = await axiosInstance.put(API_URI.USER.UPDATE_PROFILE, { nickname });

  return data;
};
