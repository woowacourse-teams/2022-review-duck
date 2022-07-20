import { useMutation, useQuery } from 'react-query';

import { AxiosError } from 'axios';

import { ReviewForm } from 'service/review/types';
import { SubmitAnswerRequest, ErrorResponse } from 'service/review/types';

import reviewAPI from 'service/review/api';

function useReviewQueries(reviewFormCode: string) {
  const getQuestionsQuery = useQuery<ReviewForm, AxiosError<ErrorResponse>, ReviewForm>(
    ['getReviewFormData', { reviewFormCode }],
    () => reviewAPI.getForm(reviewFormCode),
    {
      suspense: true,
      useErrorBoundary: false,
    },
  );

  const createMutation = useMutation<unknown, AxiosError<ErrorResponse>, SubmitAnswerRequest>(
    reviewAPI.submitAnswer,
  );

  const reviewForm = getQuestionsQuery.data || { reviewTitle: '', questions: [] };

  const reviewMutation = createMutation;

  return { reviewForm, getQuestionsQuery, reviewMutation };
}

export default useReviewQueries;
