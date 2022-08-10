import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';

import cn from 'classnames';

import useSnackbar from 'common/hooks/useSnackbar';
import useQuestions from 'service/review/hooks/useQuestions';

import { getErrorMessage, setFormFocus } from 'service/@shared/utils';

import { Button, Icon, Logo, TextBox } from 'common/components';

import QuestionCard from 'service/@shared/components/QuestionCard';
import QuestionEditor from 'service/review/components/QuestionEditor';

import styles from './styles.module.scss';

import useReviewFormEditor from './useReviewFormEditor';
import { PAGE_LIST } from 'service/@shared/constants';
import { validateReviewForm } from 'service/@shared/validator';

function ReviewFormEditorPage() {
  const { reviewFormCode = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    initialReviewForm,
    isNewReviewForm,
    isSubmitLoading,
    isLoadError,
    loadError,
    trimQuestions,
    submitReviewForm,
  } = useReviewFormEditor(reviewFormCode);

  const [reviewTitle, setReviewTitle] = useState(initialReviewForm.reviewTitle);
  const { questions, addQuestion, removeQuestion, updateQuestion } = useQuestions(
    initialReviewForm.questions,
  );

  const { showSnackbar } = useSnackbar();
  const redirectUri = searchParams.get('redirect');

  useEffect(() => {
    if (isLoadError) {
      alert(loadError?.message);
      navigate(PAGE_LIST.HOME);
    }
  }, []);

  const handleAddQuestion = ({
    currentTarget: $inputTarget,
  }: React.MouseEvent | React.KeyboardEvent) => {
    let questionIndex = null;

    flushSync(() => {
      questionIndex = addQuestion({ questionValue: '' });
    });

    if (questionIndex === null) return;

    setFormFocus($inputTarget as HTMLInputElement, questionIndex);
  };

  const handleUpdateQuestion = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuestion = { questionValue: event.target.value };

    updateQuestion(index, updatedQuestion);
  };

  const handleDeleteQuestion =
    (index: number) =>
    ({ currentTarget: $inputTarget }: React.MouseEvent | React.KeyboardEvent) => {
      if (questions.length <= 1) return;

      const previousInputIndex = index - 1;

      removeQuestion(index);
      setFormFocus($inputTarget as HTMLInputElement, previousInputIndex);
    };

  const handleChangeReviewTitle = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setReviewTitle(target.value);
  };

  const handleSubmitReviewForm = (event: React.FormEvent) => {
    event.preventDefault();

    const submitQuestions = trimQuestions(questions);

    try {
      validateReviewForm(reviewTitle, submitQuestions);
    } catch (error) {
      alert(getErrorMessage(error));
      return;
    }

    submitReviewForm(
      { reviewTitle, reviewFormCode, questions: submitQuestions },
      {
        onSuccess: ({ reviewFormCode }) => {
          showSnackbar({
            title: isNewReviewForm ? '회고가 생성되었습니다.' : '회고가 수정되었습니다.',
            description: '회고 참여코드를 공유하여, 회고를 시작할 수 있습니다.',
          });

          navigate(redirectUri || `${PAGE_LIST.REVIEW_OVERVIEW}/${reviewFormCode}`, {
            replace: true,
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

            <Button type="button" onClick={handleSubmitReviewForm} disabled={isSubmitLoading}>
              <Icon code="drive_file_rename_outline" />
              <span>{isNewReviewForm ? '생성하기' : '수정하기'}</span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ReviewFormEditorPage;
