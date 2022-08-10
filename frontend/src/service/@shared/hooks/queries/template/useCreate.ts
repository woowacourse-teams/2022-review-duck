import { useMutation, useQueryClient } from 'react-query';

import { CreateFormResponse, UseCustomMutationOptions } from 'service/@shared/types';

import templateAPI from 'service/@shared/api/template';
import { QUERY_KEY } from 'service/@shared/constants';

function useCreateForm(mutationOptions?: UseCustomMutationOptions<CreateFormResponse>) {
  const queryClient = useQueryClient();

  return useMutation(templateAPI.createForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });
}

export { useCreateForm };
