import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { templateAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { ErrorResponse, TemplateFilterType } from 'types';

import { TemplateList } from 'api/template.api';
import Template from 'models/Template';

function useGetTemplates(
  filter: TemplateFilterType,
  pageNumber: string,
  itemCount?: number,
  queryOptions?: UseQueryOptions<TemplateList, ErrorResponse>,
) {
  return useQuery<TemplateList, ErrorResponse>(
    [QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_TEMPLATES, { filter, pageNumber, itemCount }],
    () => templateAPI.getTemplates(filter, pageNumber, itemCount),
    {
      ...queryOptions,
      keepPreviousData: true,
    },
  );
}

function useGetTemplate(
  templateId: number,
  queryOptions?: UseQueryOptions<Template, ErrorResponse>,
) {
  return useQuery<Template, ErrorResponse>(
    [QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_TEMPLATE, { templateId }],
    () => templateAPI.getTemplate(templateId),
    {
      ...queryOptions,
    },
  );
}

export { useGetTemplates, useGetTemplate };
