import { useEffect, useRef } from 'react';

import { TimelineFilterType } from 'service/types';

import useIntersectionObserver from 'common/hooks/useIntersectionObserver';
import useOptimisticUpdate from 'common/hooks/useOptimisticUpdate';
import useSimplifiedPageData from 'common/hooks/useSimplifiedPageData';
import useStackFetch from 'common/hooks/useStackFetch';
import { useGetInfiniteReviewPublicAnswer, useReviewMutations } from 'service/hooks/queries/review';

function useReviewTimeline(currentTab: TimelineFilterType) {
  const reviewMutations = useReviewMutations();
  const {
    data: reviewsPages,
    fetchNextPage,
    isLoading,
    isError,
    isFetching: isAnswerFetching,
  } = useGetInfiniteReviewPublicAnswer(currentTab);

  const reviewsOrigin = useSimplifiedPageData(reviewsPages?.pages, 'reviews');

  const [reviews, reviewsOptimisticUpdater] = useOptimisticUpdate(reviewsOrigin);
  const reviewsLikeStack = useRef<Record<number, number>>({});
  const { addFetch } = useStackFetch(2000);

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
    reviewsLikeStack,
    reviewsOptimisticUpdater,
    reviewMutations,
    infiniteScrollContainerRef,
    isAnswerFetching,
    addFetch,
  };
}

export default useReviewTimeline;
