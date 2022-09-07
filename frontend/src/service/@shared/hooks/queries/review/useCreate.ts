import { useMutation, useQueryClient } from 'react-query';

import { reviewAPI } from 'api';

import {
  UpdateReviewAnswerResponse,
  UpdateReviewFormResponse,
  UseCustomMutationOptions,
  CreateFormByTemplateResponse,
} from 'service/@shared/types';

import { QUERY_KEY } from 'service/@shared/constants';

function useCreateReviewForm(mutationOptions?: UseCustomMutationOptions<UpdateReviewFormResponse>) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.createForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });
}

function useCreateReviewAnswer(
  mutationOptions?: UseCustomMutationOptions<UpdateReviewAnswerResponse>,
) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.createAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
    ...mutationOptions,
  });
}

function useCreateFormByTemplate(
  mutationOptions?: UseCustomMutationOptions<CreateFormByTemplateResponse>,
) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.createFormByTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });
}

export { useCreateReviewForm, useCreateReviewAnswer, useCreateFormByTemplate };
