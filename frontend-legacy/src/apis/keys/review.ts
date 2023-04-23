import {
  RequestGetPublicReviewList,
  RequestGetReviewForm,
  RequestGetReviewFormReviewList,
} from 'apis/review';

import { createQueryKeys } from 'utils/query-key-factory';

export const reviewQueryKeys = createQueryKeys('review', {
  getReviewForm: (params?: RequestGetReviewForm) => ['getReviewForm', params],
  getReviewFormReviewList: (params?: RequestGetReviewFormReviewList) => [
    'getReviewFormReviewList',
    params,
  ],
  getPublicReviewList: (params?: RequestGetPublicReviewList) => ['getPublicReviewFormList', params],
});
