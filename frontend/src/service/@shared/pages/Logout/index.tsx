import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import useSnackbar from 'common/hooks/useSnackbar';
import useGetDestroyRefreshToken from 'service/@shared/hooks/queries/user/useGetDestroyRefreshToken';

import { PAGE_LIST } from 'service/@shared/constants';

function Logout() {
  const { addSnackbar } = useSnackbar();
  const { isSuccess } = useGetDestroyRefreshToken();

  useEffect(() => {
    if (isSuccess) {
      addSnackbar({
        icon: 'exit_to_app',
        title: '로그아웃이 완료되었습니다.',
        description: '회고덕에서 로그아웃 되었습니다.',
      });
    }
  }, []);

  return isSuccess ? <Navigate to={PAGE_LIST.HOME} /> : <></>;
}

export default Logout;
