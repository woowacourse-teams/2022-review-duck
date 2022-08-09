import { useGetReviewForm } from 'service/@shared/hooks/queries/review';
import useCreateReviewAnswer from 'service/@shared/hooks/queries/review/useCreateReviewAnswer';
import useGetReview from 'service/@shared/hooks/queries/review/useGetReview';
import useUpdateReview from 'service/@shared/hooks/queries/review/useUpdateReview';

function useReviewQueries(reviewFormCode: string, reviewId: string) {
  const getReviewFormQuery = useGetReviewForm(reviewFormCode);

  const getReviewQuery = useGetReview(+reviewId, {
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
