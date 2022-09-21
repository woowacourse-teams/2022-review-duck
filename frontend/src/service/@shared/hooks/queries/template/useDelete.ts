import { useMutation, useQueryClient } from '@tanstack/react-query';

import { templateAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { UseCustomMutationOptions } from 'types';

function useDeleteTemplate(mutationOptions?: UseCustomMutationOptions<null>) {
  const queryClient = useQueryClient();

  return useMutation(templateAPI.deleteTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });
}

export { useDeleteTemplate };
