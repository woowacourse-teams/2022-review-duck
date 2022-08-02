import { Navigate, Outlet } from 'react-router-dom';

import useAuth from 'service/@shared/hooks/useAuth';

import { ACCESS_PERMISSION, PAGE_LIST } from 'service/@shared/constants';

interface Props {
  permission?: boolean;
  isDeniedPageEnabled?: boolean;
}

function RequireAuth({
  permission = ACCESS_PERMISSION.LOGIN_USER,
  isDeniedPageEnabled = false,
}: Props) {
  const { isLogin } = useAuth();

  if (isLogin !== permission) {
    alert(isLogin ? '이미 로그인하였습니다.' : '권한이 없습니다. 로그인을 해주세요.');
    return <Navigate to={PAGE_LIST.HOME} />;
  }

  return <Outlet />;
}

export default RequireAuth;
