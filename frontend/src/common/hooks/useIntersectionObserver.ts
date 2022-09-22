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

  const handleIntersect: IntersectionObserverCallback = ([entry], observer) => {
    if (entry.isIntersecting) {
      console.log('intersect: ', entry.target);

      observer.unobserve(entry.target);
      onIntersect();
    }
  };

  useEffect(() => {
    console.log('effect: ', targetRef);

    if (!targetRef || !targetRef.current) {
      return;
    }
    const target = targetRef.current;
    const observer = new IntersectionObserver(handleIntersect, option);

    observer.observe(target);
    console.log('observed taret: ', target);

    return () => observer.disconnect();
  }, dependArray);

  return { targetRef };
}
// function useIntersectionObserver<DataType, RefElementType extends Element>(
//   onIntersect: (
//     options?: FetchNextPageOptions,
//   ) => Promise<InfiniteQueryObserverResult<InfiniteItem<DataType>>>,
//   option: ObserverOptionType,
//   dependArray: unknown[],
// ) {
//   const targetRef = useRef<RefElementType>(null);
//   console.log('outer targetRef: ', targetRef);

//   const handleIntersect: IntersectionObserverCallback = ([entry]) => {
//     if (entry.isIntersecting) {
//       console.log('intersected target: ', entry.target);
//       onIntersect();
//     }
//   };

//   const observer = new IntersectionObserver(handleIntersect, option);

//   useEffect(() => {
//     console.log('useEffect outer targetRef: ', targetRef);

//     if (!targetRef || !targetRef.current) {
//       return;
//     }
//     const target = targetRef.current;

//     observer.observe(target);

//     return () => {
//       if (targetRef && target) {
//         console.log('unobserve targetRef: ', targetRef);
//         observer.unobserve(target);
//       }
//     };
//   }, dependArray);

//   return { targetRef };
// }

export default useIntersectionObserver;
