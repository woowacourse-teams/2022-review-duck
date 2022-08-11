import {
  useGetReviewForm,
  useCreateReviewAnswer,
  useGetReviewAnswer,
  useUpdateReview,
} from 'service/@shared/hooks/queries/review';

function useReviewQueries(reviewFormCode: string, reviewId: string) {
  const getReviewFormQuery = useGetReviewForm(reviewFormCode);

  const getReviewQuery = useGetReviewAnswer(+reviewId, {
    enabled: !!reviewId,
  });

  const createMutation = useCreateReviewAnswer();

  const updateMutation = useUpdateReview();

  const reviewForm = getReviewFormQuery.data || {
    reviewTitle: '',
    questions: [],
    creator: { nickname: '', profileUrl: '' },
  };

  const review = getReviewQuery.data || { answers: [] };

  return { reviewForm, review, getReviewFormQuery, getReviewQuery, createMutation, updateMutation };
}

export default useReviewQueries;
