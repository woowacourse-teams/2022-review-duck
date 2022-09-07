import { UseMutationOptions } from 'react-query';

import { ErrorResponse } from 'types';

export type UseCustomMutationOptions<TData = unknown> = UseMutationOptions<
  TData,
  ErrorResponse,
  unknown
>;
