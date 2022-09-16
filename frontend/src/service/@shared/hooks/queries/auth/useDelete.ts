import { authAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { UseCustomMutationOptions } from 'types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

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
