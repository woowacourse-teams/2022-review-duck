import {
  UpdateReviewFormRequest,
  SubmitAnswerRequest,
  GetReviewFormResponse,
  UpdateReviewFormResponse,
  GetReviewsResponse,
  GetReviewResponse,
  UpdateReviewRequest,
} from '../types/review';

import axiosInstance from 'service/@shared/api/config/axiosInstance';

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

const getReview = async (reviewId: number): Promise<GetReviewResponse> => {
  const { data } = await axiosInstance.get(`/api/reviews/${reviewId}`);

  return data;
};

const updateReview = async (query: UpdateReviewRequest): Promise<null> => {
  const { data } = await axiosInstance.put(`/api/reviews/${query.reviewId}`, {
    answers: query.answers,
  });

  return data;
};

const submitAnswer = async (query: SubmitAnswerRequest): Promise<null> => {
  const { data } = await axiosInstance.post(`/api/review-forms/${query.reviewFormCode}`, {
    answers: query.answers,
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
  getReview,
  updateReview,
  submitAnswer,
  deleteReview,
  deleteReviewForm,
};

export default reviewAPI;
