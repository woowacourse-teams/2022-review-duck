import { GetMyReviewsResponse, GetMyReviewFormsResponse } from '../types/profile';

import axiosInstance from 'service/@shared/api/config/axiosInstance';

const getMyReviews = async (): Promise<GetMyReviewsResponse> => {
  const { data } = await axiosInstance.get('/api/reviews/me');

  return data;
};

const getMyReviewForms = async (): Promise<GetMyReviewFormsResponse> => {
  const { data } = await axiosInstance.get('/api/review-forms/me');

  return data;
};

const userAPI = {
  getMyReviews,
  getMyReviewForms,
};

export default userAPI;
