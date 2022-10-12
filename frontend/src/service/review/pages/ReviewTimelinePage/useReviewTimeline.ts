import { useEffect, useRef } from 'react';

import { TimelineFilterType } from 'types';

import useIntersectionObserver from 'common/hooks/useIntersectionObserver';
import useOptimisticUpdate from 'common/hooks/useOptimisticUpdate';
import useSimplifiedPageData from 'common/hooks/useSimplifiedPageData';
import {
  useGetInfiniteReviewPublicAnswer,
  useReviewMutations,
} from 'service/@shared/hooks/queries/review';

function useReviewTimeline(currentTab: TimelineFilterType) {
  const reviewMutations = useReviewMutations();
  const {
    data: reviewsPages,
    fetchNextPage,
    isLoading,
    isError,
    isFetching: isAnswerFetching,
  } = useGetInfiniteReviewPublicAnswer(currentTab);

  const reviewsOrigin = useSimplifiedPageData(reviewsPages ? reviewsPages.pages : [], 'reviews');
  const [reviews, reviewsOptimisticUpdater] = useOptimisticUpdate(reviewsOrigin);

  const infiniteScrollContainerRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver(infiniteScrollContainerRef, [reviews], fetchNextPage);

  useEffect(
    function scrollTopOnUpdatedTab() {
      window.scrollTo(0, 0);
    },
    [currentTab],
  );

  if (isLoading || isError) return;

  return {
    reviews,
    reviewsOptimisticUpdater,
    reviewMutations,
    infiniteScrollContainerRef,
    isAnswerFetching,
  };
}

export default useReviewTimeline;
