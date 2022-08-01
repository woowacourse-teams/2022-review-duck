import { CreateRefreshTokenRequest, CreateRefreshResponse, UserProfileResponse } from '../types';

import axiosInstance from './axiosInstance';

const createRefreshToken = async (
  query: CreateRefreshTokenRequest,
): Promise<CreateRefreshResponse> => {
  const { data } = await axiosInstance.post('/api/login', query);

  return data;
};

const getRefreshedAccessToken = async (): Promise<CreateRefreshResponse> => {
  // TODO: API 명세 GET으로 바뀔 예정입니다.
  const { data } = await axiosInstance.post('/api/login/refresh');

  return data;
};

const getProfile = async (): Promise<UserProfileResponse> => {
  const { data } = await axiosInstance.post('/api/members/me');

  return data;
};

const userAPI = { createRefreshToken, getRefreshedAccessToken, getProfile };

export { userAPI };
