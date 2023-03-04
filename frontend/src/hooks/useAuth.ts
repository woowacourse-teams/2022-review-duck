import {
  useGetAccessToken,
  useGetAuthProfile,
  useCreateRefreshToken,
  useDeleteRefreshToken,
} from './queries/auth';

function useAuth() {
  const getAccessTokenQuery = useGetAccessToken();
  const getUserProfileQuery = useGetAuthProfile();

  const createRefreshToken = useCreateRefreshToken();

  const deleteRefreshToken = useDeleteRefreshToken();

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
