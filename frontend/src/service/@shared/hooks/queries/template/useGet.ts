import { useQuery, UseQueryOptions } from 'react-query';

import {
  GetTemplatesResponse,
  GetTemplateResponse,
  ErrorResponse,
  TemplateFilterType,
} from 'service/@shared/types';

import templateAPI from 'api/template';
import { QUERY_KEY } from 'service/@shared/constants';

function useGetTemplates(
  filter: TemplateFilterType,
  queryOptions?: UseQueryOptions<GetTemplatesResponse, ErrorResponse>,
) {
  return useQuery<GetTemplatesResponse, ErrorResponse>(
    [QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_TEMPLATES, { filter }],
    () => templateAPI.getTemplates(filter),
    {
      ...queryOptions,
    },
  );
}

function useGetTemplate(
  templateId: number,
  queryOptions?: UseQueryOptions<GetTemplateResponse, ErrorResponse>,
) {
  return useQuery<GetTemplateResponse, ErrorResponse>(
    [QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_TEMPLATE, { templateId }],
    () => templateAPI.getTemplate(templateId),
    {
      ...queryOptions,
    },
  );
}

export { useGetTemplates, useGetTemplate };
