import { FormEvent, HTMLAttributes, useEffect } from 'react';
import { flushSync } from 'react-dom';

import cn from 'classnames';

import { Question } from 'service/@shared/types';

import useQuestions from 'service/review/hooks/useQuestions';

import { setFormFocus } from 'service/@shared/utils';

import QuestionEditorItem from 'service/@shared/components/QuestionsEditorItem';

import styles from './styles.module.scss';

interface QuestionsEditorProps extends HTMLAttributes<HTMLFormElement> {
  initialQuestions?: Question[];
  onUpdate: (questions: Question[]) => unknown;
}

type UpdateQuestionEvent = React.MouseEvent | React.KeyboardEvent<HTMLInputElement>;

const INITIAL_QUESTION: Question[] = [
  {
    value: '',
    description: '',
  },
];

function QuestionsEditor({ className, initialQuestions, onUpdate, ...rest }: QuestionsEditorProps) {
  const { questions, addQuestion, removeQuestion, updateQuestion } = useQuestions(
    initialQuestions || INITIAL_QUESTION,
  );

  useEffect(() => {
    onUpdate(questions);
  }, [questions, onUpdate]);

  const handleAdd = (index: number) => (event: UpdateQuestionEvent) => {
    let newQuestionIndex = -1;

    flushSync(() => {
      newQuestionIndex = addQuestion({ currentIndex: index });
    });

    setFormFocus(event.target as HTMLInputElement, newQuestionIndex);
  };

  const handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const $input = event.target as HTMLInputElement;
    const currentQuestion = questions[index];

    if (!currentQuestion || $input.value === '') return;

    updateQuestion(index, { value: event.target.value });
  };

  const handleDelete = (index: number) => (event: UpdateQuestionEvent) => {
    if (index === 0) return;

    removeQuestion(index);
    setFormFocus(event.target as HTMLInputElement, index - 1);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <form {...rest} className={cn(className, styles.container)} onSubmit={handleSubmit}>
      {questions.map(({ key, description, ...question }, index) => (
        <QuestionEditorItem
          key={key}
          numbering={index + 1}
          description={description}
          onChange={handleChange(index)}
          onAddQuestion={handleAdd(index)}
          onDeleteQuestion={handleDelete(index)}
        >
          {question.value}
        </QuestionEditorItem>
      ))}
    </form>
  );
}

export default QuestionsEditor;
