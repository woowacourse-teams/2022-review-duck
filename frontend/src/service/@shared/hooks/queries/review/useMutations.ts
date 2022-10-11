import { useMutation } from '@tanstack/react-query';

import { reviewAPI } from 'api';
import { QUERY_KEY } from 'constant';
import { UseCustomMutationOptions } from 'types';

import queryClient from 'api/config/queryClient';

// TODO: invalidateQueries 무효화 대상 정확히 지정해주기

function useReviewMutation(mutationOptions: UseCustomMutationOptions<unknown> = {}) {
  const createFormMutation = useMutation(reviewAPI.createForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });

  const createAnswerMutation = useMutation(reviewAPI.createAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
    ...mutationOptions,
  });

  const createFormByTemplateMutation = useMutation(reviewAPI.createFormByTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });

  const updateFormMutation = useMutation(reviewAPI.updateForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
  });

  const updateAnswerMutation = useMutation(reviewAPI.updateAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
  });

  const removeFormMutation = useMutation(reviewAPI.deleteForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });

  const removeAnswerMutation = useMutation(reviewAPI.deleteAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });

  return {
    createForm: createFormMutation.mutate,
    createAnswerMutation: createAnswerMutation.mutate,
    createFormByTemplateMutation: createFormByTemplateMutation.mutate,

    updateForm: updateFormMutation.mutate,
    updateAnswer: updateAnswerMutation.mutate,

    removeForm: removeFormMutation.mutate,
    removeAnswer: removeAnswerMutation.mutate,
  };
}

export default useReviewMutation;
