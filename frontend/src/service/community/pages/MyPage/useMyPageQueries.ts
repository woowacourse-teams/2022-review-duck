import useGetMyReviewForms from 'service/@shared/hooks/queries/profile/useGetMyReviewForms';
import useGetMyReviews from 'service/@shared/hooks/queries/profile/useGetMyReviews';
import { useDeleteReview, useDeleteReviewForm } from 'service/@shared/hooks/queries/review';
import useGetUserProfile from 'service/@shared/hooks/queries/user/useGetUserProfile';

function useMyPageQueries() {
  const getMyReviewsQuery = useGetMyReviews();
  const getMyReviewFormsQuery = useGetMyReviewForms();
  const getUserProfileQuery = useGetUserProfile();
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
