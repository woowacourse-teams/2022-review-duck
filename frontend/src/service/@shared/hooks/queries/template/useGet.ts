import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { templateAPI } from 'api';
import { QUERY_KEY } from 'constant';
import {
  ErrorResponse,
  GetTemplateResponse,
  GetTemplatesResponse,
  TemplateFilterType,
} from 'types';

interface UseGetTemplateParameters {
  filter?: TemplateFilterType;
  pageNumber?: number;
  itemCount?: number;
}

function useGetTemplates(
  { filter, pageNumber, itemCount }: UseGetTemplateParameters,
  queryOptions?: UseQueryOptions<GetTemplatesResponse, ErrorResponse>,
) {
  return useQuery<GetTemplatesResponse, ErrorResponse>(
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
