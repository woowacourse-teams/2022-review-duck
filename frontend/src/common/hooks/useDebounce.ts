import { useCallback, useRef } from 'react';

type CallbackFunction = (...rest: any[]) => any;

function useDebounce(callback: CallbackFunction, delay: number) {
  const timerRef = useRef<NodeJS.Timeout>();
  const restRef = useRef<unknown[]>([]);

  const timer = useCallback(
    () => setTimeout(() => callback(...restRef.current), delay),
    [callback, delay],
  );

  return (...rest: []): any => {
    restRef.current = rest;

    clearTimeout(timerRef.current);
    timerRef.current = timer();
  };
}

export default useDebounce;
