import {
  CreateFormResponse,
  TemplateFilterType,
  CreateTemplateRequest,
  CreateTemplateResponse,
  UpdateTemplateRequest,
  GetTemplateResponse,
  GetTemplatesResponse,
} from 'types/template';

import { API_URI, FILTER, PAGE_OPTION } from 'constant';

import axiosInstance from './config/axiosInstance';

export const getTemplates = async (
  filter: TemplateFilterType = FILTER.TEMPLATE_TAB.LATEST,
  pageNumber = 1,
  itemCount = PAGE_OPTION.TEMPLATE_ITEM_SIZE,
) => {
  const { data } = await axiosInstance.get<GetTemplatesResponse>(
    `${API_URI.TEMPLATE.GET_TEMPLATES}?${FILTER.PAGE}=${pageNumber}&${FILTER.SIZE}=${itemCount}&${FILTER.SORT}=${filter}`,
  );

  return data;
};

export const getSearchTemplates = async (
  search: string,
  pageNumber = 1,
  itemCount = PAGE_OPTION.TEMPLATE_ITEM_SIZE,
) => {
  const { data } = await axiosInstance.get<GetTemplatesResponse>(
    `${API_URI.TEMPLATE.GET_SEARCH_TEMPLATES}?query=${search}&${FILTER.PAGE}=${pageNumber}&${FILTER.SIZE}=${itemCount}`,
  );

  return data;
};

export const getTemplate = async (templateId: number) => {
  const { data } = await axiosInstance.get<GetTemplateResponse>(
    API_URI.TEMPLATE.GET_TEMPLATE(templateId),
  );

  return data;
};

export const createForm = async (templateId: number) => {
  const { data } = await axiosInstance.post<CreateFormResponse>(
    API_URI.TEMPLATE.CREATE_FORM(templateId),
  );

  return data;
};

export const createTemplate = async (query: CreateTemplateRequest) => {
  const { data } = await axiosInstance.post<CreateTemplateResponse>(
    API_URI.TEMPLATE.CREATE_TEMPLATE,
    query,
  );

  return data;
};

export const updateTemplate = async ({
  templateId,
  templateTitle,
  templateDescription,
  questions,
}: UpdateTemplateRequest) => {
  const { data } = await axiosInstance.put<null>(API_URI.TEMPLATE.UPDATE_TEMPLATE(templateId), {
    templateTitle,
    templateDescription,
    questions,
  });

  return data;
};

export const deleteTemplate = async (templateId: number) => {
  const { data } = await axiosInstance.delete<null>(API_URI.TEMPLATE.DELETE_TEMPLATE(templateId));

  return data;
};
