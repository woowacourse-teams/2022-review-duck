import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/@shared/types/review';

import reviewAPI from 'service/@shared/api/review';
import { QUERY_KEY } from 'service/@shared/constants';

function useCreateReviewAnswer(mutationOptions?: UseCustomMutationOptions<null>) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.submitAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
    ...mutationOptions,
  });
}

export default useCreateReviewAnswer;
