import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/@shared/types';

import templateAPI from 'service/@shared/api/template';
import { QUERY_KEY } from 'service/@shared/constants';

function useUpdateTemplate(mutationOptions?: UseCustomMutationOptions<null>) {
  const queryClient = useQueryClient();

  return useMutation(templateAPI.updateTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });
}

export { useUpdateTemplate };
