import { useMutation, useQuery } from 'react-query';

import { ReviewForm } from 'service/review/types';

import reviewAPI from 'service/review/api';

function useReview(reviewFormCode: string) {
  const getQuestionsQuery = useQuery<any, any, ReviewForm>(['questions', reviewFormCode], () =>
    reviewAPI.getQuestions(reviewFormCode),
  );

  const createMutation = useMutation(reviewAPI.submitAnswer);

  const reviewForm = getQuestionsQuery.data || { reviewTitle: '', questions: [] };

  const reviewMutation = createMutation;

  return { reviewForm, getQuestionsQuery, reviewMutation };
}

export default useReview;
