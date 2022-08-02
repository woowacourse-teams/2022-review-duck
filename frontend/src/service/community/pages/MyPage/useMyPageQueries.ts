import useGetUserProfile from 'service/@shared/hooks/queries/user/useGetUserProfile';
import useGetMyReviewForms from 'service/community/hooks/queries/useGetMyReviewForms';
import useGetMyReviews from 'service/community/hooks/queries/useGetMyReviews';

function useMyPageQueries() {
  const getMyReviewsQuery = useGetMyReviews();
  const getMyRevieFromsQuery = useGetMyReviewForms();
  const getUserProfileQuery = useGetUserProfile();

  const myReviews = getMyReviewsQuery.data || {
    numberOfReviews: 0,
    reviews: [],
  };

  const myReviewForms = getMyRevieFromsQuery.data || {
    numberOfReviewForms: 0,
    reviewForms: [],
  };

  const userProfile = getUserProfileQuery.data || {
    socialId: '',
    socialNickname: '',
    nickname: '',
    profileUrl: '',
  };

  const isError =
    getMyReviewsQuery.isError || getMyRevieFromsQuery.isError || getUserProfileQuery.isError;

  const { error } = getMyReviewsQuery || getMyRevieFromsQuery || getUserProfileQuery;

  return { myReviews, myReviewForms, userProfile, isError, error };
}

export default useMyPageQueries;
