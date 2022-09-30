import { useLayoutEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

import { faArrowRightFromBracket, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';
import { PAGE_LIST } from 'constant';

import useSnackbar from 'common/hooks/useSnackbar';
import useQuestions from 'service/@shared/hooks/useQuestions';

import { getErrorMessage } from 'service/@shared/utils';

import { Button, Logo, TextBox, Text, Textarea, FieldSet, FlexContainer } from 'common/components';

import QuestionCard from 'service/@shared/components/QuestionCard';
import QuestionsEditor from 'service/@shared/components/QuestionsEditor';
import SmallProfileCard from 'service/@shared/components/SmallProfileCard';

import styles from './styles.module.scss';

import useTemplateFormEditorPage from './useTemplateFormEditorPage';
import Question from 'models/Question';
import { validateReviewForm } from 'service/@shared/validator';

function TemplateFormEditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const templateId = searchParams.get('templateId') || '';
  const templateEditMode = searchParams.get('templateEditMode') || '';

  const queries = useTemplateFormEditorPage(templateId, templateEditMode);

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const { removeBlankQuestions } = useQuestions();

  useLayoutEffect(function pageStateInitial() {
    if (!queries) return;

    setTitle(queries.template.title);
    setDescription(queries.template.description);
    setQuestions(queries.template.questions);
  }, []);

  if (!queries) return <>{/* Suspense, Error Boundary Used */}</>;

  const { template, submitMutation } = queries;

  const redirectUri = searchParams.get('redirect');

  const isTemplateEditMode = templateId && templateEditMode;
  const isReviewFormCreateMode = templateId && !templateEditMode;
  const isTemplateCreateMode = !templateId && !templateEditMode;

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

  /*   const submitReviewForm = (submitQuestions: Question[]) => {
    createReviewForm.mutate(
      { templateId: Number(templateId), reviewFormTitle: title, questions: submitQuestions },
      {
        onSuccess: handleSubmitSuccess,
        onError: handleSubmitError,
      },
    );
  }; */

  /*   const submitTemplate = (submitQuestions: Question[]) => {
    submitMutation.mutate(
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
 */
  /*   const handleSubmitReviewForm = (event: React.FormEvent) => {
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
  }; */

  const handleCancel = () => {
    if (!confirm('템플릿 생성을 정말 취소하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) return;

    navigate(-1);
  };

  return (
    <>
      <FlexContainer className={styles.container} direction="column" gap="large">
        <div className={styles.header}>
          <Link to={PAGE_LIST.HOME}>
            <Logo />
          </Link>
          {(isReviewFormCreateMode || isTemplateEditMode) && (
            <SmallProfileCard
              primaryText="템플릿 생성자"
              secondaryText={template.creator.nickname}
              profileUrl={template.creator.profileImage}
            />
          )}
        </div>

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
        <FlexContainer
          className={cn(styles.container, styles.sticky)}
          direction="column"
          gap="large"
        >
          <TextBox
            theme="underline"
            size="large"
            placeholder={(templateId ? '회고' : '템플릿') + '의 제목을 입력해주세요.'}
            value={title}
            onChange={handleChangeReviewTitle}
          />

          {(isTemplateCreateMode || isTemplateEditMode) && (
            <>
              <FieldSet>
                <FieldSet.Title>템플릿 설명</FieldSet.Title>
                <Textarea
                  placeholder="생성할 템플릿의 설명을 입력해주세요."
                  maxLength={200}
                  value={description}
                  onChange={handleChangeDescription}
                />
                <FieldSet.Description>{description}</FieldSet.Description>
              </FieldSet>
              <hr className={styles.line} />
            </>
          )}
          {/* 
          <QuestionsEditor initialQuestions={questions} onUpdate={handleChangeQuestions} />
 */}
          <div className={cn('button-container horizontal')}>
            <Button theme="outlined" onClick={handleCancel}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              <span>취소하기</span>
            </Button>

            <Button type="button" onClick={() => null} disabled={true}>
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>{templateEditMode === 'true' ? '수정하기' : '생성하기'}</span>
            </Button>
          </div>
        </FlexContainer>
      </div>
    </>
  );
}

export default TemplateFormEditorPage;
