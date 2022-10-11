import { useRef } from 'react';

import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';

function useInfiniteScrollQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(queryKey: TQueryKey, queryFn: (pageParam: number) => TData, lastListKey: keyof Awaited<TData>) {
  const pageNumber = useRef(1);

  return useInfiniteQuery(
    queryKey,
    async ({ pageParam = 1 }) => {
      pageNumber.current += 1;
      return queryFn(pageParam);
    },
    {
      getNextPageParam: (data) =>
        data[lastListKey as keyof typeof data] ? undefined : pageNumber.current + 1,
    },
  );
}

export default useInfiniteScrollQuery;
