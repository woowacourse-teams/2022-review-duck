import {
  GetUserProfileResponse,
  GetUserReviewAnswerResponse,
  GetUserReviewFormsResponse,
  UpdateProfileResponse,
} from '../types';

import { API_URI, PAGE_OPTION } from '../constant';
import axiosInstance from 'api/config/axiosInstance';

export const getUserReviewAnswers = async (
  socialId: number,
  pageNumber: string,
): Promise<GetUserReviewAnswerResponse> => {
  const { data } = await axiosInstance.get(
    `${API_URI.USER.GET_REVIEW_ANSWERS}?member=${socialId}&page=${pageNumber}&size=${PAGE_OPTION.REVIEW_ITEM_SIZE}`,
  );

  return data;
};

export const getUserReviewForms = async (
  socialId: number,
  pageNumber: string,
): Promise<GetUserReviewFormsResponse> => {
  const { data } = await axiosInstance.get(
    `${API_URI.USER.GET_REVIEW_FORMS}?member=${socialId}&page=${pageNumber}&size=${PAGE_OPTION.REVIEW_ITEM_SIZE}`,
  );

  return data;
};

export const getUserProfile = async (socialId: number): Promise<GetUserProfileResponse> => {
  const { data } = await axiosInstance.get(API_URI.USER.GET_PROFILE(socialId));

  return data;
};

export const updateProfile = async (nickname: string): Promise<UpdateProfileResponse> => {
  const { data } = await axiosInstance.put(API_URI.USER.UPDATE_PROFILE, { nickname });

  return data;
};
