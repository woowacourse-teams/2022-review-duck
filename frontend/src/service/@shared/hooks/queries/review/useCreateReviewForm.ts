import { useMutation, useQueryClient } from 'react-query';

import { UpdateReviewFormResponse, UseCustomMutationOptions } from 'service/@shared/types/review';

import reviewAPI from 'service/@shared/api/review';
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

export default useCreateReviewForm;
