import { useMutation, useQueryClient } from 'react-query';

import { UpdateReviewFormResponse, UseCustomMutationOptions } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

function useUpdateReviewForm(
  reviewFormCode: string,
  mutationOptions?: UseCustomMutationOptions<UpdateReviewFormResponse>,
) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.updateForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.API.GET_REVIEW_FORM, { reviewFormCode }]);
      queryClient.invalidateQueries([QUERY_KEY.API.GET_REVIEWS, { reviewFormCode }]);
    },
    ...mutationOptions,
  });
}

export default useUpdateReviewForm;
