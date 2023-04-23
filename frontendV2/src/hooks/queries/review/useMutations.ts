import { useMutation } from '@tanstack/react-query';

import { reviewAPI } from 'api';
import queryClient from 'api/config/queryClient';
import { UseCustomMutationOptions } from 'types';

import { QUERY_KEY } from 'constant';

// TODO: invalidateQueries 무효화 대상 정확히 지정해주기

function useReviewMutation(mutationOptions: UseCustomMutationOptions<unknown> = {}) {
  const findForm = useMutation(reviewAPI.getForm);
  const findAnswer = useMutation(reviewAPI.getFormAnswer);

  const createForm = useMutation(reviewAPI.createForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });

  const createAnswer = useMutation(reviewAPI.createAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
    ...mutationOptions,
  });

  const createFormByTemplate = useMutation(reviewAPI.createFormByTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });

  const updateForm = useMutation(reviewAPI.updateForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
  });

  const updateAnswer = useMutation(reviewAPI.updateAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
  });

  const removeForm = useMutation(reviewAPI.deleteForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });

  const removeAnswer = useMutation(reviewAPI.deleteAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });

  return {
    findForm,
    findAnswer,

    createForm,
    createAnswer,
    createFormByTemplate,

    updateForm,
    updateAnswer,

    removeForm,
    removeAnswer,
  };
}

export default useReviewMutation;
