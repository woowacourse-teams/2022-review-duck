import { useMutation, useQueryClient } from 'react-query';

import { templateAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { CreateFormResponse, UseCustomMutationOptions, CreateTemplateResponse } from 'types';

function useCreateForm(mutationOptions?: UseCustomMutationOptions<CreateFormResponse>) {
  const queryClient = useQueryClient();

  return useMutation(templateAPI.createForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });
}

function useCreateTemplate(mutationOptions?: UseCustomMutationOptions<CreateTemplateResponse>) {
  const queryClient = useQueryClient();

  return useMutation(templateAPI.createTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_TEMPLATES]);
    },
    ...mutationOptions,
  });
}

export { useCreateForm, useCreateTemplate };
