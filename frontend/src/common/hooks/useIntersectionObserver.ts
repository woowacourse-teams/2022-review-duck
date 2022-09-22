import { useEffect, useRef } from 'react';

import { FetchNextPageOptions, InfiniteQueryObserverResult } from '@tanstack/react-query';

import { InfiniteItem } from 'types';

interface ObserverOptionType {
  root?: HTMLDivElement;
  rootMargin?: string;
  threshold: number;
}

function useIntersectionObserver<DataType, RefElementType extends Element>(
  onIntersect: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteItem<DataType>>>,
  option: ObserverOptionType,
  dependArray: unknown[],
) {
  const targetRef = useRef<RefElementType>(null);

  useEffect(() => {
    if (!targetRef || !targetRef.current) {
      return;
    }
    const target = targetRef.current;

    const handleIntersect: IntersectionObserverCallback = ([entry]) => {
      if (entry.isIntersecting) {
        onIntersect();
      }
    };
    const observer = new IntersectionObserver(handleIntersect, option);

    observer.observe(target);

    return () => {
      if (targetRef && target) {
        observer.disconnect();
      }
    };
  }, dependArray);

  return { targetRef };
}

export default useIntersectionObserver;
