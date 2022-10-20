import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { UseCustomMutationOptions, UpdateProfileResponse } from 'types';

function useUpdateProfile(mutationOptions?: UseCustomMutationOptions<UpdateProfileResponse>) {
  const queryClient = useQueryClient();

  return useMutation(userAPI.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.USER, QUERY_KEY.API.GET_USER_PROFILE]);
    },
    ...mutationOptions,
  });
}

export { useUpdateProfile };
