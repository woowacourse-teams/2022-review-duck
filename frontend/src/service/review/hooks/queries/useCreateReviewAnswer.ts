import { useMutation, useQueryClient } from 'react-query';

import { CreateReviewAnswer, UseCustomMutationOptions } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

function useCreateReviewAnswer(
  reviewFormCode: string,
  mutationOptions?: UseCustomMutationOptions<CreateReviewAnswer>,
) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.submitAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        QUERY_KEY.DATA.REVIEW,
        QUERY_KEY.API.GET_REVIEWS,
        { reviewFormCode },
      ]);
    },
    ...mutationOptions,
  });
}

export default useCreateReviewAnswer;
