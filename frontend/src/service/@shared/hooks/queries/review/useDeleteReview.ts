import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/@shared/types/review';

import reviewAPI from 'service/@shared/api/review';
import { QUERY_KEY } from 'service/@shared/constants';

function useDeleteReview(mutationOptions?: UseCustomMutationOptions<null>) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.deleteReview, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
    },
    ...mutationOptions,
  });
}

export default useDeleteReview;
