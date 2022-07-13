import { ChangeEvent, MouseEvent, KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';

import cn from 'classnames';

import useQuestions from 'service/review/hooks/useQuestions';

import { setFormFocus } from 'common/utils';

import { Button, Icon, Logo, TextBox } from 'common/components';

import QuestionCard from 'service/review/components/QuestionCard';
import QuestionEditor from 'service/review/components/QuestionEditor';

import styles from './styles.module.scss';

function CreateReviewFormPage() {
  // react query로 데이터 로드

  const { questions, addQuestion, removeQuestion, editQuestion } = useQuestions([
    { listKey: 'list-0', questionValue: '' },
  ]);

  const handleUpdateQuestion = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const updatedQuestion = { ...questions[index], questionValue: event.target.value };

    editQuestion(index, updatedQuestion);
  };

  const handleAddQuestion = ({ currentTarget: $inputTarget }: MouseEvent | KeyboardEvent) => {
    let questionIndex = null;

    flushSync(() => {
      questionIndex = addQuestion({ questionValue: '' });
    });

    if (questionIndex === null) return;

    setFormFocus($inputTarget as HTMLInputElement, questionIndex);
  };

  const handleDeleteQuestion =
    (index: number) =>
    ({ currentTarget: $inputTarget }: MouseEvent | KeyboardEvent) => {
      if (questions.length <= 1) return;

      const previousInputIndex = index - 1;

      removeQuestion(index);
      setFormFocus($inputTarget as HTMLInputElement, previousInputIndex);
    };

  return (
    <>
      <div className={cn(styles.container, 'flex-container column')}>
        <Logo />

        <div className={cn(styles.previewContainer, 'flex-container column')}>
          {questions.map(
            ({ questionValue, questionId, listKey }, index) =>
              questionValue && (
                <QuestionCard
                  key={questionId || listKey}
                  numbering={index + 1}
                  type="text"
                  title={questionValue}
                  description="질문 설명이 이곳에 표기됩니다."
                />
              ),
          )}
        </div>
      </div>

      <div>
        <form className={cn(styles.container, styles.sticky, 'flex-container column')}>
          <TextBox theme="underline" size="large" placeholder="회고의 제목을 입력해주세요." />

          <div className={cn(styles.itemContainer, 'flex-container column')}>
            {questions.map(({ questionId, listKey, questionValue }, index) => (
              <QuestionEditor
                key={questionId || listKey}
                numbering={index + 1}
                value={questionValue}
                onChange={handleUpdateQuestion(index)}
                onAddQuestion={handleAddQuestion}
                onDeleteQuestion={handleDeleteQuestion(index)}
              />
            ))}
          </div>

          <div className={cn('button-container horizontal')}>
            <Button theme="outlined">
              <Icon code="cancel" />
              <span>취소하기</span>
            </Button>

            <Button type="button">
              <Icon code="drive_file_rename_outline" />
              <span>생성하기</span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateReviewFormPage;
