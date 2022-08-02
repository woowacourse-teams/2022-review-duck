import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

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
