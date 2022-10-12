import { useEffect, useRef } from 'react';

import { TimelineFilterType } from 'types';

import useIntersectionObserver from 'common/hooks/useIntersectionObserver';
import {
  useGetInfiniteReviewPublicAnswer,
  useReviewMutations,
} from 'service/@shared/hooks/queries/review';

function useReviewTimeline(currentTab: TimelineFilterType) {
  const reviewMutations = useReviewMutations();
  const publicAnswerScrollQuery = useGetInfiniteReviewPublicAnswer(currentTab);

  const infiniteScrollContainerRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(
    infiniteScrollContainerRef,
    [publicAnswerScrollQuery.data, currentTab],
    publicAnswerScrollQuery.fetchNextPage,
  );

  useEffect(
    function scrollTopOnUpdatedTab() {
      window.scrollTo(0, 0);
    },
    [currentTab],
  );

  if (publicAnswerScrollQuery.isLoading || publicAnswerScrollQuery.isError) return;

  return {
    publicAnswerScrollQuery,
    reviewsPageList: publicAnswerScrollQuery.data.pages,
    reviewMutations,
    infiniteScrollContainerRef,
  };
}

export default useReviewTimeline;
