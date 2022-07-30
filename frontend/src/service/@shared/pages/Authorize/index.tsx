import { useLayoutEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import useAuth from 'service/@shared/hooks/useAuth';

import { GITHUB_OAUTH_ERROR, PAGE_LIST } from 'service/@shared/constants';

function Authorize() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { createRefreshToken } = useAuth();

  const { code = '', error = '' } = Object.fromEntries(searchParams.entries());

  switch (error) {
    case GITHUB_OAUTH_ERROR.APPLICATION_SUSPENDED:
      alert('Github OAuth 정책을 확인하여주세요.');
      break;

    case GITHUB_OAUTH_ERROR.ACCESS_DENIED:
      alert('Github 소셜 로그인 시도를 취소하셨습니다.');
      break;

    case GITHUB_OAUTH_ERROR.REDIRECT_URI_MISMATCH:
      alert('잘못된 URL입니다.');
      break;

    // no default.
  }

  useLayoutEffect(() => {
    if (!code && !error) {
      alert('잘못된 접근입니다.');
      return;
    }

    createRefreshToken.mutate(
      { code },
      {
        onSettled: () => {
          navigate(PAGE_LIST.HOME);
        },
        onError: ({ message }) => {
          alert(message);
        },
      },
    );
  }, []);

  // TODO: 로그인 진행 화면 디자인
  return <Navigate to={PAGE_LIST.HOME} />;
}

export default Authorize;
