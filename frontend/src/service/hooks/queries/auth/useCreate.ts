import { useMutation } from '@tanstack/react-query';

import { authAPI } from 'api';
import { QUERY_KEY } from 'constant';

import { CreateRefreshResponse, UseCustomMutationOptions } from 'service/types';

import queryClient from 'api/config/queryClient';

function useCreateRefreshToken(mutationOptions?: UseCustomMutationOptions<CreateRefreshResponse>) {
  return useMutation(authAPI.createRefreshToken, {
    onSettled: () => {
      queryClient.refetchQueries([QUERY_KEY.DATA.AUTH, QUERY_KEY.API.GET_ACCESS_TOKEN]);
    },
    ...mutationOptions,
  });
}

export { useCreateRefreshToken };
