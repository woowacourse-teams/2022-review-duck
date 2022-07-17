import { useMutation, useQuery } from 'react-query';

import { AxiosError } from 'axios';

import { ReviewFormRequest, ReviewFormResponse, ErrorResponse } from 'service/review/types';

import reviewAPI from 'service/review/api';

function useReviewFormQueries(reviewFormCode?: string | null) {
  const createMutation = useMutation<
    ReviewFormResponse,
    AxiosError<ErrorResponse>,
    ReviewFormRequest
  >(reviewAPI.createForm);
  const updateMutation = useMutation<
    ReviewFormResponse,
    AxiosError<ErrorResponse>,
    ReviewFormRequest
  >(reviewAPI.updateForm);

  const reviewFormMutation = reviewFormCode ? updateMutation : createMutation;

  const reviewFormQuery = useQuery(
    'getReviewFormData',
    () => reviewAPI.getFormData(reviewFormCode as string),
    {
      enabled: !!reviewFormCode,
      suspense: true,
    },
  );

  return { reviewFormMutation, reviewFormQuery };
}

export default useReviewFormQueries;
