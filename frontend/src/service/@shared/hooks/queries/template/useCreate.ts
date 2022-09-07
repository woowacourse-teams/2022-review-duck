import { useMutation, useQueryClient } from 'react-query';

import {
  CreateFormResponse,
  UseCustomMutationOptions,
  CreateTemplateResponse,
} from 'service/@shared/types';

import templateAPI from 'api/template';
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
