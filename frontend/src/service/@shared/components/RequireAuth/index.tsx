import { PERMISSION } from 'constant';

import useAuth from 'service/@shared/hooks/useAuth';

import ErrorPage from 'service/@shared/pages/ErrorPage';

export interface RequireAuthProps {
  permission?: ValueOf<typeof PERMISSION>;
  children: JSX.Element;
}

function RequireAuth({ permission = PERMISSION.ALL, children }: RequireAuthProps): JSX.Element {
  const { isLogin } = useAuth();
  const loginStatus = isLogin ? PERMISSION.LOGIN_USER : PERMISSION.LOGOUT_USER;

  if (permission && loginStatus !== permission) {
    return <ErrorPage status={403} title="로그인이 필요한 서비스입니다." description="Forbidden" />;
  }

  return children;
}

export default RequireAuth;
