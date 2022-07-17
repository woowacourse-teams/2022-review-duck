import { ReviewFormRequest } from '../types';

import { request } from 'common/utils';

const getFormData = async (reviewFormCode: string) =>
  (await request.get(`/api/review-forms/${reviewFormCode}`)).data;

const createForm = async (query: ReviewFormRequest) =>
  (await request.post('/api/review-forms', query)).data;

const updateForm = async ({ reviewFormCode, reviewTitle, questions }: ReviewFormRequest) =>
  (await request.put(`/api/review-forms/${reviewFormCode}`, { reviewTitle, questions })).data;

const reviewAPI = {
  getFormData,
  createForm,
  updateForm,
};

export default reviewAPI;
