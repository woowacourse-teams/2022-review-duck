import { useEffect, useRef } from 'react';

import { QueryKey, useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';

function useInfiniteScrollQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: (pageParam: number) => TData,
  lastListKey: keyof Awaited<TData>,
  queryOptions: Omit<
    UseInfiniteQueryOptions<any, TError, Awaited<TData>, TQueryFnData, TQueryKey>,
    'queryKey' | 'queryFn'
  > = {},
) {
  const pageNumber = useRef(1);

  const query = useInfiniteQuery(
    queryKey,
    async ({ pageParam = 1 }) => {
      pageNumber.current += 1;
      return await queryFn(pageParam);
    },
    {
      getNextPageParam: (data) =>
        data[lastListKey as keyof typeof data] ? undefined : pageNumber.current + 1,
      ...queryOptions,
    },
  );

  useEffect(function clearCacheOnUnmount() {
    return () => {
      query.remove();
      pageNumber.current = 1;
    };
  }, []);

  return query;
}

export default useInfiniteScrollQuery;
