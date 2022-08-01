export interface CreateRefreshTokenRequest {
  code: string;
}

export interface CreateRefreshResponse {
  accessToken: string;
}

export interface UserProfileResponse {
  socialId: string;
  nickname: string;
  profileUrl: string;
}
