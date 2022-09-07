import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { PAGE_LIST } from 'constant';

import useSnackbar from 'common/hooks/useSnackbar';
import useAuth from 'service/@shared/hooks/useAuth';

function Logout() {
  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();
  const { deleteRefreshToken } = useAuth();

  useEffect(() => {
    deleteRefreshToken.mutate(null, {
      onSettled: () => navigate(PAGE_LIST.HOME),
      onSuccess: () => {
        showSnackbar({
          icon: 'exit_to_app',
          title: '로그아웃이 완료되었습니다.',
          description: '회고덕에서 로그아웃 되었습니다.',
        });
      },
      onError: ({ message }) => {
        showSnackbar({
          theme: 'warning',
          icon: 'exit_to_app',
          title: '로그아웃에 실패하였습니다.',
          description: message,
        });
      },
    });
  }, []);

  return <></>;
}

export default Logout;
