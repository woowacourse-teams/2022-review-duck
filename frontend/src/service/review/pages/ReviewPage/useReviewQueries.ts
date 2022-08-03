import { useGetReviewForm } from 'service/review/hooks/queries';
import useCreateReviewAnswer from 'service/review/hooks/queries/useCreateReviewAnswer';
import useGetReview from 'service/review/hooks/queries/useGetReview';
import useUpdateReview from 'service/review/hooks/queries/useUpdateReview';

function useReviewQueries(reviewFormCode: string, reviewId: string) {
  const getReviewFormQuery = useGetReviewForm(reviewFormCode);

  /* 회고에 첫 답변을 할 때 reviewId가 0이 돼서 에러가 발생한다 */
  const getReviewQuery = useGetReview(+reviewId);

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
