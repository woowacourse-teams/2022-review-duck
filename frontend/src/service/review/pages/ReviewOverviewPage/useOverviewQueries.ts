import { useGetReviewForm, useGetReviews } from 'service/@shared/hooks/queries/review';

function useOverviewQueries(reviewFormCode = '') {
  const getReviewFormQuery = useGetReviewForm(reviewFormCode);
  const getReviewsQuery = useGetReviews(reviewFormCode);

  const reviewForm = getReviewFormQuery.data || {
    reviewTitle: '',
    updatedAt: 0,
    creator: {
      nickname: '',
      profileUrl: '',
    },
    isCreator: false,
    questions: [],
  };

  const reviews = getReviewsQuery.data || {
    reviews: [],
  };

  const isError = getReviewFormQuery.isError || getReviewsQuery.isError;

  const { error } = getReviewFormQuery || getReviewsQuery;

  return { reviewForm, reviews, isError, error };
}

export default useOverviewQueries;
