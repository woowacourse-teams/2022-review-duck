import React, { useState, ChangeEvent, MouseEvent, KeyboardEvent, FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { useParams } from 'react-router-dom';

import cn from 'classnames';

import { ReviewFormRequest } from 'service/review/types';

import useQuestions from 'service/review/hooks/useQuestions';

import { setFormFocus } from 'common/utils';

import { Button, Icon, Logo, TextBox } from 'common/components';

import QuestionCard from 'service/review/components/QuestionCard';
import QuestionEditor from 'service/review/components/QuestionEditor';

import styles from './styles.module.scss';

import useReviewFormQueries from './useReviewForm';

function CreateReviewFormPage() {
  const { reviewFormCode } = useParams();
  const { reviewFormMutation, initReviewFormData } = useReviewFormQueries(reviewFormCode);

  const [reviewTitle, setReviewTitle] = useState(initReviewFormData.reviewTitle);
  const { questions, addQuestion, removeQuestion, updateQuestion } = useQuestions(
    initReviewFormData.questions,
  );

  const handleUpdateQuestion = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const updatedQuestion = { questionValue: event.target.value };

    updateQuestion(index, updatedQuestion);
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

  const onChangeReviewTitle = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setReviewTitle(target.value);
  };

  const onClickCreateForm = (event: FormEvent) => {
    event.preventDefault();

    // TODO: 유효성 검증 작성 컨벤션 협의 후 부분 분리
    if (!reviewTitle) {
      alert('회고의 제목을 입력해주세요.');
      return;
    }

    const validQuestions = questions.filter((question) => !!question.questionValue?.trim());
    const removeListKey = validQuestions.map((question) => {
      delete question.listKey;
      return question;
    });

    if (validQuestions.length <= 0) {
      alert('질문은 최소 1개 이상 입력해주세요.');
      return;
    }

    reviewFormMutation.mutate(
      { reviewTitle, reviewFormCode, questions: removeListKey },
      {
        onSuccess: ({ reviewFormCode }) => {
          alert(`추가/수정에 성공하였습니다. 코드 : ${reviewFormCode}`);
        },
        onError: ({ response }) => {
          // TODO: 오류 메시지 파싱 함수 필요
          const errorMessage = response && response.data.message;
          alert(errorMessage);
        },
      },
    );
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
          <TextBox
            theme="underline"
            size="large"
            placeholder="회고의 제목을 입력해주세요."
            value={reviewTitle}
            onChange={onChangeReviewTitle}
          />

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

            <Button type="button" onClick={onClickCreateForm}>
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
