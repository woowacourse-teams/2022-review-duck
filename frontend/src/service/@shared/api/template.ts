import { GetTemplatesResponse, GetTemplateResponse, CreateFormResponse } from '../types/template';

import axiosInstance from './config/axiosInstance';

const getTemplates = async (): Promise<GetTemplatesResponse> => {
  const { data } = await axiosInstance.get('/api/templates');

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

const updateTemplate = async (templateId: number): Promise<null> => {
  const { data } = await axiosInstance.put(`/api/templates/${templateId}`);

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
  updateTemplate,
  deleteTemplate,
};

export default templateAPI;
