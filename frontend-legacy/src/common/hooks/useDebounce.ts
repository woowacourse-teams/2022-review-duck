import { useRef } from 'react';

function useDebounce() {
  const timerRef = useRef<NodeJS.Timeout>();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const setDebounce = (callback: () => void, delay: number, options?: { onStart: () => void }) => {
    if (!timerRef.current && options?.onStart) {
      options.onStart();
    }

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      callback();
      clearTimeout(timerRef.current);
    }, delay);

    return {
      removeDebounce: () => clearTimeout(timerRef.current),
      forceCallback: () => {
        clearTimeout(timerRef.current);
        callback();
      },
    };
  };

  return setDebounce;
}

export default useDebounce;
