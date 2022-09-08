import { Navigate, Outlet } from 'react-router-dom';

import { ACCESS_PERMISSION, PAGE_LIST } from 'constant';

import useAuth from 'service/@shared/hooks/useAuth';

import ErrorPage from 'service/@shared/pages/ErrorPage';

interface RequireAuthProps {
  permission?: boolean;
  isDeniedPageEnabled?: boolean;
}

function RequireAuth({
  permission = ACCESS_PERMISSION.LOGIN_USER,
  isDeniedPageEnabled = true,
}: RequireAuthProps) {
  const { isLogin } = useAuth();

  if (isLogin === permission) {
    return <Outlet />;
  }

  if (isDeniedPageEnabled) {
    return <ErrorPage status={403} title="로그인이 필요한 서비스입니다." description="Forbidden" />;
  }

  alert(
    isLogin
      ? '이미 로그인하였습니다.'
      : `권한이 없습니다. 로그인을 해주세요.\n(로그인 후 리다이렉트 처리 예정입니다.)`,
  );
  return <Navigate to={PAGE_LIST.HOME} />;
}

export default RequireAuth;
