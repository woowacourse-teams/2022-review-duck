import { useMutation } from 'react-query';

import { UseCustomMutationOptions } from 'service/review/types';

import reviewAPI from 'service/review/api';

function useCreateReviewForm(mutationOptions?: UseCustomMutationOptions) {
  return useMutation(reviewAPI.createForm, {
    ...mutationOptions,
  });
}

export default useCreateReviewForm;
