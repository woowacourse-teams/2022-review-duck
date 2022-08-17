import { useMemo, useState } from 'react';

import { Answer, Question } from 'service/@shared/types';

import useUniqueKey from 'common/hooks/useUniqueKey';

interface QuestionWithKey extends Question {
  key?: number;
}

function useQuestions(initState?: Question[]) {
  const initialQuestion: QuestionWithKey[] = useMemo(
    () => initState?.map((value, index) => ({ ...value, key: index })) || [],
    [],
  );

  const [questions, setQuestions] = useState(initialQuestion);
  const getUniqueKey = useUniqueKey(initialQuestion.length);

  const answeredCount = questions.filter(({ answer }) => answer?.value).length;
  const isAnswerComplete = questions.length === answeredCount;

  const addQuestion = (insertValue: Question): number => {
    const copiedQuestions = [...questions];
    const newQuestionIndex =
      copiedQuestions.push({
        ...insertValue,
        key: getUniqueKey(),
      }) - 1;

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

  const updateAnswer = (index: number, updateValue: Answer) => {
    const copiedQuestions = [...questions];

    const targetQuestion = questions[index];
    const updateAnswer = { ...targetQuestion.answer, ...updateValue };

    const newQuestion = { ...targetQuestion, answer: updateAnswer };

    copiedQuestions.splice(index, 1, newQuestion);
    setQuestions(copiedQuestions);
  };

  const removeBlankQuestions = (questions: QuestionWithKey[]) => {
    const updateQuestion = questions.filter((question) => !!question.value?.trim());

    return updateQuestion.map((question) => {
      delete question.key;

      return question;
    });
  };

  return {
    questions,
    answeredCount,
    isAnswerComplete,
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateAnswer,
    removeBlankQuestions,
  };
}

export default useQuestions;
