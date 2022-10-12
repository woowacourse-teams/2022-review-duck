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
    data: answersPages,
    fetchNextPage,
    isLoading,
    isError,
    isFetching: isAnswerFetching,
  } = useGetInfiniteReviewPublicAnswer(currentTab);

  const infiniteScrollContainerRef = useRef<HTMLDivElement>(null);
  const answersOrigin = useSimplifiedPageData(answersPages ? answersPages.pages : [], 'reviews');

  const [answers, answersOptimisticUpdater] = useOptimisticUpdate(answersOrigin);

  useIntersectionObserver(infiniteScrollContainerRef, [answers], fetchNextPage);

  useEffect(
    function scrollTopOnUpdatedTab() {
      window.scrollTo(0, 0);
    },
    [currentTab],
  );

  if (isLoading || isError) return;

  return {
    answers,
    answersOptimisticUpdater,
    reviewMutations,
    infiniteScrollContainerRef,
    isAnswerFetching,
  };
}

export default useReviewTimeline;
