import { useLayoutEffect } from 'react';
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
  // TODO: 유저 프로필 확인 API 구현 시 getUserProfileQuery로 변경 필요
  const { getAccessTokenQuery } = useAuth();

  useLayoutEffect(() => {
    getAccessTokenQuery.refetch();
  }, []);

  const isLogin = getAccessTokenQuery.isSuccess;

  if (isLogin !== permission) {
    // TODO: isDeniedPageEnabled 값에 따라 로그인 유도 페이지로 이동 처리
    alert(isLogin ? '이미 로그인하였습니다.' : '권한이 없습니다. 로그인을 해주세요.');
    return <Navigate to={PAGE_LIST.HOME} />;
  }

  return <Outlet />;
}

export default RequireAuth;
