import { ErrorResponse } from 'types';

import useDebounce from 'common/hooks/useDebounce';

function useOptimisticFetch<FetchFunction extends (...rest: any[]) => Promise<any>>(
  fetch: FetchFunction,
  pendingTime: number,
) {
  type RequestBodyType = PickParameterType<FetchFunction>;
  type ResponseBodyType = PickReturnType<FetchFunction>;

  interface UpdateRequestOptions {
    onStart?: (currentRequest: RequestBodyType) => void;
    onUpdate?: (currentRequest: RequestBodyType) => void;
    onSuccess?: (data: Awaited<ResponseBodyType>) => void;
    onError?: (error: ErrorResponse) => void;
  }

  const setDebounce = useDebounce();

  const fetchStart = async (
    requestBody: RequestBodyType,
    handler: Omit<UpdateRequestOptions, 'onStart' | 'onUpdate'>,
  ) => {
    const { onSuccess, onError } = handler;

    try {
      const fetchData = await fetch(...requestBody);

      onSuccess && onSuccess(fetchData);
    } catch (error) {
      onError && onError(error as ErrorResponse);
    }
  };

  const updateRequestBody = (requestBody: RequestBodyType, options: UpdateRequestOptions) => {
    const { onStart, onUpdate, onSuccess, onError } = options;

    setDebounce(
      () => {
        fetchStart(requestBody, { onSuccess, onError });
      },
      pendingTime,
      {
        onStart: () => {
          onStart && onStart(requestBody);
        },
      },
    );

    onUpdate && onUpdate(requestBody);
  };

  return updateRequestBody;
}

export default useOptimisticFetch;
