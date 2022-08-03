import { GITHUB_OAUTH_ERROR, REVIEW_FORM_CODE_LENGTH } from 'service/@shared/constants';

function validateGithubOAuth(code: string, error: string) {
  if (!code && !error) {
    throw new Error('잘못된 접근입니다. 정상적인 경로를 통해 접근해주세요.');
  }

  switch (error) {
    case GITHUB_OAUTH_ERROR.APPLICATION_SUSPENDED:
      throw new Error('Github OAuth 정책을 확인하여주세요. 관리자에게 문의 부탁드립니다.');

    case GITHUB_OAUTH_ERROR.ACCESS_DENIED:
      throw new Error('회고덕의 소셜 로그인을 접근 권한을 거부하셨습니다.');

    case GITHUB_OAUTH_ERROR.REDIRECT_URI_MISMATCH:
      throw new Error('잘못된 URL으로 접근하였습니다.');

    // no default.
  }
}

const validateReviewFormCode = (reviewFormCode: string) => {
  if (!reviewFormCode || reviewFormCode.length !== REVIEW_FORM_CODE_LENGTH) {
    throw new Error('참여코드는 8자리를 입력해야 합니다.');
  }
};

export { validateGithubOAuth, validateReviewFormCode };
