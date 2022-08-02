import { useMutation, useQueryClient } from 'react-query';

import { UpdateReviewFormResponse, UseCustomMutationOptions } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

function useCreateReviewForm(mutationOptions?: UseCustomMutationOptions<UpdateReviewFormResponse>) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.createForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });
}

export default useCreateReviewForm;
