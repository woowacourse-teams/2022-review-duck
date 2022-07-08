import cn from 'classnames';
import styles from './styles.module.scss';
import Logo from 'common/components/Logo';
import ProgressBar from 'common/components/ProgressBar';
import FieldSet from 'common/components/FieldSet';
import Text from 'common/components/Text';
import Button from 'common/components/Button';
import Icon from 'common/components/Icon';
import TextBox from 'common/components/TextBox';
import dom from 'assets/images/dom.png';

import { useEffect, useState } from 'react';

const dummyData = {
  reviewTitle: '팀 회고덕 1차 데모데이 회고',
  questions: [
    {
      questionId: 1,
      questionValue: '오늘의 기분은 어떤가요?',
      questionDescription: '체크인 점수를 선택해주세요.',
      answerValue: '',
    },
    {
      questionId: 2,
      questionValue: '팀에서 어떤 역할을 했나요?',
      questionDescription: '팀에서 맡은 역할을 작성해주세요.',
      answerValue: '',
    },
    {
      questionId: 3,
      questionValue: '팀에서 개선할 점은 무엇이 있을까요?',
      questionDescription: '없다면 비워두세요.',
      answerValue: '',
    },
    {
      questionId: 4,
      questionValue: '문제들을 해결하기 위해서는 어떻게 해야 할까요?',
      answerValue: '',
    },
    {
      questionId: 5,
      questionValue: '이번 회고를 통해 느낀점과 피드백을 남겨주세요.',
      answerValue: '',
    },
  ],
};

interface Question {
  questionId: number;
  questionValue: string;
  questionDescription?: string;
  answerValue: string;
}

function SubmitReviewPage() {
  const [questions, setReviewForm] = useState<Question[]>(dummyData.questions);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(dummyData.questions[0]);

  const onSubmitReviewForm = (event: React.FormEvent) => {
    event.preventDefault();
    /* API POST call */
  };

  const onUpdateCurrentQuestion = (index: number) => {
    setCurrentQuestion(questions[index]);
  };

  const onUpdateAnswer = (value: string, index: number) => {
    const copiedQuestions = [...questions];
    const newQuestion = { ...questions[index] };
    newQuestion.answerValue = value;

    copiedQuestions.splice(index, 1, newQuestion);
    setReviewForm(copiedQuestions);
  };

  const answeredCount = questions.reduce(
    (prev, current) => (current.answerValue ? prev + 1 : prev),
    0,
  );

  useEffect(() => {
    /* getReviewForm API call 후 setReviewForm 로 state 업데이트 */
  }, []);

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
            <img className={cn(styles.profile)} src={dom} alt="creator-profile" />
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
            {dummyData.reviewTitle}
          </Text>

          {questions.map((question, index) => (
            <div className={cn(styles.fieldSetContainer)} key={question.questionId}>
              <FieldSet
                size="large"
                title={question.questionValue}
                description={question.questionDescription}
              >
                <TextBox
                  value={questions[index].answerValue}
                  onFocus={() => onUpdateCurrentQuestion(index)}
                  onChange={(e) => onUpdateAnswer(e.target.value, index)}
                />
              </FieldSet>
            </div>
          ))}
          <div className={cn(styles.buttonContainer)}>
            <Button
              type="submit"
              onClick={onSubmitReviewForm}
              disabled={answeredCount !== questions.length}
            >
              <Icon code="send"></Icon>
              제출하기
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SubmitReviewPage;
