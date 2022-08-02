import { AxiosError } from 'axios';

export type ErrorResponse = AxiosError<{ message: string }>;

export interface CreateRefreshTokenRequest {
  code: string;
}

export interface CreateRefreshResponse {
  accessToken: string;
}

export interface UserProfileResponse {
  socialId: string;
  nickname: string;
  socialNickname: string;
  profileUrl: string;
}
