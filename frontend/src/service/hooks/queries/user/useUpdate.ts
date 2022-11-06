import { useMutation } from '@tanstack/react-query';

import { userAPI } from 'api';
import queryClient from 'api/config/queryClient';

import { UseCustomMutationOptions, UpdateProfileResponse } from 'service/types';

import { QUERY_KEY } from 'constant';

function useUpdateProfile(mutationOptions?: UseCustomMutationOptions<UpdateProfileResponse>) {
  return useMutation(userAPI.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.USER, QUERY_KEY.API.GET_USER_PROFILE]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.AUTH]);
    },
    ...mutationOptions,
  });
}

export { useUpdateProfile };
