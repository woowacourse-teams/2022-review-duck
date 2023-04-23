import { useMutation } from '@tanstack/react-query';

import { reviewAPI } from 'api';
import queryClient from 'api/config/queryClient';
import {
  UpdateReviewAnswerResponse,
  UpdateReviewFormResponse,
  UseCustomMutationOptions,
} from 'types';

import { QUERY_KEY } from 'constant';

function useUpdateReviewForm(mutationOptions?: UseCustomMutationOptions<UpdateReviewFormResponse>) {
  return useMutation(reviewAPI.updateForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
    ...mutationOptions,
  });
}

function useUpdateReviewAnswer(
  mutationOptions?: UseCustomMutationOptions<UpdateReviewAnswerResponse>,
) {
  return useMutation(reviewAPI.updateAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
    ...mutationOptions,
  });
}

export { useUpdateReviewForm, useUpdateReviewAnswer };
