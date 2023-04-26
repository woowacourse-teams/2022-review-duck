import React, { useEffect, useRef } from 'react';

export interface IntersectionProps {
  threshold?: number;
  rootMargin?: `${number}%`;
  children: React.ReactElement;
  disabled?: boolean;
  onEnter?: (entry: IntersectionObserverEntry) => void;
  onLeave?: (entry: IntersectionObserverEntry) => void;
}

function Intersection({ threshold, rootMargin, disabled, onEnter, onLeave, children }: IntersectionProps) {
  const $wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(
    function registerObserver() {
      if (!$wrapperRef.current) return;

      const observer = new IntersectionObserver(
        (entryList) =>
          entryList.forEach((entry) => {
            if (disabled) return;

            entry.isIntersecting ? onEnter?.(entry) : onLeave?.(entry);
          }),
        { threshold, rootMargin },
      );

      observer.observe($wrapperRef.current);
      return () => {
        observer.disconnect();
      };
    },
    [rootMargin, threshold, onEnter, onLeave, disabled],
  );

  return React.isValidElement(children) ? (
    <div ref={$wrapperRef}>{children}</div>
  ) : (
    React.cloneElement(children, { ref: $wrapperRef })
  );
}

export default Intersection;
