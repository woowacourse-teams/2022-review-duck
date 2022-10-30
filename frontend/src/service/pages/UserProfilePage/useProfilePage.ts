import { useRef } from 'react';

import { Tabs } from 'service/types';

import useOptimisticUpdate from 'common/hooks/useOptimisticUpdate';
import useStackFetch from 'common/hooks/useStackFetch';
import { useReviewMutations } from 'service/hooks/queries/review';
import { useTemplateMutations } from 'service/hooks/queries/template';
import {
  useGetUserReviewForms,
  useGetUserReviewAnswer,
  useGetUserProfile,
  useGetUserTemplates,
} from 'service/hooks/queries/user';

import { FILTER } from 'constant';

function useProfilePage(currentTab: Tabs, socialIdPrams: string, pageNumber: number) {
  const reviewMutations = useReviewMutations();
  const templateMutations = useTemplateMutations();

  const socialId = Number(socialIdPrams);

  const useGetQueries = {
    [FILTER.USER_PROFILE_TAB.REVIEWS]: useGetUserReviewAnswer,
    [FILTER.USER_PROFILE_TAB.REVIEW_FORMS]: useGetUserReviewForms,
    [FILTER.USER_PROFILE_TAB.TEMPLATES]: useGetUserTemplates,
  };

  const getUserProfile = useGetUserProfile({ socialId });
  const getUserArticles = useGetQueries[currentTab](socialId, pageNumber);

  const [articles, articlesOptimisticUpdater] = useOptimisticUpdate(
    getUserArticles.data?.articleList,
  );
  const articlesLikeStack = useRef<Record<number, number>>({});
  const { addFetch } = useStackFetch(2000);

  const isLoading = getUserProfile.isLoading || getUserArticles.isLoading;
  const isError = getUserProfile.isError || getUserArticles.isError;

  if (isLoading || isError) return false;

  return {
    reviewMutations,
    templateMutations,
    articlesPages: getUserArticles.data,
    articles,
    articlesLikeStack,
    articlesOptimisticUpdater,
    userProfile: getUserProfile.data,
    addFetch,
  };
}

export default useProfilePage;
