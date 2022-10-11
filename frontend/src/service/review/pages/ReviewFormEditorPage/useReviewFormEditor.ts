import { useEffect, useState } from 'react';

import { useReviewMutations } from 'service/@shared/hooks/queries/review';

function useReviewFormEditor(reviewFormCode?: string) {
  const isEditMode = !!reviewFormCode;

  const reviewMutations = useReviewMutations();
  const isSubmitLoading = isEditMode
    ? reviewMutations.updateForm.isLoading
    : reviewMutations.createForm.isLoading;

  const [reviewFormTitle, setReviewFormTitle] = useState('');
  const [questions, setQuestions] = useState([{ value: '', description: '' }]);

  useEffect(function getReviewFormEditData() {
    if (!reviewFormCode) return;

    reviewMutations.findForm.mutate(reviewFormCode, {
      onSuccess: ({ title, questions }) => {
        setReviewFormTitle(title);
        setQuestions(questions);
      },
    });
  }, []);

  return {
    reviewMutations,
    isEditMode,
    isSubmitLoading,
    reviewFormTitle,
    questions,
    setQuestions,
    setReviewFormTitle,
  };
}

export default useReviewFormEditor;
