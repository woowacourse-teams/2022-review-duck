import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

function useDeleteReviewForm(mutationOptions?: UseCustomMutationOptions<null>) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.deleteReviewForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW]);
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
      queryClient.refetchQueries([QUERY_KEY.DATA.REVIEW_FORM, QUERY_KEY.API.GET_MY_REVIEW_FORMS]);
    },
    ...mutationOptions,
  });
}

export default useDeleteReviewForm;
