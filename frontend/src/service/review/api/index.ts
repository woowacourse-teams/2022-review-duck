import { ReviewFormRequest, SubmitAnswerRequest } from '../types';

import { axiosInstance } from 'service/@shared/utils';

const getForm = async (reviewFormCode = '') =>
  (await axiosInstance.get(`/api/review-forms/${reviewFormCode}`)).data;

const createForm = async (query: ReviewFormRequest) =>
  (await axiosInstance.post('/api/review-forms', query)).data;

const updateForm = async ({ reviewFormCode, reviewTitle, questions }: ReviewFormRequest) =>
  (await axiosInstance.put(`/api/review-forms/${reviewFormCode}`, { reviewTitle, questions })).data;

const submitAnswer = async (query: SubmitAnswerRequest) =>
  (
    await axiosInstance.post(`/api/review-forms/${query.reviewFormCode}`, {
      answers: query.answers,
      nickname: query.nickname,
    })
  ).data;

const getReviews = async (reviewFormCode = '') =>
  (await axiosInstance.get(`api/review-forms/${reviewFormCode}/reviews`)).data;

const reviewAPI = {
  getForm,
  createForm,
  updateForm,
  submitAnswer,
  getReviews,
};

export default reviewAPI;
