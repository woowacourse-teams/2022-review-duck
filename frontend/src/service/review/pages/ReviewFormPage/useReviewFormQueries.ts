import { ReviewForm } from 'service/@shared/types/review';

import {
  useCreateReviewForm,
  useGetReviewForm,
  useUpdateReviewForm,
} from 'service/@shared/hooks/queries/review';

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
