import { useRef } from 'react';

import {
  useGetInfiniteReviewFormAnswer,
  useGetReviewForm,
  useReviewMutations,
} from 'hooks/queries/review';
import { DisplayModeType } from 'types';

import useIntersectionObserver from 'common/hooks/useIntersectionObserver';
import useOptimisticUpdate from 'common/hooks/useOptimisticUpdate';
import useSimplifiedPageData from 'common/hooks/useSimplifiedPageData';
import useStackFetch from 'common/hooks/useStackFetch';

function useReviewOverviewPage(reviewFormCode: string, displayMode: DisplayModeType) {
  const reviewMutations = useReviewMutations();

  const {
    data: reviewsPages,
    fetchNextPage,
    isFetching: isReviewsFetching,
    isError: isReviewsError,
    isLoading: isReviewsLoading,
  } = useGetInfiniteReviewFormAnswer(reviewFormCode, displayMode);
  const reviewsOrigin = useSimplifiedPageData(reviewsPages?.pages, 'reviews');

  const [reviews, reviewsOptimisticUpdater] = useOptimisticUpdate(reviewsOrigin);
  const reviewsLikeStack = useRef<Record<number, number>>({});
  const { addFetch } = useStackFetch(2000);

  const infiniteScrollContainerRef = useRef<any>(null);
  useIntersectionObserver(infiniteScrollContainerRef, [reviews], fetchNextPage);

  const { data: reviewForm, isLoading: isFormLoading } = useGetReviewForm(reviewFormCode, {
    suspense: false,
  });

  if (isReviewsError || isReviewsLoading) return false;

  return {
    infiniteScrollContainerRef,
    reviewsLikeStack,
    reviewMutations,
    reviews,
    reviewForm,
    reviewsOptimisticUpdater,
    isReviewsFetching,
    isFormLoading,
    addFetch,
  };
}

export default useReviewOverviewPage;
