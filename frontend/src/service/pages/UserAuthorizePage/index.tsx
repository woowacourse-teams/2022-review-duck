import { useLayoutEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { PAGE_LIST } from 'constant';
import { getErrorMessage } from 'utils';

import useSnackbar from 'common/hooks/useSnackbar';
import useAuth from 'service/hooks/useAuth';

import { validateGithubOAuth } from 'service/validator';

function UserAuthorizePage() {
  const [searchParams] = useSearchParams();
  const snackbar = useSnackbar();

  const { createRefreshToken } = useAuth();

  const { code = '', error = '' } = Object.fromEntries(searchParams.entries());

  useLayoutEffect(() => {
    try {
      validateGithubOAuth(code, error);
    } catch (error) {
      snackbar.show({
        theme: 'warning',
        title: 'Github 소셜 로그인에 실패하였습니다.',
        description: getErrorMessage(error),
      });
      return;
    }

    createRefreshToken.mutate(
      { code },
      {
        onError: ({ message }) => {
          alert(message);
        },
      },
    );
  }, []);

  if (createRefreshToken.isSuccess) {
    snackbar.show({
      theme: 'primary',
      title: '환영합니다! 회고덕에 로그인되었습니다.',
      description: '공용 PC에서 사용 시, 사용 후 꼭 로그아웃을 진행해주세요.',
    });
  }

  if (createRefreshToken.isSuccess || error) {
    return <Navigate to={PAGE_LIST.HOME} />;
  }

  return <></>;
}

export default UserAuthorizePage;
