import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/review/types';

import reviewAPI from 'service/review/api';

function useCreateReviewAnswer(reviewFormCode: string, mutationOptions?: UseCustomMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.submitAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries(['getReviews', { reviewFormCode }]);
    },
    ...mutationOptions,
  });
}

export default useCreateReviewAnswer;
