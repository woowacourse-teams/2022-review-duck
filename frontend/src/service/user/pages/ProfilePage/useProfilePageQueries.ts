import { useDeleteReviewAnswer, useDeleteReviewForm } from 'service/@shared/hooks/queries/review';
import {
  useGetUserReviewForms,
  useGetUserReviewAnswer,
  useGetUserProfile,
} from 'service/@shared/hooks/queries/user';

function useProfilePageQueries(socialIdPrams: string) {
  const socialId = Number(socialIdPrams);
  const getMyReviewsQuery = useGetUserReviewAnswer(socialId);
  const getMyReviewFormsQuery = useGetUserReviewForms(socialId);

  const getUserProfileQuery = useGetUserProfile({ socialId });
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
    isMine: false,
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
