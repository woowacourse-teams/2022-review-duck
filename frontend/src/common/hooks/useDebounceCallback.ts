import { useRef } from 'react';

function useDebounceCallback<Parameter extends any[]>(
  callback: (...parameter: Parameter) => void,
  delay: number,
) {
  const timerRef = useRef<NodeJS.Timeout>();

  const timeoutCallback = (parameter: Parameter) => () => {
    callback(...parameter);
    timerRef.current = undefined;
  };

  return (...callbackParameter: Parameter): void => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(timeoutCallback(callbackParameter), delay);
  };
}

export default useDebounceCallback;
