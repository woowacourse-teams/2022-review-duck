import React, { ChangeEvent, useState } from 'react';
import { Navigate, useParams, useNavigate, Link, useLocation } from 'react-router-dom';

import cn from 'classnames';

import { Question } from 'service/review/types';
import { RedirectState } from 'service/review/types';

import useSnackbar from 'common/hooks/useSnackbar';
import useQuestions from 'service/review/hooks/useQuestions';

import { Logo, ProgressBar, FieldSet, Text, Button, Icon, Textarea } from 'common/components';

import styles from './styles.module.scss';

import useReviewQueries from './useReviewQueries';
import { PAGE_LIST } from 'service/@shared/constants';

/**
 * @author 돔하디 <zuzudnf@gmail.com>
 * @comment 이 페이지로 라우팅을 할 때는 state로 { redirect : <redirect할 path>: string }
 *          의 형태로 넣어줘야 합니다. 이 페이지 안에서 redirect할 때 state.redirect 값을 사용해서
 *          리다이렉트를 해줍니다.
 */
function SubmitReviewPage() {
  const { reviewFormCode = '', reviewId = '' } = useParams();
  const navigate = useNavigate();
  const { addSnackbar } = useSnackbar();
  const location = useLocation();

  const { getReviewFormQuery, reviewForm, review, createMutation, updateMutation } =
    useReviewQueries(reviewFormCode, reviewId);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(reviewForm.questions[0] || {});
  const [reviewTitle] = useState<string>(reviewForm.reviewTitle);

  let initQuestions = [...reviewForm.questions];

  if (reviewId) {
    initQuestions = initQuestions.map((question, index) => {
      return {
        ...review.answers[index],
        ...question,
      };
    });
  }

  const { questions, updateQuestion } = useQuestions(initQuestions);

  const state = location.state as RedirectState;

  const redirectUrl = (state && state.redirect) || '';

  const answeredCount = questions.reduce(
    (prev, current) => (current.answerValue ? prev + 1 : prev),
    0,
  );

  const isSubmitDisabled =
    answeredCount !== questions.length || createMutation.isLoading || updateMutation.isLoading;

  const onSubmitReviewForm = (event: React.FormEvent) => {
    event.preventDefault();

    const answers = questions.map(({ questionId, answerId, answerValue = '' }) => ({
      questionId,
      answerId,
      answerValue,
    }));

    const getRedirectUrl = () =>
      `${redirectUrl}${redirectUrl !== PAGE_LIST.MY_PAGE ? `/${reviewFormCode}` : ''}`;

    if (reviewId) {
      updateMutation.mutate(
        { reviewId: +reviewId, answers },
        {
          onSuccess: () => {
            addSnackbar({
              icon: 'rate_review',
              title: '작성하신 회고가 수정되었습니다.',
              description: '작성한 회고는 마이페이지를 통해 모아볼 수 있습니다.',
            });
            navigate(getRedirectUrl(), { replace: true });
          },
          onError: ({ message }) => {
            alert(message);
          },
        },
      );
      return;
    }
    createMutation.mutate(
      { reviewFormCode, answers },
      {
        onSuccess: () => {
          addSnackbar({
            icon: 'rate_review',
            title: '작성하신 회고가 기록되었습니다.',
            description: '작성한 회고는 마이페이지를 통해 모아볼 수 있습니다.',
          });
          navigate(getRedirectUrl(), { replace: true });
        },
        onError: ({ message }) => {
          alert(message);
        },
      },
    );
  };

  const onUpdateCurrentQuestion = (index: number) => () => {
    setCurrentQuestion(questions[index]);
  };

  const onUpdateAnswer = (index: number) => (event: ChangeEvent) => {
    const $inputTarget = event.target as HTMLInputElement;

    updateQuestion(index, { answerValue: $inputTarget.value });
  };

  const onCancel = () => {
    if (!confirm('회고 작성을 정말 취소하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) return;

    navigate(-1);
  };

  if (getReviewFormQuery.isError) {
    alert('찾을 수 없는 참여 코드입니다.');
    return <Navigate to={'/'} replace={true} />;
  }

  return (
    <>
      <div className={cn(styles.container)}>
        <Link to={PAGE_LIST.HOME}>
          <Logo />
        </Link>

        <Text
          key={currentQuestion.questionValue}
          className={cn(styles.title)}
          size={40}
          weight="bold"
        >
          {currentQuestion.questionValue}
        </Text>

        <Text
          key={currentQuestion.questionDescription}
          className={cn(styles.description)}
          size={16}
        >
          {currentQuestion.questionDescription}
        </Text>

        <ProgressBar percent={(answeredCount / questions.length) * 100} />

        <Text className={cn(styles.progressText)} size={14}>
          {`총 ${questions.length}개의 질문 중 ${answeredCount}개 답변됨`}
        </Text>
        <div>
          <div className={cn(styles.profileContainer)}>
            <div
              className={cn(styles.profile)}
              style={{ backgroundImage: 'url(' + reviewForm.creator.profileUrl + ')' }}
            />
            <Text className={cn(styles.creatorName)} size={24} weight="bold">
              {reviewForm.creator.nickname}
            </Text>
          </div>
          <Text className={cn(styles.profileDescription)} size={14} weight="lighter">
            이 곳에는 프로필 소개 혹은 유저 관련 정보가 표기됩니다.
          </Text>
        </div>
      </div>

      <div className={cn(styles.container)}>
        <form onSubmit={onSubmitReviewForm}>
          <Text className={cn(styles.reviewTitle)} size={24} weight="bold">
            {reviewTitle}
          </Text>

          {questions.map((question, index) => (
            <div className={cn(styles.fieldSetContainer)} key={question.questionId}>
              <FieldSet
                size="large"
                title={question.questionValue || ''}
                description={question.questionDescription}
              >
                <>
                  <Textarea
                    size="large"
                    value={questions[index].answerValue || ''}
                    onFocus={onUpdateCurrentQuestion(index)}
                    onChange={onUpdateAnswer(index)}
                  />
                </>
              </FieldSet>
            </div>
          ))}
          <div className={cn('button-container horizontal')}>
            <Button theme="outlined" onClick={onCancel}>
              <Icon code="cancel" />
              <span>취소하기</span>
            </Button>

            <Button type="submit" onClick={onSubmitReviewForm} disabled={isSubmitDisabled}>
              <Icon code="send" />
              <span>제출하기</span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SubmitReviewPage;
