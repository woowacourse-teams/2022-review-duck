import { useMutation } from '@tanstack/react-query';

import { templateAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { UseCustomMutationOptions } from 'types';

import queryClient from 'api/config/queryClient';

function useDeleteTemplate(mutationOptions?: UseCustomMutationOptions<null>) {
  return useMutation(templateAPI.deleteTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });
}

export { useDeleteTemplate };
