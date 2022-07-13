import { Question } from '../types';

import { request } from 'common/utils';

const createForm = (title: string, questions: Partial<Question>[]) =>
  request('/api/review-forms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      reviewTitle: title,
      questions: questions,
    },
  });

const reviewAPI = {
  createForm,
};

export default reviewAPI;
