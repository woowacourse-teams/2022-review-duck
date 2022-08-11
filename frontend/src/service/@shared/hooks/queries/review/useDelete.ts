import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/@shared/types';

import reviewAPI from 'service/@shared/api/review';
import { QUERY_KEY } from 'service/@shared/constants';

function useDeleteReviewForm(mutationOptions?: UseCustomMutationOptions<null>) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.deleteForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });
}

function useDeleteReviewAnswer(mutationOptions?: UseCustomMutationOptions<null>) {
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
