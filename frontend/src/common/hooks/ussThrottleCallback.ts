/* eslint-disable @typescript-eslint/ban-types */
import { useRef } from 'react';

function useThrottleCallback<Parameter extends any[]>(
  callback: (...rest: Parameter) => void,
  delay: number,
) {
  const timerRef = useRef<NodeJS.Timeout>();
  const timeoutCallback = (parameter: Parameter) => () => {
    callback(...parameter);

    if (timerRef.current) {
      timerRef.current = undefined;
    }
  };

  return (...callbackParameter: Parameter): void => {
    if (timerRef.current) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(timeoutCallback(callbackParameter), delay);
  };
}

export default useThrottleCallback;
