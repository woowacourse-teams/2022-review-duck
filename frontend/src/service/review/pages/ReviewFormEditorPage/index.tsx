import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import cn from 'classnames';
import { PAGE_LIST } from 'constant';
import { Question } from 'types';

import useSnackbar from 'common/hooks/useSnackbar';

import { getErrorMessage } from 'service/@shared/utils';

import QuestionsEditor from 'service/@shared/components/QuestionsEditor';

import useReviewFormEditor from './useReviewFormEditor';
import Editor from './views/Editor';
import Status from './views/Status';
import { validateReviewForm } from 'service/@shared/validator';

function ReviewFormEditorPage() {
  const { reviewFormCode = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { reviewForm, isNewReviewForm, isSubmitLoading, submitReviewForm } =
    useReviewFormEditor(reviewFormCode);

  const [reviewFormTitle, setReviewTitle] = useState(reviewForm?.title || '');
  const [questions, setQuestion] = useState(
    reviewForm?.questions || [{ value: '', description: '' }],
  );

  const { showSnackbar } = useSnackbar();

  const redirectUri = searchParams.get('redirect');

  const handleChangeReviewTitle = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setReviewTitle(target.value);
  };

  const handleChangeQuestions = (questions: Question[]) => {
    setQuestion(questions);
  };

  const handleSubmitReviewForm = (event: React.FormEvent) => {
    event.preventDefault();

    try {
      validateReviewForm(reviewFormTitle, questions);
    } catch (error) {
      alert(getErrorMessage(error));
      return;
    }

    submitReviewForm.mutate(
      { reviewFormTitle, reviewFormCode, questions },
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

    navigate(redirectUri || PAGE_LIST.HOME);
  };

  return (
    <>
      <Status>
        <Status.LinkedLogo linkTo={PAGE_LIST.HOME} />
        <Status.QuestionPreview questions={questions} />
      </Status>

      <Editor>
        <Editor.TitleInput title={reviewFormTitle} onTitleChange={handleChangeReviewTitle} />
        <QuestionsEditor value={questions} onChange={handleChangeQuestions} />
        <div className={cn('button-container horizontal')}>
          <Editor.CancelButton onCancel={handleCancel}>취소하기</Editor.CancelButton>
          <Editor.SubmitButton onSubmit={handleSubmitReviewForm} disabled={isSubmitLoading}>
            {isNewReviewForm ? '생성하기' : '수정하기'}
          </Editor.SubmitButton>
        </div>
      </Editor>
    </>
  );
}

export default ReviewFormEditorPage;
