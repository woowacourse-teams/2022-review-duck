import { useGetReviewForm } from 'service/review/hooks/queries';
import useCreateReviewAnswer from 'service/review/hooks/queries/useCreateReviewAnswer';

function useReviewQueries(reviewFormCode: string) {
  const getQuestionsQuery = useGetReviewForm(reviewFormCode);

  const createMutation = useCreateReviewAnswer(reviewFormCode);

  const reviewForm = getQuestionsQuery.data || {
    reviewTitle: '',
    questions: [],
    creator: { nickname: '', profileUrl: '' },
  };

  const reviewMutation = createMutation;

  return { reviewForm, getQuestionsQuery, reviewMutation };
}

export default useReviewQueries;
