import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/review/types';

import reviewAPI from 'service/review/api';

function useUpdateReviewForm(reviewFormCode: string, mutationOptions?: UseCustomMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.updateForm, {
    onSuccess: () => {
      queryClient.invalidateQueries(['getReviewForm', { reviewFormCode }]);
      queryClient.invalidateQueries(['getReviews', { reviewFormCode }]);
    },
    ...mutationOptions,
  });
}

export default useUpdateReviewForm;
