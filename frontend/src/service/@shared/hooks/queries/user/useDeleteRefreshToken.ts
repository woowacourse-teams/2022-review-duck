import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/review/types';

import { userAPI } from 'service/@shared/api';
import { QUERY_KEY } from 'service/@shared/constants';

function useDeleteRefreshToken(mutationOptions?: UseCustomMutationOptions<null>) {
  const queryClient = useQueryClient();

  return useMutation(userAPI.deleteRefreshToken, {
    onSettled: () => {
      queryClient.refetchQueries([QUERY_KEY.DATA.USER]);
    },
    ...mutationOptions,
  });
}

export default useDeleteRefreshToken;
