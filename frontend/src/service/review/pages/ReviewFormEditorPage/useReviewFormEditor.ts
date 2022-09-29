import { UseMutationResult } from '@tanstack/react-query';

import { ReviewForm, CreateReviewFormRequest, UpdateReviewFormRequest, ErrorResponse } from 'types';

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
    title: '',
    questions: [
      {
        value: '',
        description: '',
      },
    ],
    info: {
      creator: {
        id: -1,
        socialNickname: 'user-id',
        profileUrl: '',
        nickname: '알 수 없음',
      },
      isSelf: false,
      updateDate: '오류',
    },
  };

  return {
    initialReviewForm,
    isNewReviewForm: !reviewFormCode,
    isSubmitLoading: submitMutation.isLoading,
    submitReviewForm: submitMutation as SubmitMutationResult,
  };
}

export default useReviewFormEditor;
