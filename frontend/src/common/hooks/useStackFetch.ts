import { useRef } from 'react';

import { ErrorResponse } from 'service/types';

import useDebounce from 'common/hooks/useDebounce';

type FetchKey = string | number;

type FetchCallbackFunction = () => Promise<any>;

interface FetchHandler<FetchCallback extends FetchCallbackFunction> {
  onStart?: () => void;
  onUpdate?: () => void;
  onSuccess?: (data: Awaited<ReturnType<FetchCallback>>) => void;
  onError?: (error: ErrorResponse) => void;
}

function useStackFetch(pendingTime: number) {
  const setDebounce = useDebounce();

  const fetchStack = useRef<Record<string, FetchCallbackFunction>>({});

  const startFetch = () => {
    Object.entries(fetchStack.current).map(([fetchKey, callback]) => {
      callback();

      delete fetchStack.current[fetchKey];
    });
  };

  const addFetch = <FetchCallback extends FetchCallbackFunction>(
    fetchKey: FetchKey,
    fetchCallback: FetchCallback,
    options: FetchHandler<FetchCallback>,
  ) => {
    const { onStart = () => undefined, onError, onSuccess, onUpdate } = options;
    const newFetch = async () => {
      try {
        onSuccess && onSuccess(await fetchCallback());
      } catch (error) {
        onError && onError(error as ErrorResponse);
      }
    };

    fetchStack.current[fetchKey] = newFetch;

    setDebounce(() => startFetch(), pendingTime, {
      onStart,
    });

    onUpdate && onUpdate();
  };

  return { addFetch };
}

export default useStackFetch;
