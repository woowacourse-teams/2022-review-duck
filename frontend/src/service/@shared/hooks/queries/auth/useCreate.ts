import { useMutation, useQueryClient } from 'react-query';

import { QUERY_KEY } from 'constant';
import { CreateRefreshResponse, UseCustomMutationOptions } from 'types';

import authAPI from 'api/auth';

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
