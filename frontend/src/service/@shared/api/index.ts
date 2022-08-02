import { CreateRefreshTokenRequest, CreateRefreshResponse, UserProfileResponse } from '../types';

import axiosInstance from './axiosInstance';

const createRefreshToken = async (
  query: CreateRefreshTokenRequest,
): Promise<CreateRefreshResponse> => {
  const { data } = await axiosInstance.post('/api/login', query);

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

const userAPI = { createRefreshToken, getRefreshedAccessToken, getProfile };

export { userAPI };