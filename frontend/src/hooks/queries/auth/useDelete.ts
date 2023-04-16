import { useMutation } from '@tanstack/react-query';

import { authAPI } from 'api';
import queryClient from 'api/config/queryClient';
import { UseCustomMutationOptions } from 'types';

import { QUERY_KEY } from 'constant';
import { axiosInstanceUtils } from 'utils';

function useDeleteRefreshToken(mutationOptions?: UseCustomMutationOptions<null>) {
  return useMutation(authAPI.deleteRefreshToken, {
    onSettled: () => {
      queryClient.refetchQueries([QUERY_KEY.DATA.AUTH]);
    },
    onSuccess: () => {
      axiosInstanceUtils.removeHeader('Authorization');
    },
    ...mutationOptions,
  });
}

export { useDeleteRefreshToken };
