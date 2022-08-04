import { useMutation, useQueryClient } from 'react-query';

import { UpdateReviewFormResponse, UseCustomMutationOptions } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

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
