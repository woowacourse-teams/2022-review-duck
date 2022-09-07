import { useMutation, useQueryClient } from 'react-query';

import { userAPI } from 'api';
import { QUERY_KEY } from 'constant';

import { UseCustomMutationOptions, UpdateProfileResponse } from 'service/@shared/types';

function useUpdateProfile(mutationOptions?: UseCustomMutationOptions<UpdateProfileResponse>) {
  const queryClient = useQueryClient();

  return useMutation(userAPI.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.USER]);
    },
    ...mutationOptions,
  });
}

export { useUpdateProfile };
