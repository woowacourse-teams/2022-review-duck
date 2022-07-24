import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

function useUpdateReviewForm(reviewFormCode: string, mutationOptions?: UseCustomMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.updateForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.GET_REVIEW_FORM, { reviewFormCode }]);
      queryClient.invalidateQueries([QUERY_KEY.GET_REVIEWS, { reviewFormCode }]);
    },
    ...mutationOptions,
  });
}

export default useUpdateReviewForm;
