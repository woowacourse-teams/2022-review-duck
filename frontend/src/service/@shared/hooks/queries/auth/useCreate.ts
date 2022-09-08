import { useMutation, useQueryClient } from 'react-query';

import { authAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { CreateRefreshResponse, UseCustomMutationOptions } from 'types';

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
