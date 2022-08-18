import {
  GetUserProfileResponse,
  GetUserReviewAnswerResponse,
  GetUserReviewFormsResponse,
} from '../types';

import { API_URI } from '../constants';
import axiosInstance from 'service/@shared/api/config/axiosInstance';

export const getUserReviewAnswers = async (
  socialId: number,
): Promise<GetUserReviewAnswerResponse> => {
  const { data } = await axiosInstance.get(`${API_URI.USER.GET_REVIEW_ANSWERS}?member=${socialId}`);

  return data;
};

export const getUserReviewForms = async (socialId: number): Promise<GetUserReviewFormsResponse> => {
  const { data } = await axiosInstance.get(`${API_URI.USER.GET_REVIEW_FORMS}?member=${socialId}`);

  return data;
};

export const getUserProfile = async (socialId: number): Promise<GetUserProfileResponse> => {
  const { data } = await axiosInstance.get(API_URI.USER.GET_PROFILE(socialId));

  return data;
};
