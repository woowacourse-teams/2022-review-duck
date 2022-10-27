import { useMutation } from '@tanstack/react-query';

import { templateAPI } from 'api';
import { QUERY_KEY } from 'constant';

import { UseCustomMutationOptions } from 'service/types';

import queryClient from 'api/config/queryClient';

function useUpdateTemplate(mutationOptions?: UseCustomMutationOptions<null>) {
  return useMutation(templateAPI.updateTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });
}

export { useUpdateTemplate };