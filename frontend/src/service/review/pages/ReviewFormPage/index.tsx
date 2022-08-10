import React, {
  useState,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  FormEvent,
  useEffect,
} from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';

import cn from 'classnames';

import { RedirectState } from 'service/@shared/types';

import useSnackbar from 'common/hooks/useSnackbar';
import useQuestions from 'service/review/hooks/useQuestions';

import { getErrorMessage, setFormFocus } from 'service/@shared/utils';

import { Button, Icon, Logo, TextBox } from 'common/components';

import QuestionCard from 'service/@shared/components/QuestionCard';
import QuestionEditor from 'service/review/components/QuestionEditor';

import styles from './styles.module.scss';

import useReviewFormQueries from './useReviewFormQueries';
import { PAGE_LIST } from 'service/@shared/constants';
import { validateReviewForm } from 'service/@shared/validator';

/**
 * @author 돔하디 <zuzudnf@gmail.com>
 * @comment 이 페이지로 라우팅을 할 때는 state로 { redirect : <redirect할 path>: string }
 *          의 형태로 넣어줘야 합니다. 이 페이지 안에서 redirect할 때 state.redirect 값을 사용해서
 *          리다이렉트를 해줍니다.
 */
function CreateReviewFormPage() {
  const { reviewFormCode } = useParams();
  const { addSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const { redirect = '' } = (location.state as RedirectState) || {};

  const { reviewFormMutation, getReviewFormQuery, initReviewFormData } =
    useReviewFormQueries(reviewFormCode);

  const [reviewTitle, setReviewTitle] = useState(initReviewFormData.reviewTitle);
  const { questions, addQuestion, removeQuestion, updateQuestion } = useQuestions(
    initReviewFormData.questions,
  );

  const isEditMode = !!reviewFormCode;

  useEffect(() => {
    if (getReviewFormQuery.isError) {
      alert('존재하지 않는 회고 폼입니다.');
      navigate(PAGE_LIST.HOME);
    }
  }, []);

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

  const handleChangeReviewTitle = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setReviewTitle(target.value);
  };

  const onClickCreateForm = (event: FormEvent) => {
    event.preventDefault();

    const validQuestions = questions.filter((question) => !!question.questionValue?.trim());

    try {
      validateReviewForm(reviewTitle, validQuestions);
    } catch (error) {
      alert(getErrorMessage(error));
      return;
    }

    const removeListKey = validQuestions.map((question) => {
      const newQuestion = { ...question };

      delete newQuestion.listKey;
      return question;
    });

    reviewFormMutation.mutate(
      { reviewTitle, reviewFormCode, questions: removeListKey },
      {
        onSuccess: ({ reviewFormCode }) => {
          navigate(redirect || `${PAGE_LIST.REVIEW_OVERVIEW}/${reviewFormCode}`, { replace: true });
          addSnackbar({
            title: isEditMode ? '회고가 수정되었습니다.' : '회고가 생성되었습니다.',
            description: '회고 참여코드를 공유하여, 회고를 시작할 수 있습니다.',
          });
        },
        onError: ({ message }) => {
          alert(message);
        },
      },
    );
  };

  const handleCancel = () => {
    if (!confirm('회고 생성을 정말 취소하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) return;

    navigate(-1);
  };

  return (
    <>
      <div className={cn(styles.container, 'flex-container column')}>
        <Link to={PAGE_LIST.HOME}>
          <Logo />
        </Link>

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
            onChange={handleChangeReviewTitle}
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
            <Button theme="outlined" onClick={handleCancel}>
              <Icon code="cancel" />
              <span>취소하기</span>
            </Button>

            <Button
              type="button"
              onClick={onClickCreateForm}
              disabled={reviewFormMutation.isLoading}
            >
              <Icon code="drive_file_rename_outline" />
              <span>{isEditMode ? '수정하기' : '생성하기'}</span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateReviewFormPage;
