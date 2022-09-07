import { useMutation, useQueryClient } from 'react-query';

import { reviewAPI } from 'api';
import { QUERY_KEY } from 'constant';
import {
  UpdateReviewAnswerResponse,
  UpdateReviewFormResponse,
  UseCustomMutationOptions,
} from 'types';

function useUpdateReviewForm(mutationOptions?: UseCustomMutationOptions<UpdateReviewFormResponse>) {
  const queryClient = useQueryClient();

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
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.updateAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
    ...mutationOptions,
  });
}

export { useUpdateReviewForm, useUpdateReviewAnswer };
