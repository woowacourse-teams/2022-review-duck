import {
  CreateRefreshTokenRequest,
  CreateRefreshResponse,
  UserProfileResponse,
} from '../service/types';
import axiosInstance from './config/axiosInstance';

export const createRefreshToken = async (
  query: CreateRefreshTokenRequest,
): Promise<CreateRefreshResponse> => {
  const { data } = await axiosInstance.post('/api/login', query);

  return data;
};

export const deleteRefreshToken = async (): Promise<null> => {
  const { data } = await axiosInstance.post('/api/logout');

  return data;
};

export const getRefreshedAccessToken = async (): Promise<CreateRefreshResponse> => {
  const { data } = await axiosInstance.get('/api/login/refresh');

  return data;
};

export const getProfile = async (): Promise<UserProfileResponse> => {
  const { data } = await axiosInstance.get('/api/members/me');

  return data;
};
