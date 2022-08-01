import {
  UpdateReviewFormRequest,
  SubmitAnswerRequest,
  GetReviewFormResponse,
  UpdateReviewFormResponse,
  GetReviewsResponse,
} from '../types';

import axiosInstance from 'service/@shared/api/axiosInstance';

const getForm = async (reviewFormCode = ''): Promise<GetReviewFormResponse> => {
  const { data } = await axiosInstance.get(`/api/review-forms/${reviewFormCode}`);

  return data;
};

const createForm = async (query: UpdateReviewFormRequest): Promise<UpdateReviewFormResponse> => {
  const { data } = await axiosInstance.post('/api/review-forms', query);

  return data;
};

const updateForm = async ({
  reviewFormCode,
  reviewTitle,
  questions,
}: UpdateReviewFormRequest): Promise<UpdateReviewFormResponse> => {
  const { data } = await axiosInstance.put(`/api/review-forms/${reviewFormCode}`, {
    reviewTitle,
    questions,
  });

  return data;
};

const getReviews = async (reviewFormCode = ''): Promise<GetReviewsResponse> => {
  const { data } = await axiosInstance.get(`/api/review-forms/${reviewFormCode}/reviews`);

  return data;
};

const submitAnswer = async (query: SubmitAnswerRequest): Promise<null> => {
  const { data } = await axiosInstance.post(`/api/review-forms/${query.reviewFormCode}`, {
    answers: query.answers,
    nickname: query.nickname,
  });

  return data;
};

const deleteReview = async (reviewId: number): Promise<null> => {
  const { data } = await axiosInstance.delete(`api/reviews/${reviewId}`);

  return data;
};

const deleteReviewForm = async (reviewFormCode = ''): Promise<null> => {
  const { data } = await axiosInstance.delete(`api/review-forms/${reviewFormCode}`);

  return data;
};

const reviewAPI = {
  getForm,
  createForm,
  updateForm,
  getReviews,
  submitAnswer,
  deleteReview,
  deleteReviewForm,
};

export default reviewAPI;
