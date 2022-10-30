import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { templateAPI } from 'api';

import {
  ErrorResponse,
  GetTemplateResponse,
  GetTemplatesResponse,
  TemplateFilterType,
} from 'service/types';

import { QUERY_KEY } from 'constant';

interface UseGetTemplatesProps {
  filter?: TemplateFilterType;
  search?: string;
  pageNumber?: number;
  itemCount?: number;
}

function useGetTemplates(
  { filter, search, pageNumber, itemCount }: UseGetTemplatesProps,
  queryOptions?: UseQueryOptions<GetTemplatesResponse, ErrorResponse>,
) {
  const apiFunc = search
    ? () => templateAPI.getSearchTemplates(search, pageNumber, itemCount)
    : () => templateAPI.getTemplates(filter, pageNumber, itemCount);
  const queryKey = search
    ? [QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_SEARCH_TEMPLATES, { search, pageNumber }]
    : [QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_TEMPLATES, { filter, pageNumber }];

  return useQuery<GetTemplatesResponse, ErrorResponse>(queryKey, apiFunc, {
    ...queryOptions,
    keepPreviousData: !!search,
  });
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

export { useGetTemplate, useGetTemplates };
