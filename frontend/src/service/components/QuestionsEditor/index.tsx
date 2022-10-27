import { FormEvent, HTMLAttributes } from 'react';
import { flushSync } from 'react-dom';

import cn from 'classnames';
import { setFormFocus } from 'utils';

import { Question } from 'service/types';

import useQuestions from 'service/hooks/useQuestions';

import styles from './styles.module.scss';

import QuestionEditorItem from 'service/components/QuestionsEditorItem';

interface QuestionsEditorProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onChange'> {
  value: Question[];
  onChange: (questions: Question[]) => unknown;
}

type UpdateQuestionEvent = React.MouseEvent | React.KeyboardEvent<HTMLInputElement>;

function QuestionsEditor({ className, value, onChange, ...rest }: QuestionsEditorProps) {
  const { questions, addQuestion, removeQuestion, updateQuestion } = useQuestions(value, onChange);

  const handleAdd = (index: number) => (event: UpdateQuestionEvent) => {
    let newQuestionIndex = -1;

    flushSync(() => {
      newQuestionIndex = addQuestion({ currentIndex: index });
    });

    setFormFocus(event.target as HTMLInputElement, newQuestionIndex);
  };

  const handleChangeQuestion = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updateQuestion(index, { value: event.target.value });
  };

  const handleChangeDescription =
    (index: number) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!questions[index]) return;

      updateQuestion(index, { description: event.target.value });
    };

  const handleDelete = (index: number) => (event: UpdateQuestionEvent) => {
    if (questions.length <= 1) return;

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
          key={key || index}
          numbering={index + 1}
          description={description}
          onChangeQuestion={handleChangeQuestion(index)}
          onChangeDescription={handleChangeDescription(index)}
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
