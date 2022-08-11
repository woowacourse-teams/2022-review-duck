import { useRef, useState } from 'react';

import { Question } from 'service/@shared/types';

function useQuestions(initState?: Question[]) {
  const [questions, setQuestions] = useState<Question[]>(initState || []);
  const listKey = useRef(1);

  const addQuestion = (insertValue: Question): number => {
    const copiedQuestions = [...questions];
    const newQuestionIndex =
      copiedQuestions.push({
        ...insertValue,
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

  const updateQuestion = (index: number, updateValue: Partial<Question>) => {
    const copiedQuestions = [...questions];
    const newQuestion = { ...questions[index], ...updateValue };

    copiedQuestions.splice(index, 1, newQuestion);
    setQuestions(copiedQuestions);
  };

  return { addQuestion, removeQuestion, updateQuestion, questions };
}

export default useQuestions;
