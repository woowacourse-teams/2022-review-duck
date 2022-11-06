import { useEffect, useMemo, useState } from 'react';

import QuestionsModel from 'models/Questions';

import { Question } from 'service/types';

import { useTemplateMutations } from 'service/hooks/queries/template';

function useTemplateEditor(templateId: number | null) {
  const templateMutation = useTemplateMutations();

  const [templateInfo, setTemplateInfo] = useState({ title: '', description: '' });
  const [questions, setQuestions] = useState<Question[]>([{ value: '', description: '' }]);

  const enteredQuestionsCount = useMemo(() => QuestionsModel.inputCount(questions), [questions]);

  const isAllEntered = Boolean(
    !templateInfo.title.length || !templateInfo.description.length || enteredQuestionsCount === 0,
  );

  useEffect(function getTemplateEditData() {
    if (!templateId) return;

    templateMutation.findById.mutate(Number(templateId), {
      onSuccess: ({ info: { title, description, ..._unused }, questions }) => {
        setTemplateInfo({ title, description });
        setQuestions(questions);
      },
    });
  }, []);

  return {
    templateMutation,
    templateInfo,
    questions,
    isAllEntered,

    setQuestions,
    setTemplateInfo,
  };
}

export default useTemplateEditor;
