import { useMutation, useQueryClient } from 'react-query';

import { UpdateReviewFormResponse, UseCustomMutationOptions } from 'service/@shared/types/review';

import reviewAPI from 'service/@shared/api/review';
import { QUERY_KEY } from 'service/@shared/constants';

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

export default useUpdateReviewForm;
