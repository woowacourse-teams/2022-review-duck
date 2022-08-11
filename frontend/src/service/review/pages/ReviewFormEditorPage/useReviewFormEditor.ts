import { UseMutationResult } from 'react-query';

import {
  Question,
  ReviewForm,
  CreateReviewFormRequest,
  UpdateReviewFormRequest,
  ErrorResponse,
} from 'service/@shared/types';

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

  const initialReviewForm: ReviewForm = getReviewFormQuery.data || {
    reviewFormTitle: '',
    questions: [
      {
        value: '',
      },
    ],
  };

  const trimQuestions = (questions: Question[]) =>
    questions.filter((question) => !!question.value?.trim());

  return {
    initialReviewForm,
    isNewReviewForm: !reviewFormCode,
    isLoadError: getReviewFormQuery.isError,
    loadError: getReviewFormQuery.error,
    isSubmitLoading: submitMutation.isLoading,
    trimQuestions,
    submitReviewForm: submitMutation as SubmitMutationResult,
  };
}

export default useReviewFormEditor;
