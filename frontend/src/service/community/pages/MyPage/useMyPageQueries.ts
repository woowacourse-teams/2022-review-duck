import useGetUserProfile from 'service/@shared/hooks/queries/user/useGetUserProfile';
import useGetMyReviewForms from 'service/community/hooks/queries/useGetMyReviewForms';
import useGetMyReviews from 'service/community/hooks/queries/useGetMyReviews';
import useDeleteReview from 'service/review/hooks/queries/useDeleteReview';
import useDeleteReviewForm from 'service/review/hooks/queries/useDeleteReviewForm';

function useMyPageQueries() {
  const getMyReviewsQuery = useGetMyReviews();
  const getMyReviewFormsQuery = useGetMyReviewForms();
  const getUserProfileQuery = useGetUserProfile();

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

  const deleteReviewMutation = useDeleteReview();

  const deleteReviewFormMutation = useDeleteReviewForm();

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
