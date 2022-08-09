import { CreateRefreshTokenRequest, CreateRefreshResponse, UserProfileResponse } from '../types';

import axiosInstance from './config/axiosInstance';

const createRefreshToken = async (
  query: CreateRefreshTokenRequest,
): Promise<CreateRefreshResponse> => {
  const { data } = await axiosInstance.post('/api/login', query);

  return data;
};

const deleteRefreshToken = async (): Promise<null> => {
  const { data } = await axiosInstance.post('/api/logout');

  return data;
};

const getRefreshedAccessToken = async (): Promise<CreateRefreshResponse> => {
  const { data } = await axiosInstance.get('/api/login/refresh');

  return data;
};

const getProfile = async (): Promise<UserProfileResponse> => {
  const { data } = await axiosInstance.get('/api/members/me');

  return data;
};

const userAPI = { createRefreshToken, deleteRefreshToken, getRefreshedAccessToken, getProfile };

export { userAPI };
