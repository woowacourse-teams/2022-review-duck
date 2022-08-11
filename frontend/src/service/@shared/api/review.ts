import {
  UpdateReviewFormRequest,
  SubmitAnswerRequest,
  GetReviewFormResponse,
  UpdateReviewFormResponse,
  GetReviewsResponse,
  GetReviewResponse,
  UpdateReviewRequest,
} from '../types';

import axiosInstance from 'service/@shared/api/config/axiosInstance';

export const getForm = async (reviewFormCode = ''): Promise<GetReviewFormResponse> => {
  const { data } = await axiosInstance.get(`/api/review-forms/${reviewFormCode}`);

  return data;
};

export const getAnswer = async (reviewId: number): Promise<GetReviewResponse> => {
  const { data } = await axiosInstance.get(`/api/reviews/${reviewId}`);

  return data;
};

export const getFormAnswer = async (reviewFormCode = ''): Promise<GetReviewsResponse> => {
  const { data } = await axiosInstance.get(`/api/review-forms/${reviewFormCode}/reviews`);

  return data;
};

export const createForm = async (
  query: UpdateReviewFormRequest,
): Promise<UpdateReviewFormResponse> => {
  const { data } = await axiosInstance.post('/api/review-forms', query);

  return data;
};

export const createAnswer = async (query: SubmitAnswerRequest): Promise<null> => {
  const { data } = await axiosInstance.post(`/api/review-forms/${query.reviewFormCode}`, {
    answers: query.answers,
  });

  return data;
};

export const updateForm = async ({
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

export const updateAnswer = async (query: UpdateReviewRequest): Promise<null> => {
  const { data } = await axiosInstance.put(`/api/reviews/${query.reviewId}`, {
    answers: query.answers,
  });

  return data;
};

export const deleteForm = async (reviewFormCode = ''): Promise<null> => {
  const { data } = await axiosInstance.delete(`api/review-forms/${reviewFormCode}`);

  return data;
};

export const deleteAnswer = async (reviewId: number): Promise<null> => {
  const { data } = await axiosInstance.delete(`api/reviews/${reviewId}`);

  return data;
};
