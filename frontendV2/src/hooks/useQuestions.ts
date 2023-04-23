import { useMemo } from 'react';

import { Answer, Question } from 'types';

import useUniqueKey from 'common/hooks/useUniqueKey';

interface QuestionWithKey extends Question {
  key?: number;
}

interface AddQuestion {
  currentIndex: number;
  customValue?: Question;
}

function useQuestions(originQuestion: Question[], setQuestions: (question: Question[]) => void) {
  const questions: QuestionWithKey[] = useMemo(
    () =>
      originQuestion?.map((value, index) => ({
        ...value,
        key: index,
      })) || [],
    [originQuestion],
  );

  const getUniqueKey = useUniqueKey(questions.length);

  const answeredCount = questions.filter(({ answer }) => answer?.value).length;
  const isAnswerComplete = questions.length === answeredCount;

  const addQuestion = ({ currentIndex, customValue }: AddQuestion): number => {
    const insertIndex = currentIndex + 1 ?? questions.length;
    const copiedQuestions = [...questions];
    const initialQuestion = {
      key: getUniqueKey(),
      value: '',
      description: '',
    };

    copiedQuestions.splice(insertIndex, 0, { ...initialQuestion, ...customValue });
    setQuestions(copiedQuestions);

    return insertIndex;
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

    return updateQuestion.map(({ key: _removed, ...question }) => ({ ...question }));
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
