import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

import cn from 'classnames';

import { Question } from 'service/@shared/types/review';

import useSnackbar from 'common/hooks/useSnackbar';
import useQuestions from 'service/@shared/hooks/useQuestions';

import { getErrorMessage } from 'service/@shared/utils';

import { Button, Icon, Logo, TextBox, Text, Textarea, FieldSet } from 'common/components';

import QuestionCard from 'service/@shared/components/QuestionCard';
import QuestionsEditor from 'service/@shared/components/QuestionsEditor';
import SmallProfileCard from 'service/@shared/components/SmallProfileCard';

import styles from './styles.module.scss';

import useTemplateFormEditorPage from './useTemplateFormEditorPage';
import { PAGE_LIST } from 'service/@shared/constants';
import { validateReviewForm } from 'service/@shared/validator';

function TemplateFormEditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const templateId = searchParams.get('templateId') || '';
  const templateEditMode = searchParams.get('templateEditMode') || '';

  const { template, isLoadError, loadError, isSubmitLoading, templateMutation, createReviewForm } =
    useTemplateFormEditorPage(templateId, templateEditMode);

  const [title, setTitle] = useState(template.info.title);
  const [description, setDescription] = useState(template.info.description);
  const [questions, setQuestions] = useState(template.questions);
  const { removeBlankQuestions } = useQuestions();

  const { showSnackbar } = useSnackbar();
  const redirectUri = searchParams.get('redirect');

  const isTemplateEditMode = templateId && templateEditMode;
  const isReviewFormCreateMode = templateId && !templateEditMode;
  const isTemplateCreateMode = !templateId && !templateEditMode;

  useEffect(() => {
    if (isLoadError) {
      alert(loadError?.message);
      navigate(redirectUri || `${PAGE_LIST.TEMPLATE_DETAIL}/${templateId}`, { replace: true });
    }
  }, [isLoadError, loadError]);

  const handleChangeReviewTitle = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(target.value);
  };

  const handleChangeDescription = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(target.value);
  };

  const handleChangeQuestions = (questions: Question[]) => {
    setQuestions(questions);
  };

  const handleSubmitSuccess = ({ reviewFormCode }: Record<'reviewFormCode', string>) => {
    showSnackbar({
      title: '템플릿을 이용해 회고를 생성했습니다.',
      description: '회고 참여코드를 공유하여, 회고를 시작할 수 있습니다.',
    });

    navigate(redirectUri || `${PAGE_LIST.REVIEW_OVERVIEW}/${reviewFormCode}`, {
      replace: true,
    });
  };

  const handleTemplateSuccess = () => {
    showSnackbar({
      title: '템플릿을 ' + `${isTemplateEditMode ? '수정' : '생성'}` + '했습니다.',
      description:
        '이제 다른 사용자들이 ' +
        `${isTemplateEditMode ? '수정된' : '이'}` +
        ' 템플릿으로 회고를 할 수 있습니다.',
    });

    navigate(-1);
  };

  const handleSubmitError = ({ message }: Record<'message', string>) => {
    alert(message);
  };

  const submitReviewForm = (submitQuestions: Question[]) => {
    createReviewForm.mutate(
      { templateId: Number(templateId), reviewFormTitle: title, questions: submitQuestions },
      {
        onSuccess: handleSubmitSuccess,
        onError: handleSubmitError,
      },
    );
  };

  const submitTemplate = (submitQuestions: Question[]) => {
    templateMutation.mutate(
      {
        templateId: Number(templateId),
        templateTitle: title,
        templateDescription: description,
        questions: submitQuestions,
      },
      {
        onSuccess: handleTemplateSuccess,
        onError: handleSubmitError,
      },
    );
  };

  const handleSubmitReviewForm = (event: React.FormEvent) => {
    event.preventDefault();

    const submitQuestions = removeBlankQuestions(questions);

    try {
      validateReviewForm(title, submitQuestions);
    } catch (error) {
      alert(getErrorMessage(error));
      return;
    }

    if (isReviewFormCreateMode) {
      submitReviewForm(submitQuestions);
      return;
    }
    submitTemplate(submitQuestions);
  };

  const handleCancel = () => {
    if (!confirm('회고 생성을 정말 취소하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) return;

    navigate(-1);
  };

  return (
    <>
      <div className={cn(styles.container, 'flex-container column')}>
        <div className={styles.header}>
          <Link to={PAGE_LIST.HOME}>
            <Logo />
          </Link>
          {isReviewFormCreateMode || isTemplateEditMode ? (
            <SmallProfileCard
              primaryText="템플릿 생성자"
              secondaryText={template.creator.nickname}
              profileUrl={template.creator.profileUrl}
            />
          ) : (
            <Text size={18} weight="bold">
              템플릿 생성 페이지
            </Text>
          )}
        </div>

        <div className={cn(styles.previewContainer, 'flex-container column')}>
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
        </div>
      </div>

      <div>
        <div className={cn(styles.container, styles.sticky, 'flex-container column')}>
          <TextBox
            theme="underline"
            size="large"
            placeholder={(templateId ? '회고' : '템플릿') + '의 제목을 입력해주세요.'}
            value={title}
            onChange={handleChangeReviewTitle}
          />

          {(isTemplateCreateMode || isTemplateEditMode) && (
            <>
              <FieldSet size="medium" title="템플릿 설명">
                <Textarea
                  placeholder="생성할 템플릿의 설명을 입력해주세요."
                  maxLength={200}
                  value={description}
                  onChange={handleChangeDescription}
                />
              </FieldSet>
              <hr className={styles.line} />
            </>
          )}

          <QuestionsEditor initialQuestions={questions} onUpdate={handleChangeQuestions} />

          <div className={cn('button-container horizontal')}>
            <Button theme="outlined" onClick={handleCancel}>
              <Icon code="cancel" />
              <span>취소하기</span>
            </Button>

            <Button type="button" onClick={handleSubmitReviewForm} disabled={isSubmitLoading}>
              <Icon code="drive_file_rename_outline" />
              <span>생성하기</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TemplateFormEditorPage;
