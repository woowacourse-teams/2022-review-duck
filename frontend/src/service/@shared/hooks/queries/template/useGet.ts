import { useQuery, UseQueryOptions } from 'react-query';

import { GetTemplatesResponse, GetTemplateResponse, ErrorResponse } from 'service/@shared/types';

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

function useGetTemplate(
  templateId: number,
  queryOptions?: UseQueryOptions<GetTemplateResponse, ErrorResponse>,
) {
  return useQuery<GetTemplateResponse, ErrorResponse>(
    [QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_TEMPLATE],
    () => templateAPI.getTemplate(templateId),
    {
      suspense: true,
      useErrorBoundary: false,
      ...queryOptions,
    },
  );
}

export { useGetTemplates, useGetTemplate };
