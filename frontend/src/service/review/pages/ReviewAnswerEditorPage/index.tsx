import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { ErrorResponse } from 'service/@shared/types';

import useSnackbar from 'common/hooks/useSnackbar';
import useQuestions from 'service/review/hooks/useQuestions';

import useAnswerEditorPage from './useAnswerEditorPage';
import { Editor } from './views/Editor';
import { Status } from './views/Status';
import { PAGE_LIST } from 'service/@shared/constants';

/*
  TODO:
  - [ ] 상수 분리
  - [ ] 에러 바운더리 적용
*/

const EDITOR_MODE = {
  NEW_ANSWER: false,
  UPDATE_ANSWER: true,
};

function ReviewAnswerEditorPage() {
  const { reviewFormCode = '', reviewId = '' } = useParams();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const redirectUri =
    searchParams.get('redirect') || `${PAGE_LIST.REVIEW_OVERVIEW}/${reviewFormCode}`;

  const { authorProfile, reviewForm, reviewContents, submitCreateAnswer, submitUpdateAnswer } =
    useAnswerEditorPage(reviewFormCode, reviewId);
  const { questions, answeredCount, isAnswerComplete, updateAnswer } = useQuestions(
    reviewContents.questions,
  );
  const [focusQuestionIndex, setFocusQuestionIndex] = useState(0);

  const handleFocusAnswer = (index: number) => () => {
    setFocusQuestionIndex(index);
  };

  const handleChangeAnswer =
    (index: number) =>
    ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateAnswer(index, { value: target.value });
    };

  const handleSubmitSuccess = () => {
    showSnackbar({
      icon: 'rate_review',
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
      submitCreateAnswer(questions, {
        onSuccess: handleSubmitSuccess,
        onError: handleSubmitError,
      });

    isEditorMode === EDITOR_MODE.UPDATE_ANSWER &&
      submitUpdateAnswer(reviewId, questions, {
        onSuccess: handleSubmitSuccess,
        onError: handleSubmitError,
      });
  };

  const handleCancel = () => {
    if (!confirm('회고 작성을 정말 취소하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) return;

    navigate(-1);
  };

  return (
    <>
      <Status>
        <Status.LogoButton link={PAGE_LIST.HOME} />

        <Status.FocusQuestion description="질문에 대한 설명">
          {questions[focusQuestionIndex].value}
        </Status.FocusQuestion>
        <Status.AnsweredState answeredCount={answeredCount} questionCount={questions.length} />
        <Status.UserProfile
          nickname={authorProfile?.nickname}
          profileImage={authorProfile?.profileUrl}
          description="유저 소개"
        />
      </Status>

      <Editor onSubmit={handleSubmit}>
        <Editor.Title>{reviewForm?.title}</Editor.Title>

        {questions.map(({ key, value, answer }, index) => (
          <Editor.AnswerField
            key={key}
            question={value}
            answer={answer?.value}
            onFocus={handleFocusAnswer(index)}
            onChange={handleChangeAnswer(index)}
          />
        ))}

        <Editor.ConfirmButtons
          submitDisabled={!isAnswerComplete}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Editor>
    </>
  );
}

export default ReviewAnswerEditorPage;
