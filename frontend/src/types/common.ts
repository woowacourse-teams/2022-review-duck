import { UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

export type ErrorResponse = AxiosError<{ message: string }> | Error;

export type UseCustomMutationOptions<TData = unknown> = UseMutationOptions<
  TData,
  ErrorResponse,
  unknown
>;

export interface InfiniteItem<TData> {
  data: TData;
  currentPage: number;
}
