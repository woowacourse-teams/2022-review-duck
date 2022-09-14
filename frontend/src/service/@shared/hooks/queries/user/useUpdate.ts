import { userAPI } from 'api';
import { UseCustomMutationOptions, UpdateProfileResponse } from 'types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUpdateProfile(mutationOptions?: UseCustomMutationOptions<UpdateProfileResponse>) {
  const queryClient = useQueryClient();

  return useMutation(userAPI.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    ...mutationOptions,
  });
}

export { useUpdateProfile };
