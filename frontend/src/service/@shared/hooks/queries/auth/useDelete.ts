import { useMutation, useQueryClient } from 'react-query';

import { QUERY_KEY } from 'constant';
import { UseCustomMutationOptions } from 'types';

import authAPI from 'api/auth';

function useDeleteRefreshToken(mutationOptions?: UseCustomMutationOptions<null>) {
  const queryClient = useQueryClient();

  return useMutation(authAPI.deleteRefreshToken, {
    onSettled: () => {
      queryClient.refetchQueries([QUERY_KEY.DATA.AUTH]);
    },
    ...mutationOptions,
  });
}

export { useDeleteRefreshToken };
