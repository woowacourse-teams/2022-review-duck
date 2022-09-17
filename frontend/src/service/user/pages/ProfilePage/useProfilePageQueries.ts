import { USER_PROFILE_TAB } from 'constant';

import { useDeleteReviewAnswer, useDeleteReviewForm } from 'service/@shared/hooks/queries/review';
import { useDeleteTemplate } from 'service/@shared/hooks/queries/template/useDelete';
import {
  useGetUserReviewForms,
  useGetUserReviewAnswer,
  useGetUserProfile,
  useGetUserTemplates,
} from 'service/@shared/hooks/queries/user';

type CurrentTabs = 'reviews' | 'review-forms' | 'templates';

function useProfilePageQueries(currentTab: CurrentTabs, socialIdPrams: string, pageNumber: string) {
  const socialId = Number(socialIdPrams);

  const useGetQueries = {
    [USER_PROFILE_TAB.REVIEWS]: useGetUserReviewAnswer,
    [USER_PROFILE_TAB.REVIEW_FORMS]: useGetUserReviewForms,
    [USER_PROFILE_TAB.TEMPLATES]: useGetUserTemplates,
  };

  const useDeleteMutation = {
    [USER_PROFILE_TAB.REVIEWS]: useDeleteReviewAnswer,
    [USER_PROFILE_TAB.REVIEW_FORMS]: useDeleteReviewForm,
    [USER_PROFILE_TAB.TEMPLATES]: useDeleteTemplate,
  };

  const getUserProfile = useGetUserProfile({ socialId });
  const getUserArticles = useGetQueries[currentTab](socialId, pageNumber);

  const isLoading = getUserProfile.isLoading || getUserArticles.isLoading;
  const isError = getUserProfile.isError || getUserArticles.isError;

  if (isLoading || isError) return false;

  return {
    userItems: getUserArticles.data,
    userProfile: getUserProfile.data,
    mutation: useDeleteMutation[currentTab],
  };
}

export default useProfilePageQueries;
