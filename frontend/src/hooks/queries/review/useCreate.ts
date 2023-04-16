import { useMutation } from '@tanstack/react-query';

import { reviewAPI } from 'api';
import queryClient from 'api/config/queryClient';
import {
  UpdateReviewAnswerResponse,
  UpdateReviewFormResponse,
  UseCustomMutationOptions,
  CreateFormByTemplateResponse,
} from 'types';

import { QUERY_KEY } from 'constant';

function useCreateReviewForm(mutationOptions?: UseCustomMutationOptions<UpdateReviewFormResponse>) {
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
  return useMutation(reviewAPI.createAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });
}

function useCreateFormByTemplate(
  mutationOptions?: UseCustomMutationOptions<CreateFormByTemplateResponse>,
) {
  return useMutation(reviewAPI.createFormByTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.TEMPLATE]);
    },
    ...mutationOptions,
  });
}

export { useCreateReviewForm, useCreateReviewAnswer, useCreateFormByTemplate };
