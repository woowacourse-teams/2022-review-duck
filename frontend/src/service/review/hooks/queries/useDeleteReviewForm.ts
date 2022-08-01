import { useMutation, useQueryClient } from 'react-query';

import { UseCustomMutationOptions } from 'service/review/types';

import { QUERY_KEY } from 'service/@shared/constants';
import reviewAPI from 'service/review/api';

function useDeleteReviewForm(mutationOptions?: UseCustomMutationOptions<null>) {
  const queryClient = useQueryClient();

  return useMutation(reviewAPI.deleteReviewForm, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY.DATA.REVIEW_FORM]);
      alert('회고를 삭제했습니다.');
    },
    onError: ({ message }) => {
      alert(message);
    },
    ...mutationOptions,
  });
}

export default useDeleteReviewForm;
