import { UseMutationOptions } from '@tanstack/react-query';

import { ErrorResponse } from 'types';

export type UseCustomMutationOptions<TData = unknown> = UseMutationOptions<
  TData,
  ErrorResponse,
  unknown
>;

export interface InfiniteItem<TData> {
  data: TData;
  currentPage: number;
}
