import { GetTemplatesResponse } from '../types/template';

import axiosInstance from './config/axiosInstance';

const getTemplates = async (): Promise<GetTemplatesResponse[]> => {
  const { data } = await axiosInstance.get('/api/templates');

  return data;
};

const templateAPI = {
  getTemplates,
};

export default templateAPI;
