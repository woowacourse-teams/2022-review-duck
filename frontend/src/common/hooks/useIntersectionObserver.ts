import React, { useEffect } from 'react';

function useIntersectionObserver<T extends Element>(
  listContainerRef: React.RefObject<T>,
  dependency: unknown[] = [],
  callback: () => void,
) {
  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    if (!entries[0].isIntersecting) return;

    callback();
  };

  useEffect(function registerObserver() {
    if (!listContainerRef.current) return;

    const $target = listContainerRef.current.lastElementChild;

    if (!$target) return;

    const observer = new IntersectionObserver(handleObserver, { threshold: 0.75 });

    observer.observe($target);

    return () => {
      observer.disconnect();
    };
  }, dependency);
}

export default useIntersectionObserver;
