import { useMutation } from 'react-query';

import { UpdateReviewFormResponse, UseCustomMutationOptions } from 'service/review/types';

import reviewAPI from 'service/review/api';

function useCreateReviewForm(mutationOptions?: UseCustomMutationOptions<UpdateReviewFormResponse>) {
  return useMutation(reviewAPI.createForm, {
    ...mutationOptions,
  });
}

export default useCreateReviewForm;
