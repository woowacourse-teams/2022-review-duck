import { UseMutationResult } from '@tanstack/react-query';

<<<<<<< HEAD
import { ReviewForm, CreateReviewFormRequest, UpdateReviewFormRequest, ErrorResponse } from 'types';
=======
import { CreateReviewFormRequest, UpdateReviewFormRequest, ErrorResponse } from 'types';
>>>>>>> 792eed1bd567ccda61f4baee1035584b544664b0

import {
  useCreateReviewForm,
  useGetReviewForm,
  useUpdateReviewForm,
} from 'service/@shared/hooks/queries/review';

type SubmitMutationResult = UseMutationResult<
  { reviewFormCode: string },
  ErrorResponse,
  CreateReviewFormRequest | UpdateReviewFormRequest
>;

function useReviewFormEditor(reviewFormCode: string) {
  const createMutation = useCreateReviewForm();
  const updateMutation = useUpdateReviewForm();

  const submitMutation = reviewFormCode ? updateMutation : createMutation;

  const getReviewFormQuery = useGetReviewForm(reviewFormCode, {
    enabled: !!reviewFormCode,
  });

  return {
    reviewForm: getReviewFormQuery.data,
    isNewReviewForm: !reviewFormCode,
    isSubmitLoading: submitMutation.isLoading,
    submitReviewForm: submitMutation as SubmitMutationResult,
  };
}

export default useReviewFormEditor;
