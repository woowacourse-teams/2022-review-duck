import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import useSnackbar from 'common/hooks/useSnackbar';
import useAuth from 'service/@shared/hooks/useAuth';

import { PAGE_LIST } from 'service/@shared/constants';

function Logout() {
  const { addSnackbar } = useSnackbar();
  const { deleteRefreshToken } = useAuth();

  useEffect(() => {
    deleteRefreshToken.mutate(null, {
      onSuccess: () => {
        addSnackbar({
          icon: 'exit_to_app',
          title: '로그아웃이 완료되었습니다.',
          description: '회고덕에서 로그아웃 되었습니다.',
        });
      },
    });
  }, []);

  return deleteRefreshToken.isSuccess ? <Navigate to={PAGE_LIST.HOME} /> : <></>;
}

export default Logout;
