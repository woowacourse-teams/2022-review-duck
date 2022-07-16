import { useState, ChangeEvent, MouseEvent, KeyboardEvent, FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { useMutation, UseMutationOptions, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import cn from 'classnames';

import useQuestions from 'service/review/hooks/useQuestions';

import { setFormFocus } from 'common/utils';

import { Button, Icon, Logo, TextBox } from 'common/components';

import QuestionCard from 'service/review/components/QuestionCard';
import QuestionEditor from 'service/review/components/QuestionEditor';

import styles from './styles.module.scss';

import reviewAPI from 'service/review/api';

function CreateReviewFormPage() {
  const { reviewFormCode = '' } = useParams();

  const [reviewTitle, setReviewTitle] = useState('');
  const { questions, setQuestions, addQuestion, removeQuestion, updateQuestion } = useQuestions([
    { listKey: 'list-0', questionId: null, questionValue: '' },
  ]);

  const { isSuccess, refetch } = useQuery(
    ['getReviewFromData', reviewFormCode],
    () => reviewAPI.getFormData(reviewFormCode),
    {
      enabled: false,
      onSuccess: (data) => {
        setReviewTitle(data.reviewTitle);
        setQuestions(data.questions);
      },
    },
  );

  if (isSuccess === false && reviewFormCode) {
    refetch();
  }

  const mutateOptions: UseMutationOptions<any, any, any> = {
    onSuccess: ({ reviewFormCode }: any) => {
      alert('업데이트 코드: ' + reviewFormCode);
    },
    onError: ({ response: { data } }: any) => {
      alert(data.message);
    },
  };

  const createMutation = useMutation(reviewAPI.createForm, mutateOptions);

  const updateMutation = useMutation(reviewAPI.updateForm, mutateOptions);

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

    if (!reviewTitle) {
      alert('회고의 제목을 입력해주세요.');
      return;
    }

    const validQuestions = questions.filter((question) => !!question.questionValue?.trim());

    if (validQuestions.length <= 0) {
      alert('질문은 최소 1개 이상 입력해주세요.');
      return;
    }

    if (reviewFormCode) {
      updateMutation.mutate({
        reviewFormCode,
        reviewTitle,
        questions: validQuestions,
      });

      return;
    }

    createMutation.mutate({ reviewTitle, questions: validQuestions });
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
