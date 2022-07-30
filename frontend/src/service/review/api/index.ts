import {
  UpdateReviewFormRequest,
  SubmitAnswerRequest,
  CreateReviewAnswer,
  GetReviewsResponse,
  GetReviewFormResponse,
  UpdateReviewFormResponse,
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

const submitAnswer = async (query: SubmitAnswerRequest): Promise<CreateReviewAnswer> => {
  const { data } = await axiosInstance.post(`/api/review-forms/${query.reviewFormCode}`, {
    answers: query.answers,
    nickname: query.nickname,
  });

  return data;
};

const getReviews = async (reviewFormCode = ''): Promise<GetReviewsResponse> => {
  const { data } = await axiosInstance.get(`api/review-forms/${reviewFormCode}/reviews`);

  return data;
};

const reviewAPI = {
  getForm,
  createForm,
  updateForm,
  submitAnswer,
  getReviews,
};

export default reviewAPI;
