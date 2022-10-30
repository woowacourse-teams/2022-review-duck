import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

import { ErrorResponse, Question } from 'service/types';

import useSnackbar from 'common/hooks/useSnackbar';
import useQuestions from 'service/hooks/useQuestions';

import { PAGE_LIST } from 'constant';

import useAnswerEditorPage from './useAnswerEditorPage';
import { Editor } from './view/Editor';
import { Status } from './view/Status';

const EDITOR_MODE = {
  NEW_ANSWER: false,
  UPDATE_ANSWER: true,
};

function ReviewAnswerEditorPage() {
  const { reviewFormCode = '', reviewId = '' } = useParams();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const redirectUri =
    searchParams.get('redirect') || `${PAGE_LIST.REVIEW_OVERVIEW}/${reviewFormCode}`;

  const { authorProfile, reviewForm, reviewAnswer, submitCreateAnswer, submitUpdateAnswer } =
    useAnswerEditorPage(reviewFormCode, reviewId);

  const [questions, setQuestions] = useState<Question[]>(
    reviewId ? reviewAnswer.questions : reviewForm.questions,
  );
  const {
    questions: questionsWithKey,
    answeredCount,
    isAnswerComplete,
    updateAnswer,
  } = useQuestions(questions, setQuestions);

  const [isPrivate, setPrivate] = useState(!!reviewAnswer.info.isPrivate);
  const [focusQuestionIndex, setFocusQuestionIndex] = useState(0);
  const [reviewTitle, setReviewTitle] = useState(
    reviewId ? reviewAnswer.info.reviewTitle : `${authorProfile?.nickname}의 회고`,
  );

  const handleFocusAnswer = (index: number) => () => {
    setFocusQuestionIndex(index);
  };

  const handleChangeAnswer =
    (index: number) =>
    ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateAnswer(index, { value: target.value });
    };

  const handleChangePrivate = () => {
    setPrivate(!isPrivate);
  };

  const handleSubmitSuccess = () => {
    snackbar.show({
      icon: faCircleCheck,
      title: '작성하신 회고가 기록되었습니다.',
      description: '작성한 회고는 마이페이지를 통해 모아볼 수 있습니다.',
    });

    navigate(redirectUri, {
      replace: true,
    });
  };

  const handleSubmitError = (error: ErrorResponse) => {
    alert(error.message);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const isEditorMode = !!reviewId;

    isEditorMode === EDITOR_MODE.NEW_ANSWER &&
      submitCreateAnswer(
        { reviewTitle, questions, isPrivate },
        {
          onSuccess: handleSubmitSuccess,
          onError: handleSubmitError,
        },
      );

    isEditorMode === EDITOR_MODE.UPDATE_ANSWER &&
      submitUpdateAnswer(
        { reviewTitle, reviewId, questions, isPrivate },
        {
          onSuccess: handleSubmitSuccess,
          onError: handleSubmitError,
        },
      );
  };

  const handleCancel = () => {
    if (!confirm('회고 작성을 정말 취소하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) return;
    navigate(-1);
  };

  const handleReviewTitleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setReviewTitle(target.value);
  };

  return (
    <>
      <Status>
        <Status.LogoButton link={PAGE_LIST.HOME} />
        <Status.FormTitle>{reviewForm.title}</Status.FormTitle>
        <Status.FocusQuestion description={questions[focusQuestionIndex].description}>
          {questions[focusQuestionIndex].value}
        </Status.FocusQuestion>
        <Status.AnsweredState answeredCount={answeredCount} questionCount={questions.length} />
        <Status.UserProfile
          nickname={authorProfile?.nickname}
          profileImage={authorProfile?.profileUrl}
          description={authorProfile?.socialNickname}
        />
      </Status>

      <Editor onSubmit={handleSubmit}>
        <Editor.TitleInput
          placeholder={
            reviewId ? reviewAnswer.info.reviewTitle : `${authorProfile?.nickname}의 회고`
          }
          title={reviewTitle}
          onChange={handleReviewTitleChange}
        />

        {questionsWithKey.map(({ key, answer, ...question }, index) => (
          <Editor.AnswerField
            key={key}
            question={question.value}
            answer={answer?.value}
            description={question.description}
            onFocus={handleFocusAnswer(index)}
            onChange={handleChangeAnswer(index)}
          />
        ))}

        <Editor.PrivateCheckBox checked={isPrivate} onChange={handleChangePrivate} />

        <Editor.ConfirmButtons
          submitDisabled={!isAnswerComplete || reviewTitle === ''}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Editor>
    </>
  );
}

export default ReviewAnswerEditorPage;
