import { useEffect, useRef } from 'react';

function usePrevious<T = unknown>(value?: T) {
  const previousRef = useRef<T>();

  useEffect(() => {
    previousRef.current = value;
  }, [value]);

  return previousRef.current;
}

export default usePrevious;
