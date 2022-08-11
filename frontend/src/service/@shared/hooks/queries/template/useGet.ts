import { useQuery, UseQueryOptions } from 'react-query';

import { GetTemplatesResponse, ErrorResponse } from 'service/@shared/types';

import templateAPI from 'service/@shared/api/template';
import { QUERY_KEY } from 'service/@shared/constants';

function useGetTemplates(queryOptions?: UseQueryOptions<GetTemplatesResponse, ErrorResponse>) {
  return useQuery<GetTemplatesResponse, ErrorResponse>(
    [QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_TEMPLATES],
    () => templateAPI.getTemplates(),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export { useGetTemplates };
