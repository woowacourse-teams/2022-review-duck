import { ReviewForm } from 'service/review/types';

import {
  useCreateReviewForm,
  useGetReviewForm,
  useUpdateReviewForm,
} from 'service/review/hooks/queries';

function useReviewFormQueries(reviewFormCode = '') {
  const createMutation = useCreateReviewForm();

  const updateMutation = useUpdateReviewForm();

  const reviewFormMutation = reviewFormCode ? updateMutation : createMutation;

  const getReviewFormQuery = useGetReviewForm(reviewFormCode, {
    enabled: !!reviewFormCode,
  });

  const initReviewFormData: ReviewForm = getReviewFormQuery.data || {
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
