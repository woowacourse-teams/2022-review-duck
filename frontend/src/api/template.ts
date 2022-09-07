import {
  GetTemplatesResponse,
  GetTemplateResponse,
  CreateFormResponse,
  TemplateFilterType,
  CreateTemplateRequest,
  CreateTemplateResponse,
  UpdateTemplateRequest,
} from '../types/template';

import axiosInstance from './config/axiosInstance';

const getTemplates = async (filter: TemplateFilterType): Promise<GetTemplatesResponse> => {
  const { data } = await axiosInstance.get(`/api/templates?filter=${filter}`);

  return data;
};

const getTemplate = async (templateId: number): Promise<GetTemplateResponse> => {
  const { data } = await axiosInstance.get(`/api/templates/${templateId}`);

  return data;
};

const createForm = async (templateId: number): Promise<CreateFormResponse> => {
  const { data } = await axiosInstance.post(`/api/templates/${templateId}/review-forms`);

  return data;
};

const createTemplate = async (query: CreateTemplateRequest): Promise<CreateTemplateResponse> => {
  const { data } = await axiosInstance.post('/api/templates', query);

  return data;
};

const updateTemplate = async ({
  templateId,
  templateTitle,
  templateDescription,
  questions,
}: UpdateTemplateRequest): Promise<null> => {
  const { data } = await axiosInstance.put(`/api/templates/${templateId}`, {
    templateTitle,
    templateDescription,
    questions,
  });

  return data;
};

const deleteTemplate = async (templateId: number): Promise<null> => {
  const { data } = await axiosInstance.delete(`/api/templates/${templateId}`);

  return data;
};

const templateAPI = {
  getTemplates,
  getTemplate,
  createForm,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};

export default templateAPI;
