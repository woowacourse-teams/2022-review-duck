import { axiosInstanceUtils } from '../@shared/utils';

import {
  useGetAccessToken,
  useGetAuthProfile,
  useCreateRefreshToken,
  useDeleteRefreshToken,
} from './queries/auth';

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

  const getUserProfileQuery = useGetAuthProfile({
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
