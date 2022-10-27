import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { faArrowRightFromBracket, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';
import { PAGE_LIST } from 'constant';

import { Question } from 'service/types';

import useSnackbar from 'common/hooks/useSnackbar';
import useNavigateHandler from 'service/hooks/useNavigateHandler';

import { isNumberString } from 'common/utils/validator';

import {
  Button,
  TextBox,
  Text,
  Textarea,
  FieldSet,
  FlexContainer,
  PageSuspense,
} from 'common/components';

import styles from './styles.module.scss';

import useTemplateEditor from './useTemplateEditor';
import { UserAgentContext } from 'common/contexts/UserAgent';
import LayoutContainer from 'service/components/LayoutContainer';
import QuestionsEditor from 'service/components/QuestionsEditor';

function TemplateFormPage() {
  const { templateId: templateIdParams = '' } = useParams();
  const snackbar = useSnackbar();
  const { navigate } = useNavigateHandler();
  const { isMobile } = useContext(UserAgentContext);

  const templateId = isNumberString(templateIdParams) ? Number(templateIdParams) : null;

  const { templateMutation, templateInfo, questions, isAllEntered, setQuestions, setTemplateInfo } =
    useTemplateEditor(templateId);

  const handleChangeQuestion = (questions: Question[]) => {
    setQuestions(questions);
  };

  type templateInfoKeys = keyof typeof templateInfo;
  const handleChangeInformation =
    (updateTarget: templateInfoKeys) =>
    ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTemplateInfo({ ...templateInfo, [updateTarget]: target.value });
    };

  const handleSubmitSuccess = (id: number, message: string) => {
    snackbar.show({
      title: message,
    });
    navigate(`${PAGE_LIST.TEMPLATE_DETAIL}/${id}`, {
      replace: true,
    });
  };

  const handleCreateTemplate = () => {
    templateMutation.create.mutate(
      {
        templateTitle: templateInfo.title,
        templateDescription: templateInfo.description,
        questions,
      },
      {
        onSuccess: ({ templateId }) => handleSubmitSuccess(templateId, '템플릿을 등록하였습니다.'),
        onError: (error) => snackbar.show({ theme: 'danger', title: error.message }),
      },
    );
  };

  const handleUpdateTemplate = () => {
    if (!templateId) return;

    templateMutation.update.mutate(
      {
        templateId,
        templateTitle: templateInfo.title,
        templateDescription: templateInfo.description,
        questions,
      },
      {
        onSuccess: () => handleSubmitSuccess(templateId, '템플릿을 수정하였습니다.'),
        onError: (error) => snackbar.show({ theme: 'danger', title: error.message }),
      },
    );
  };

  const handleSubmit = () => {
    templateId ? handleUpdateTemplate() : handleCreateTemplate();
  };

  const handleCancel = () => {
    if (!confirm('템플릿 생성 취소 시, 작성 중인 내용은 모두 사라집니다.\n정말 취소하시겠습니까?'))
      return;

    navigate(-1);
  };

  return PageSuspense(
    <LayoutContainer className={styles.container}>
      <FlexContainer className={styles.informationEditor} gap={isMobile ? 'small' : 'large'}>
        <FlexContainer gap="medium">
          <Text size={14}>템플릿 제목</Text>
          <TextBox
            placeholder={'템플릿의 제목을 입력해주세요.'}
            value={templateInfo.title}
            onChange={handleChangeInformation('title')}
          />
        </FlexContainer>

        <FlexContainer gap="medium">
          <Text size={14}>템플릿 설명</Text>
          <Textarea
            className={styles.textarea}
            autoResize={!isMobile}
            placeholder="생성할 템플릿의 설명을 입력해주세요."
            maxLength={200}
            value={templateInfo.description}
            onChange={handleChangeInformation('description')}
          />
          <FieldSet.Description>템플릿의 활용처, 소개에 대해 입력해주세요.</FieldSet.Description>
        </FlexContainer>

        <div className={styles.submitButtons}>
          <Button type="button" onClick={handleSubmit} disabled={isAllEntered}>
            <FontAwesomeIcon icon={faPenToSquare} />
            <span>{templateId ? '수정하기' : '생성하기'}</span>
          </Button>

          <Button theme="outlined" onClick={handleCancel}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <span>취소하기</span>
          </Button>
        </div>
      </FlexContainer>

      <FlexContainer
        className={cn(styles.templateInfoContainer, styles.questionsEditor)}
        gap="large"
      >
        <FlexContainer>
          <QuestionsEditor value={questions} onChange={handleChangeQuestion} />
        </FlexContainer>
      </FlexContainer>
    </LayoutContainer>,
  );
}

export default TemplateFormPage;
