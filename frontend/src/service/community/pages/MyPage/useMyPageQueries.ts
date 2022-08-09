import { useGetUserInfo } from 'service/@shared/hooks/queries/auth';
import { useDeleteReview, useDeleteReviewForm } from 'service/@shared/hooks/queries/review';
import { useGetMyReviewForms, useGetMyReviews } from 'service/@shared/hooks/queries/user';

function useMyPageQueries() {
  const getMyReviewsQuery = useGetMyReviews();
  const getMyReviewFormsQuery = useGetMyReviewForms();
  const getUserProfileQuery = useGetUserInfo();
  const deleteReviewMutation = useDeleteReview();
  const deleteReviewFormMutation = useDeleteReviewForm();

  const myReviews = getMyReviewsQuery.data || {
    numberOfReviews: 0,
    reviews: [],
  };

  const myReviewForms = getMyReviewFormsQuery.data || {
    numberOfReviewForms: 0,
    reviewForms: [],
  };

  const userProfile = getUserProfileQuery.data || {
    socialId: '',
    nickname: '',
    socialNickname: '',
    profileUrl: '',
  };

  const isError =
    getMyReviewsQuery.isError || getMyReviewFormsQuery.isError || getUserProfileQuery.isError;

  const { error } = getMyReviewsQuery || getMyReviewFormsQuery || getUserProfileQuery;

  return {
    myReviews,
    myReviewForms,
    userProfile,
    deleteReviewMutation,
    deleteReviewFormMutation,
    isError,
    error,
  };
}

export default useMyPageQueries;
