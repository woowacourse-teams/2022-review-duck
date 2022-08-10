import { GetTemplatesResponse, GetTemplateResponse } from '../types/template';

import axiosInstance from './config/axiosInstance';

const getTemplates = async (): Promise<GetTemplatesResponse> => {
  const { data } = await axiosInstance.get('/api/templates');

  return data;
};

const getTemplate = async (templateId: number): Promise<GetTemplateResponse> => {
  const { data } = await axiosInstance.get(`api/templates/${templateId}`);

  return data;
};

const templateAPI = {
  getTemplates,
  getTemplate,
};

export default templateAPI;
