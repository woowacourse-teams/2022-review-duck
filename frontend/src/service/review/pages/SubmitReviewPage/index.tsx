import { ChangeEvent, useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';

import cn from 'classnames';

import { Question } from 'service/review/types';

import useQuestions from 'service/review/hooks/useQuestions';

import { Logo, ProgressBar, FieldSet, Text, Button, Icon, TextBox } from 'common/components';

import dom from 'assets/images/dom.png';

import styles from './styles.module.scss';

import useReviewQueries from './useReviewQueries';
import { PAGE_LIST } from 'service/@shared/constants';

function SubmitReviewPage() {
  const { reviewFormCode = '' } = useParams();
  const navigate = useNavigate();

  const { getQuestionsQuery, reviewForm, reviewMutation } = useReviewQueries(reviewFormCode);
  const { questions, updateQuestion } = useQuestions(reviewForm.questions);

  const [currentQuestion, setCurrentQuestion] = useState<Question>(reviewForm.questions[0] || {});
  const [reviewTitle] = useState<string>(reviewForm.reviewTitle);

  const answeredCount = questions.reduce(
    (prev, current) => (current.answerValue ? prev + 1 : prev),
    0,
  );

  const onSubmitReviewForm = (event: React.FormEvent) => {
    event.preventDefault();

    const answers = questions.map((question) => {
      return {
        answerValue: question.answerValue || '',
        questionId: question.questionId,
      };
    });

    // TODO: 모달로 교체 및 첫 접속 시 비로그인일 때 닉네임 물어보기.
    const nickname = prompt('닉네임을 입력해주세요.');

    if (!nickname) {
      return;
    }

    reviewMutation.mutate(
      { reviewFormCode, answers, nickname },
      {
        onSuccess: () => {
          alert('회고 답변을 성공적으로 제출했습니다.');
          navigate(`${PAGE_LIST.REVIEW_ANSWER_LIST}/${reviewFormCode}`, { replace: true });
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

  if (getQuestionsQuery.isError) {
    alert('찾을 수 없는 참여 코드입니다.');
    return <Navigate to={'/'} replace={true} />;
  }

  return (
    <>
      <div className={cn(styles.container)}>
        <Logo />

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
            <div className={cn(styles.profile)} style={{ backgroundImage: 'url(' + dom + ')' }} />
            <Text className={cn(styles.creatorName)} size={24} weight="bold">
              돔하디
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
                <TextBox
                  value={questions[index].answerValue || ''}
                  onFocus={onUpdateCurrentQuestion(index)}
                  onChange={onUpdateAnswer(index)}
                />
              </FieldSet>
            </div>
          ))}
          <div className={cn('button-container horizontal')}>
            <Button theme="outlined" onClick={onCancel}>
              <Icon code="cancel" />
              <span>취소하기</span>
            </Button>

            <Button
              type="submit"
              onClick={onSubmitReviewForm}
              disabled={answeredCount !== questions.length || reviewMutation.isLoading}
            >
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
