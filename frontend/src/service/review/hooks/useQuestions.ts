import { useRef, useState } from 'react';

import { Question } from '../types';

interface QuestionWithKey extends Partial<Question> {
  listKey?: string;
}

function useQuestions(initState?: QuestionWithKey[]) {
  const [questions, setQuestions] = useState<QuestionWithKey[]>(initState || []);
  const listKey = useRef(1);

  const addQuestion = (insertValue: QuestionWithKey): number => {
    const copiedQuestions = [...questions];
    const newQuestionIndex =
      copiedQuestions.push({
        ...insertValue,
        questionId: null,
        listKey: `list-${listKey.current}`,
      }) - 1;

    listKey.current += 1;

    setQuestions(copiedQuestions);
    return newQuestionIndex;
  };

  const removeQuestion = (index: number) => {
    const copiedQuestions = [...questions];

    copiedQuestions.splice(index, 1);
    setQuestions(copiedQuestions);
  };

  const updateQuestion = (index: number, updateValue: QuestionWithKey) => {
    const copiedQuestions = [...questions];
    const newQuestion = { ...questions[index], ...updateValue };

    copiedQuestions.splice(index, 1, newQuestion);
    setQuestions(copiedQuestions);
  };

  return { setQuestions, addQuestion, removeQuestion, updateQuestion, questions };
}

export default useQuestions;
