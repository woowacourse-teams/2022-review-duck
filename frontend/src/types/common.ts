import { ErrorResponse } from 'types';

import { UseMutationOptions } from '@tanstack/react-query';

export type UseCustomMutationOptions<TData = unknown> = UseMutationOptions<
  TData,
  ErrorResponse,
  unknown
>;
