import useGetAccessToken from 'service/@shared/hooks/queries/user/useGetAccessToken';

import { axiosInstanceUtils } from '../utils';

import useCreateRefreshToken from './queries/user/useCreateRefreshToken';
import useDeleteRefreshToken from './queries/user/useDeleteRefreshToken';
import useGetUserProfile from './queries/user/useGetUserProfile';

function useAuth() {
  const createRefreshToken = useCreateRefreshToken();

  const deleteRefreshToken = useDeleteRefreshToken({
    onSuccess: () => {
      axiosInstanceUtils.removeHeader('Authorization');
    },
  });

  const getAccessTokenQuery = useGetAccessToken({
    onSuccess: ({ accessToken }) => {
      axiosInstanceUtils.setHeader('Authorization', `Bearer ${accessToken}`);
    },
    onError: () => {
      axiosInstanceUtils.removeHeader('Authorization');
    },
  });

  const getUserProfileQuery = useGetUserProfile({
    enabled: getAccessTokenQuery.isSuccess,
  });
  const isLogin = getUserProfileQuery.isSuccess;

  return {
    createRefreshToken,
    deleteRefreshToken,
    getAccessTokenQuery,
    getUserProfileQuery,
    isLogin,
  };
}

export default useAuth;
