import { ReviewForm as GetReviewFormResponse } from 'service/review/types';

import {
  useCreateReviewForm,
  useGetReviewForm,
  useUpdateReviewForm,
} from 'service/review/hooks/queries';

function useReviewFormQueries(reviewFormCode = '') {
  const createMutation = useCreateReviewForm();

  const updateMutation = useUpdateReviewForm(reviewFormCode);

  const reviewFormMutation = reviewFormCode ? updateMutation : createMutation;

  const getReviewFormQuery = useGetReviewForm(reviewFormCode, {
    enabled: !!reviewFormCode,
  });

  const initReviewFormData: GetReviewFormResponse = getReviewFormQuery.data || {
    reviewTitle: '',
    questions: [
      {
        questionValue: '',
        listKey: 'list-0',
      },
    ],
  };

  return { reviewFormMutation, getReviewFormQuery, initReviewFormData };
}

export default useReviewFormQueries;
