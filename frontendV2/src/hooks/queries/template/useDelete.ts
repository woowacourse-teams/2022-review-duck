import { useMutation } from '@tanstack/react-query';

import { templateAPI } from 'api';
import queryClient from 'api/config/queryClient';
import { UseCustomMutationOptions } from 'types';

import { QUERY_KEY } from 'constant';

function useDeleteTemplate(mutationOptions?: UseCustomMutationOptions<null>) {
  return useMutation(templateAPI.deleteTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });
}

export { useDeleteTemplate };
