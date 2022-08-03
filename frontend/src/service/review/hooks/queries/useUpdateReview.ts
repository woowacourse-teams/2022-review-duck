import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

function useUpdateReview(mutationOptions?: UseCustomMutationOptions<null>) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.updateReview, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
    },
    ...mutationOptions,
  });
}

export default useUpdateReview;
