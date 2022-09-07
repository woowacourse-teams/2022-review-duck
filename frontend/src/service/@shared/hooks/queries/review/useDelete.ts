import { useMutation, useQueryClient } from 'react-query';

import { reviewAPI } from 'api';
import { QUERY_KEY } from 'constant';

import {
  DeleteReviewAnswerResponse,
  DeleteReviewFormResponse,
  UseCustomMutationOptions,
} from 'service/@shared/types';

function useDeleteReviewForm(mutationOptions?: UseCustomMutationOptions<DeleteReviewFormResponse>) {
  const queryClient = useQueryClient();

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
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.deleteAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });
}

export { useDeleteReviewForm, useDeleteReviewAnswer };
