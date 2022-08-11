import { UseMutationOptions } from 'react-query';

import { ErrorResponse } from 'service/@shared/types';

export type UseCustomMutationOptions<TData = unknown> = UseMutationOptions<
  TData,
  ErrorResponse,
  unknown
>;
