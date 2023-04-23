import { useMutation } from '@tanstack/react-query';

import { reviewAPI } from 'api';
import queryClient from 'api/config/queryClient';
import {
  DeleteReviewAnswerResponse,
  DeleteReviewFormResponse,
  UseCustomMutationOptions,
} from 'types';

import { QUERY_KEY } from 'constant';

function useDeleteReviewForm(mutationOptions?: UseCustomMutationOptions<DeleteReviewFormResponse>) {
  return useMutation(reviewAPI.deleteForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });
}

function useDeleteReviewAnswer(
  mutationOptions?: UseCustomMutationOptions<DeleteReviewAnswerResponse>,
) {
  return useMutation(reviewAPI.deleteAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });
}

export { useDeleteReviewForm, useDeleteReviewAnswer };
