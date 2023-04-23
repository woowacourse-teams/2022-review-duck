import { GithubAuthCode } from '../../@shared';

export interface CreateRefreshTokenRequest {
  code: GithubAuthCode;
}
