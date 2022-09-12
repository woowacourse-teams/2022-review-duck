import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';

import cn from 'classnames';
import { PAGE_LIST } from 'constant';
import { Question } from 'types';

import useSnackbar from 'common/hooks/useSnackbar';
import useQuestions from 'service/@shared/hooks/useQuestions';

import { getErrorMessage } from 'service/@shared/utils';

import { Button, FlexContainer, Icon, Logo, TextBox } from 'common/components';

import QuestionCard from 'service/@shared/components/QuestionCard';
import QuestionsEditor from 'service/@shared/components/QuestionsEditor';

import styles from './styles.module.scss';

import useReviewFormEditor from './useReviewFormEditor';
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
    submitReviewForm,
  } = useReviewFormEditor(reviewFormCode);

  const [reviewFormTitle, setReviewTitle] = useState(initialReviewForm.title);
  const { removeBlankQuestions } = useQuestions();
  const [questions, setQuestion] = useState(initialReviewForm.questions);

  const { showSnackbar } = useSnackbar();
  const redirectUri = searchParams.get('redirect');

  useEffect(() => {
    if (isLoadError) {
      alert(loadError?.message);
      navigate(redirectUri || PAGE_LIST.HOME);
    }
  }, []);

  const handleChangeReviewTitle = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setReviewTitle(target.value);
  };

  const handleChangeQuestions = (questions: Question[]) => {
    setQuestion(questions);
  };

  const handleSubmitReviewForm = (event: React.FormEvent) => {
    event.preventDefault();

    const submitQuestions = removeBlankQuestions(questions);

    try {
      validateReviewForm(reviewFormTitle, submitQuestions);
    } catch (error) {
      alert(getErrorMessage(error));
      return;
    }

    submitReviewForm.mutate(
      { reviewFormTitle, reviewFormCode, questions: submitQuestions },
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
      <FlexContainer className={styles.container} direction="column">
        <Link to={PAGE_LIST.HOME}>
          <Logo />
        </Link>

        <FlexContainer direction="column" gap="small">
          {questions.map(
            (question, index) =>
              question.value && (
                <QuestionCard
                  key={index}
                  numbering={index + 1}
                  type="text"
                  title={question.value}
                  description={question.description}
                />
              ),
          )}
        </FlexContainer>
      </FlexContainer>

      <div>
        <FlexContainer className={cn(styles.container, styles.sticky)} direction="column">
          <TextBox
            theme="underline"
            size="large"
            placeholder="회고의 제목을 입력해주세요."
            value={reviewFormTitle}
            onChange={handleChangeReviewTitle}
          />

          <QuestionsEditor initialQuestions={questions} onUpdate={handleChangeQuestions} />

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
        </FlexContainer>
      </div>
    </>
  );
}

export default ReviewFormEditorPage;
