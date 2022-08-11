import { useMutation, useQueryClient } from 'react-query';

import { CreateRefreshResponse, UseCustomMutationOptions } from 'service/@shared/types';

import authAPI from 'service/@shared/api/auth';
import { QUERY_KEY } from 'service/@shared/constants';

function useCreateRefreshToken(mutationOptions?: UseCustomMutationOptions<CreateRefreshResponse>) {
  const queryClient = useQueryClient();

  return useMutation(authAPI.createRefreshToken, {
    onSettled: () => {
      queryClient.refetchQueries([QUERY_KEY.DATA.USER, QUERY_KEY.API.GET_ACCESS_TOKEN]);
    },
    ...mutationOptions,
  });
}

export { useCreateRefreshToken };
