import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import cn from 'classnames';
import QuestionsEditor from 'components/QuestionsEditor';
import { Question } from 'types';
import { validateReviewForm } from 'validator';

import useSnackbar from 'common/hooks/useSnackbar';

import { PAGE_LIST } from 'constant';
import { getErrorMessage } from 'utils';
import { isNumberString } from 'utils/validator';

import useReviewFormEditor from './useReviewFormEditor';
import Editor from './view/Editor';
import Status from './view/Status';

function ReviewFormEditorPage() {
  const { reviewFormCode = '' } = useParams();
  const [searchParams] = useSearchParams();

  const redirectUri = searchParams.get('redirect') || '';
  const templateIdParam = searchParams.get('template') || '';
  const templateId = isNumberString(templateIdParam) ? Number(templateIdParam) : null;

  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const {
    reviewMutations,
    isEditMode,
    isSubmitLoading,
    reviewFormTitle,
    questions,
    setQuestions,
    setReviewFormTitle,
  } = useReviewFormEditor(reviewFormCode, templateId);

  const handleChangeReviewTitle = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setReviewFormTitle(target.value);
  };

  const handleChangeQuestions = (questions: Question[]) => {
    setQuestions(questions);
  };

  const handleSubmitSuccess = (updatedFormCode: string, message: string) => {
    snackbar.show({
      title: message,
      description: '회고 참여 코드를 통해 다른 사람들과 회고를 진행할 수 있습니다.',
    });

    navigate(redirectUri || `${PAGE_LIST.REVIEW_OVERVIEW}/${updatedFormCode}`, {
      replace: true,
    });
  };

  const handleUpdateReviewForm = () => {
    reviewMutations.updateForm.mutate(
      { reviewFormCode, reviewFormTitle, questions },
      { onSuccess: () => handleSubmitSuccess(reviewFormCode, '회고가 수정되었습니다.') },
    );
  };

  const handleCreateReviewForm = () => {
    reviewMutations.createForm.mutate(
      { reviewFormTitle, questions },
      {
        onSuccess: ({ reviewFormCode: createdReviewFormCode }) =>
          handleSubmitSuccess(createdReviewFormCode, '회고가 생성되었습니다.'),
      },
    );
  };

  const handleCreateByTemplate = () => {
    if (!templateId) return;

    reviewMutations.createFormByTemplate.mutate(
      { templateId, reviewFormTitle, questions },
      {
        onSuccess: ({ reviewFormCode: createdReviewFormCode }) =>
          handleSubmitSuccess(createdReviewFormCode, '회고가 생성되었습니다.'),
      },
    );
  };

  const handleSubmitReviewForm = (event: React.FormEvent) => {
    event.preventDefault();

    try {
      validateReviewForm(reviewFormTitle, questions);
    } catch (error) {
      alert(getErrorMessage(error));
      return;
    }

    if (isEditMode) handleUpdateReviewForm();
    else if (!isEditMode && !templateId) handleCreateReviewForm();
    else if (templateId) handleCreateByTemplate();
  };

  const handleCancel = () => {
    if (!confirm('회고 생성을 정말 취소하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) return;

    navigate(-1);
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
            {isEditMode ? '수정하기' : '생성하기'}
          </Editor.SubmitButton>
        </div>
      </Editor>
    </>
  );
}

export default ReviewFormEditorPage;
