import { useMutation } from '@tanstack/react-query';

import { authAPI } from 'api';
import queryClient from 'api/config/queryClient';
import { CreateRefreshResponse } from 'models/auth';
import { UseCustomMutationOptions } from 'types';

import { QUERY_KEY } from 'constant';

function useCreateRefreshToken(mutationOptions?: UseCustomMutationOptions<CreateRefreshResponse>) {
  return useMutation(authAPI.createRefreshToken, {
    onSettled: () => {
      queryClient.refetchQueries([QUERY_KEY.DATA.AUTH, QUERY_KEY.API.GET_ACCESS_TOKEN]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.AUTH, QUERY_KEY.API.GET_AUTH_MY_PROFILE]);
    },
    ...mutationOptions,
  });
}

export { useCreateRefreshToken };
