import { Question } from '../types';

import { request } from 'common/utils';

interface CreateFormData {
  reviewTitle?: string;
  questions?: Partial<Question>[];
}

interface UpdateFormData extends CreateFormData {
  reviewFormCode: string;
}

const getFormData = async (reviewFormCode: string) =>
  (await request.get(`/api/review-forms/${reviewFormCode}`)).data;

const createForm = async (query: CreateFormData) =>
  (await request.post('/api/review-forms', query)).data;

const updateForm = async ({ reviewFormCode, reviewTitle, questions }: UpdateFormData) =>
  (await request.put(`/api/review-forms/${reviewFormCode}`, { reviewTitle, questions })).data;

const getQuestions = async (reviewFormCode: string) =>
  (await request.get(`/api/review-forms/${reviewFormCode}`)).data;

const reviewAPI = {
  getFormData,
  createForm,
  updateForm,
  getQuestions,
};

export default reviewAPI;
