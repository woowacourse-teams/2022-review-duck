import { ReviewFormRequest, SubmitAnswer } from '../types';

import { request } from 'common/utils';

const getFormData = async (reviewFormCode: string) =>
  (await request.get(`/api/review-forms/${reviewFormCode}`)).data;

const createForm = async (query: ReviewFormRequest) =>
  (await request.post('/api/review-forms', query)).data;

const updateForm = async ({ reviewFormCode, reviewTitle, questions }: ReviewFormRequest) =>
  (await request.put(`/api/review-forms/${reviewFormCode}`, { reviewTitle, questions })).data;

const getQuestions = async (reviewFormCode: string) =>
  (await request.get(`/api/review-forms/${reviewFormCode}`)).data;

const submitAnswer = async (query: SubmitAnswer) =>
  (
    await request.post(`/api/review-forms/${query.reviewFormCode}`, {
      answers: query.answers,
      nickname: query.nickname,
    })
  ).data;

const reviewAPI = {
  getFormData,
  createForm,
  updateForm,
  getQuestions,
  submitAnswer,
};

export default reviewAPI;
