import { useGetReviewForm } from 'service/review/hooks/queries';
import useCreateReviewAnswer from 'service/review/hooks/queries/useCreateReviewAnswer';
import useGetReview from 'service/review/hooks/queries/useGetReview';
import useUpdateReview from 'service/review/hooks/queries/useUpdateReview';

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
