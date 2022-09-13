import { useMutation, useQueryClient } from 'react-query';

import { userAPI } from 'api';
import { UseCustomMutationOptions, UpdateProfileResponse } from 'types';

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
