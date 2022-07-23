import { useMutation, useQuery, useQueryClient } from 'react-query';

import { AxiosError } from 'axios';

import {
  ReviewFormRequest,
  ReviewFormResponse,
  ErrorResponse,
  ReviewForm,
} from 'service/review/types';

import reviewAPI from 'service/review/api';

function useReviewFormQueries(reviewFormCode = '') {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    ReviewFormResponse,
    AxiosError<ErrorResponse>,
    ReviewFormRequest
  >(reviewAPI.createForm);

  const updateMutation = useMutation<
    ReviewFormResponse,
    AxiosError<ErrorResponse>,
    ReviewFormRequest
  >(reviewAPI.updateForm, {
    onSuccess: () => {
      queryClient.invalidateQueries(['getReviewForm', { reviewFormCode }]);
      queryClient.invalidateQueries(['getReviews', { reviewFormCode }]);
    },
  });

  const reviewFormMutation = reviewFormCode ? updateMutation : createMutation;

  const getReviewFormQuery = useQuery<ReviewForm, AxiosError<ErrorResponse>, ReviewForm>(
    ['getReviewForm', { reviewFormCode }],
    () => reviewAPI.getForm(reviewFormCode),
    {
      enabled: !!reviewFormCode,
      suspense: true,
      useErrorBoundary: false,
    },
  );

  const initReviewFormData: ReviewFormRequest = getReviewFormQuery.data || {
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
