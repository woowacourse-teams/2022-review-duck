import { USER_PROFILE_TAB } from 'constant';

import { useDeleteReviewAnswer, useDeleteReviewForm } from 'service/@shared/hooks/queries/review';
import { useDeleteTemplate } from 'service/@shared/hooks/queries/template/useDelete';
import {
  useGetUserReviewForms,
  useGetUserReviewAnswer,
  useGetUserProfile,
  useGetUserTemplates,
} from 'service/@shared/hooks/queries/user';

function useProfilePageQueries(currentTab: string, socialIdPrams: string, pageNumber: string) {
  const socialId = Number(socialIdPrams);
  const getUserReviewsQuery = useGetUserReviewAnswer(socialId, pageNumber, {
    enabled: currentTab === USER_PROFILE_TAB.REVIEWS,
  });
  const getUserReviewFormsQuery = useGetUserReviewForms(socialId, pageNumber, {
    enabled: currentTab === USER_PROFILE_TAB.REVIEW_FORMS,
  });
  const getUserTemplatesQuery = useGetUserTemplates(socialId, pageNumber, {
    enabled: currentTab === USER_PROFILE_TAB.TEMPLATES,
  });

  const getUserProfileQuery = useGetUserProfile({ socialId });
  const deleteReviewMutation = useDeleteReviewAnswer();
  const deleteReviewFormMutation = useDeleteReviewForm();
  const deleteTemplateMutation = useDeleteTemplate();

  const isError =
    getUserReviewsQuery.isError ||
    getUserReviewFormsQuery.isError ||
    getUserTemplatesQuery.isError ||
    getUserProfileQuery.isError;

  const isLoading =
    getUserReviewsQuery.isLoading ||
    getUserReviewFormsQuery.isLoading ||
    getUserTemplatesQuery.isLoading ||
    getUserProfileQuery.isLoading;

  if (isError || isLoading) return false;

  const userReviews = getUserReviewsQuery.data;

  const userReviewForms = getUserReviewFormsQuery.data;

  const userTemplates = getUserTemplatesQuery.data;

  const userProfile = getUserProfileQuery.data;

  return {
    userReviews,
    userReviewForms,
    userTemplates,
    userProfile,
    deleteReviewMutation,
    deleteReviewFormMutation,
    deleteTemplateMutation,
    isError,
    isLoading,
  };
}

export default useProfilePageQueries;
