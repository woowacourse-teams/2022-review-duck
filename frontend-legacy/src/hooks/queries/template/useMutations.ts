import { useMutation } from '@tanstack/react-query';

import { templateAPI } from 'api';
import queryClient from 'api/config/queryClient';
import { UseCustomMutationOptions } from 'types';

import { QUERY_KEY } from 'constant';

function useTemplateMutation(mutationOptions: UseCustomMutationOptions<unknown> = {}) {
  const invalidateQueries = () => {
    queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
  };

  const findById = useMutation(templateAPI.getTemplate);
  const findList = useMutation(templateAPI.getTemplates, {
    onSuccess: invalidateQueries,
    ...mutationOptions,
  });

  const create = useMutation(templateAPI.createTemplate, {
    onSuccess: invalidateQueries,
    ...mutationOptions,
  });

  const update = useMutation(templateAPI.updateTemplate, {
    onSuccess: invalidateQueries,
    ...mutationOptions,
  });

  const remove = useMutation(templateAPI.deleteTemplate, {
    onSuccess: invalidateQueries,
    ...mutationOptions,
  });

  const createForm = useMutation(templateAPI.createForm, {
    onSuccess: invalidateQueries,
    ...mutationOptions,
  });

  return {
    findById,
    findList,
    create,
    createForm,
    update,
    remove,
  };
}

export default useTemplateMutation;
