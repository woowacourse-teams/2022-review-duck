import { useMutation, useQueryClient } from '@tanstack/react-query';

import { templateAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { UseCustomMutationOptions } from 'types';

function useTemplateMutation(mutationOptions: UseCustomMutationOptions<unknown> = {}) {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
  };

  const getTemplate = useMutation(templateAPI.getTemplate);
  const getTemplates = useMutation(templateAPI.getTemplates, {
    onSuccess: invalidateQueries,
    ...mutationOptions,
  });

  const createTemplate = useMutation(templateAPI.createTemplate, {
    onSuccess: invalidateQueries,
    ...mutationOptions,
  });

  const updateTemplate = useMutation(templateAPI.updateTemplate, {
    onSuccess: invalidateQueries,
    ...mutationOptions,
  });

  const removeTemplate = useMutation(templateAPI.deleteTemplate, {
    onSuccess: invalidateQueries,
    ...mutationOptions,
  });

  const createForm = useMutation(templateAPI.createForm, {
    onSuccess: invalidateQueries,
    ...mutationOptions,
  });

  return {
    findById: getTemplate.mutate,
    findList: getTemplates.mutate,
    create: createTemplate.mutate,
    createForm: createForm.mutate,
    update: updateTemplate.mutate,
    remove: removeTemplate.mutate,
  };
}

export default useTemplateMutation;
