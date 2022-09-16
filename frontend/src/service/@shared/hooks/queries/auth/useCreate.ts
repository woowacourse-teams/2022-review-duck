import { authAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { CreateRefreshResponse, UseCustomMutationOptions } from 'types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateRefreshToken(mutationOptions?: UseCustomMutationOptions<CreateRefreshResponse>) {
  const queryClient = useQueryClient();

  return useMutation(authAPI.createRefreshToken, {
    onSettled: () => {
      queryClient.refetchQueries([QUERY_KEY.DATA.AUTH, QUERY_KEY.API.GET_ACCESS_TOKEN]);
    },
    ...mutationOptions,
  });
}

export { useCreateRefreshToken };
