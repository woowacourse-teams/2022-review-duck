import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

function useCreateReviewAnswer(reviewFormCode: string, mutationOptions?: UseCustomMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.submitAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.GET_REVIEWS, { reviewFormCode }]);
    },
    ...mutationOptions,
  });
}

export default useCreateReviewAnswer;
