import { useDeleteReviewAnswer, useDeleteReviewForm } from 'service/@shared/hooks/queries/review';
import {
  useGetUserReviewForms,
  useGetUserReviewAnswer,
  useGetUserProfile,
} from 'service/@shared/hooks/queries/user';

function useProfilePageQueries(socialIdPrams: string, pageNumber: string) {
  const socialId = Number(socialIdPrams);
  const getMyReviewsQuery = useGetUserReviewAnswer(socialId, pageNumber);
  const getMyReviewFormsQuery = useGetUserReviewForms(socialId, pageNumber);

  const getUserProfileQuery = useGetUserProfile({ socialId });
  const deleteReviewMutation = useDeleteReviewAnswer();
  const deleteReviewFormMutation = useDeleteReviewForm();

  const userReviews = getMyReviewsQuery.data || {
    numberOfReviews: 0,
    isMine: false,
    reviews: [],
  };

  const userReviewForms = getMyReviewFormsQuery.data || {
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
    userReviews,
    userReviewForms,
    userProfile,
    deleteReviewMutation,
    deleteReviewFormMutation,
    isError,
    error,
  };
}

export default useProfilePageQueries;
