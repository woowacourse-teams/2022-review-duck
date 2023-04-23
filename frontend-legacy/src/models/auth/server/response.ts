import type {
  AccessToken,
  GithubNickname,
  GithubProfileURL,
  GithubUniqueUserId,
  Nickname,
} from 'models/@shared';

export interface CreateRefreshResponse {
  accessToken: AccessToken;
}

export interface UserProfileResponse {
  socialId: GithubUniqueUserId;
  nickname: Nickname;
  socialNickname: GithubNickname;
  profileUrl: GithubProfileURL;
}
