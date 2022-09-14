import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { PAGE_LIST } from 'constant';
import { ErrorResponse } from 'types';

import useSnackbar from 'common/hooks/useSnackbar';
import useQuestions from 'service/@shared/hooks/useQuestions';

import { CheckBox } from 'common/components';

import useAnswerEditorPage from './useAnswerEditorPage';
import { Editor } from './views/Editor';
import { Status } from './views/Status';

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

  const [isPrivate, setPrivate] = useState(!!reviewContents.info.isPrivate);
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
      submitCreateAnswer(
        { questions, isPrivate },
        {
          onSuccess: handleSubmitSuccess,
          onError: handleSubmitError,
        },
      );

    isEditorMode === EDITOR_MODE.UPDATE_ANSWER &&
      submitUpdateAnswer(
        { reviewId, questions, isPrivate },
        {
          onSuccess: handleSubmitSuccess,
          onError: handleSubmitError,
        },
      );
  };

  const handleCancel = () => {
    if (!confirm('회고 작성을 정말 취소하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) return;

    navigate(redirectUri, {
      replace: true,
    });
  };

  return (
    <>
      <Status>
        <Status.LogoButton link={PAGE_LIST.HOME} />

        <Status.FocusQuestion description={questions[focusQuestionIndex].description}>
          {questions[focusQuestionIndex].value}
        </Status.FocusQuestion>
        <Status.AnsweredState answeredCount={answeredCount} questionCount={questions.length} />
        <Status.UserProfile
          nickname={authorProfile?.nickname}
          profileImage={authorProfile?.profileUrl}
          description="이 프로필로 회고에 기록됩니다."
        />
      </Status>

      <Editor onSubmit={handleSubmit}>
        <Editor.Title>{reviewForm?.title}</Editor.Title>

        {questions.map(({ key, answer, ...question }, index) => (
          <Editor.AnswerField
            key={key}
            question={question.value}
            answer={answer?.value}
            description={question.description}
            onFocus={handleFocusAnswer(index)}
            onChange={handleChangeAnswer(index)}
          />
        ))}

        <CheckBox checked={isPrivate} onChange={() => setPrivate(!isPrivate)}>
          이 회고 답변을 비공개로 설정하기
        </CheckBox>

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
