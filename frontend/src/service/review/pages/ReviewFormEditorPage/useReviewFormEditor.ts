import { Question, ReviewForm } from 'service/@shared/types';

import {
  useCreateReviewForm,
  useGetReviewForm,
  useUpdateReviewForm,
} from 'service/@shared/hooks/queries/review';

function useReviewFormEditor(reviewFormCode: string) {
  const createMutation = useCreateReviewForm();
  const updateMutation = useUpdateReviewForm();

  const submitMutation = reviewFormCode ? updateMutation : createMutation;

  const getReviewFormQuery = useGetReviewForm(reviewFormCode, {
    enabled: !!reviewFormCode,
  });

  const initialReviewForm: ReviewForm = getReviewFormQuery.data || {
    reviewTitle: '',
    questions: [
      {
        questionValue: '',
        listKey: 'list-0',
      },
    ],
  };

  const trimQuestions = (questions: Question[]) => {
    const updatedQuestion = questions.filter((question) => !!question.questionValue?.trim());

    return updatedQuestion.map((question) => {
      const newQuestion = { ...question };

      delete newQuestion.listKey;
      return newQuestion;
    });
  };

  return {
    initialReviewForm,
    isNewReviewForm: !reviewFormCode,
    isLoadError: getReviewFormQuery.isError,
    loadError: getReviewFormQuery.error,
    isSubmitLoading: submitMutation.isLoading,
    trimQuestions,
    submitReviewForm: submitMutation,
  };
}

export default useReviewFormEditor;
