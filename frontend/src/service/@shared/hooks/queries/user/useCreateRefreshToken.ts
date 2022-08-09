import { useMutation, useQueryClient } from 'react-query';

import { CreateRefreshResponse } from 'service/@shared/types';
import { UseCustomMutationOptions } from 'service/@shared/types/review';

import { userAPI } from 'service/@shared/api';
import { QUERY_KEY } from 'service/@shared/constants';

function useCreateRefreshToken(mutationOptions?: UseCustomMutationOptions<CreateRefreshResponse>) {
  const queryClient = useQueryClient();

  return useMutation(userAPI.createRefreshToken, {
    onSettled: () => {
      queryClient.refetchQueries([QUERY_KEY.DATA.USER, QUERY_KEY.API.GET_ACCESS_TOKEN]);
    },
    ...mutationOptions,
  });
}

export default useCreateRefreshToken;
