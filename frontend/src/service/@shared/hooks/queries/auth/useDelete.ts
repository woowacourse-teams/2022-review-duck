import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/@shared/types';

import authAPI from 'api/auth';
import { QUERY_KEY } from 'service/@shared/constants';

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
