import { useEffect, useState } from 'react';

import { useReviewMutations } from 'service/hooks/queries/review';
import { useTemplateMutations } from 'service/hooks/queries/template';

function useReviewFormEditor(reviewFormCode: string, templateId: number | null) {
  const isEditMode = !!reviewFormCode;

  const reviewMutations = useReviewMutations();
  const templateMutations = useTemplateMutations();

  const isSubmitLoading = isEditMode
    ? reviewMutations.updateForm.isLoading
    : reviewMutations.createForm.isLoading;

  const [reviewFormTitle, setReviewFormTitle] = useState('');
  const [questions, setQuestions] = useState([{ value: '', description: '' }]);

  useEffect(function getReviewFormEditData() {
    reviewFormCode &&
      reviewMutations.findForm.mutate(reviewFormCode, {
        onSuccess: ({ title, questions }) => {
          setReviewFormTitle(title);
          setQuestions(questions);
        },
      });

    templateId &&
      templateMutations.findById.mutate(templateId, {
        onSuccess: ({ questions, info: { title } }) => {
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
