import { useRef } from 'react';

function useThrottle() {
  const timerRef = useRef<NodeJS.Timeout>();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const setThrottle = (callback: () => void, delay: number) => {
    if (timerRef.current) return;

    timerRef.current = setTimeout(() => {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;

      callback();
    }, delay);
  };

  return setThrottle;
}

export default useThrottle;
