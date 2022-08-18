import { useGetUserInfo } from 'service/@shared/hooks/queries/auth';
import { useDeleteReviewAnswer, useDeleteReviewForm } from 'service/@shared/hooks/queries/review';
import { useGetUserReviewForms, useGetUserReviewAnswer } from 'service/@shared/hooks/queries/user';

function useProfilePageQueries(socialId: string) {
  const getMyReviewsQuery = useGetUserReviewAnswer(Number(socialId));
  const getMyReviewFormsQuery = useGetUserReviewForms(Number(socialId));

  const getUserProfileQuery = useGetUserInfo();
  const deleteReviewMutation = useDeleteReviewAnswer();
  const deleteReviewFormMutation = useDeleteReviewForm();

  const myReviews = getMyReviewsQuery.data || {
    numberOfReviews: 0,
    isMine: false,
    reviews: [],
  };

  const myReviewForms = getMyReviewFormsQuery.data || {
    numberOfReviewForms: 0,
    isMine: false,
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

export default useProfilePageQueries;
