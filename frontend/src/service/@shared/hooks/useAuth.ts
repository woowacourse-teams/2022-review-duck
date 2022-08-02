import useGetAccessToken from 'service/@shared/hooks/queries/user/useGetAccessToken';

import { axiosInstanceUtils } from '../utils';

import useCreateRefreshToken from './queries/user/useCreateRefreshToken';
import useGetUserProfile from './queries/user/useGetUserProfile';

function useAuth() {
  const createRefreshToken = useCreateRefreshToken();

  const getAccessTokenQuery = useGetAccessToken({
    onSuccess: ({ accessToken }) => {
      axiosInstanceUtils.setHeader('Authorization', `Bearer ${accessToken}`);
    },
    onError: () => {
      axiosInstanceUtils.removeHeader('Authorization');
    },
  });

  const getUserProfileQuery = useGetUserProfile({
    enabled: false,
  });

  const isLogin = getAccessTokenQuery.isSuccess; // TODO: getUserProfileQuery

  return { createRefreshToken, getAccessTokenQuery, getUserProfileQuery, isLogin };
}

export default useAuth;
