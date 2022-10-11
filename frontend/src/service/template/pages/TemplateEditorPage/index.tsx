import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { faArrowRightFromBracket, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';
import { PAGE_LIST } from 'constant';
import { Question } from 'types';

import useSnackbar from 'common/hooks/useSnackbar';
import { useTemplateMutations } from 'service/@shared/hooks/queries/template';
import useNavigateHandler from 'service/@shared/hooks/useNavigateHandler';

import { isNotNull } from 'common/utils/validator';

import {
  Button,
  TextBox,
  Text,
  Textarea,
  FieldSet,
  FlexContainer,
  PageSuspense,
} from 'common/components';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import QuestionsEditor from 'service/@shared/components/QuestionsEditor';

import styles from './styles.module.scss';

const NUMBER_REGEX = /[0-9]$/; // refactor => constants

function TemplateFormPage() {
  const { templateId: templateIdParams = '' } = useParams();
  const snackbar = useSnackbar();
  const { navigate } = useNavigateHandler();
  const templateMutate = useTemplateMutations();

  const templateId = NUMBER_REGEX.test(templateIdParams) ? Number(templateIdParams) : null;

  const [templateInfo, setTemplateInfo] = useState({ title: '', description: '' });
  const [questions, setQuestions] = useState<Question[]>([{ value: '', description: '' }]);

  const enteredQuestionsCount = useMemo(
    () => questions.filter((data) => data.value !== '').length,
    [questions],
  );

  const isAllEntered = Boolean(
    !templateInfo.title.length || !templateInfo.description.length || enteredQuestionsCount === 0,
  );

  useEffect(function getTemplateEditData() {
    if (!templateId) return;

    templateMutate.findById(Number(templateId), {
      onSuccess: ({ info: { title, description, ..._unused }, questions }) => {
        setTemplateInfo({ title, description });
        setQuestions(questions);
      },
    });
  }, []);

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

  const handleSubmit = () => {
    const requestBody = {
      templateTitle: templateInfo.title,
      templateDescription: templateInfo.description,
      questions,
    };

    const isEditable = isNotNull(templateId);

    !isEditable &&
      templateMutate.create(requestBody, {
        onSuccess: ({ templateId }) => handleSubmitSuccess(templateId, '템플릿을 등록하였습니다.'),
        onError: (error) => snackbar.show({ theme: 'danger', title: error.message }),
      });

    isEditable &&
      templateMutate.update(
        {
          templateId: templateId,
          ...requestBody,
        },
        {
          onSuccess: () => handleSubmitSuccess(templateId, '템플릿을 수정하였습니다.'),
          onError: (error) => snackbar.show({ theme: 'danger', title: error.message }),
        },
      );
  };

  const handleCancel = () => {
    if (!confirm('템플릿 생성 취소 시, 작성 중인 내용은 모두 사라집니다.\n정말 취소하시겠습니까?'))
      return;

    navigate(-1);
  };

  return PageSuspense(
    <LayoutContainer className={styles.container}>
      <FlexContainer
        className={cn(styles.templateInfoContainer, styles.informationEditor)}
        gap="large"
      >
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
            placeholder="생성할 템플릿의 설명을 입력해주세요."
            maxLength={200}
            value={templateInfo.description}
            onChange={handleChangeInformation('description')}
          />
          <FieldSet.Description>템플릿을 활용처, 소개에 대해 입력해주세요.</FieldSet.Description>
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
