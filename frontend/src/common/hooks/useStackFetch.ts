import { useRef } from 'react';

import { ErrorResponse } from 'types';

import useDebounce from 'common/hooks/useDebounce';

type FetchKey = string | number;

type FetchCallbackFunction = () => Promise<any>;

interface FetchHandler<FetchCallback extends FetchCallbackFunction> {
  onStart?: () => void;
  onUpdate?: () => void;
  onSuccess?: (data: Awaited<PickReturnType<FetchCallback>>) => void;
  onError?: (error: ErrorResponse) => void;
}

function useStackFetch(pendingTime: number) {
  const setDebounce = useDebounce();

  const fetchStack = useRef<Record<string, FetchCallbackFunction>>({});

  const startFetchStack = () => {
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

    setDebounce(() => startFetchStack(), pendingTime, {
      onStart,
    });

    onUpdate && onUpdate();
  };

  return { addFetch };
}

export default useStackFetch;
