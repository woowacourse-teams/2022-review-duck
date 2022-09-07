import { useMutation, useQueryClient } from 'react-query';

import { QUERY_KEY } from 'constant';

import { UseCustomMutationOptions } from 'service/@shared/types';

import templateAPI from 'api/template';

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
