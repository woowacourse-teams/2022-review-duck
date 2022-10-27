import { useMutation } from '@tanstack/react-query';

import { templateAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { CreateFormResponse, UseCustomMutationOptions, CreateTemplateResponse } from 'types';

import queryClient from 'api/config/queryClient';

function useCreateForm(mutationOptions?: UseCustomMutationOptions<CreateFormResponse>) {
  return useMutation(templateAPI.createForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });
}

function useCreateTemplate(mutationOptions?: UseCustomMutationOptions<CreateTemplateResponse>) {
  return useMutation(templateAPI.createTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_USER_TEMPLATES]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE, QUERY_KEY.API.GET_TEMPLATES]);
    },
    ...mutationOptions,
  });
}

export { useCreateForm, useCreateTemplate };
