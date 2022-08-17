import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import useSnackbar from 'common/hooks/useSnackbar';

import { getElapsedTimeText } from 'service/@shared/utils';

import { Button, Icon, Text } from 'common/components';

import TagLabel from 'common/components/TagLabel';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import Questions from 'service/@shared/components/Questions';
import SmallProfileCard from 'service/@shared/components/SmallProfileCard';

import GithubIcon from 'assets/images/github.svg';

import styles from './styles.module.scss';

import useTemplateDetailQueries from './useTemplateDetailQueries';
import { GITHUB_PROFILE_URL, PAGE_LIST } from 'service/@shared/constants';

function TemplateDetailPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { template, isError, error, createFormMutation, deleteMutation } = useTemplateDetailQueries(
    Number(templateId),
  );

  useEffect(() => {
    if (isError) {
      alert(error?.message);
      navigate(-1);
    }
  }, [isError, error]);

  const handleDeleteTemplate = (templateId: number) => () => {
    if (confirm('정말 템플릿을 삭제하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) {
      deleteMutation.mutate(templateId, {
        onSuccess: () => {
          showSnackbar({
            title: '템플릿이 삭제되었습니다.',
            description: '사람들과 공유할 새로운 템플릿을 만들어보세요.',
          });
          navigate(-1);
        },
        onError: ({ message }) => {
          alert(message);
        },
      });
    }
  };

  const handleCreateSuccess = ({ reviewFormCode }: Record<'reviewFormCode', string>) => {
    showSnackbar({
      title: '템플릿을 이용해 회고를 생성했습니다.',
      description: '답변을 바로 작성하고 팀원과 공유할 수 있습니다.',
    });

    navigate(`${PAGE_LIST.REVIEW}/${reviewFormCode}`, {
      replace: true,
    });
  };

  const handleCreateFormError = ({ message }: Record<'message', string>) => {
    alert(message);
  };

  const handleStartReview = () => {
    if (
      confirm(
        '템플릿 내용 그대로 회고 답변을 시작하시겠습니까? 계속 진행하면 회고 질문지가 생성됩니다.',
      )
    ) {
      createFormMutation.mutate(Number(templateId), {
        onSuccess: handleCreateSuccess,
        onError: handleCreateFormError,
      });
    }
  };

  return (
    <LayoutContainer>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <Text className={styles.title} size={28} weight="bold">
            {template.info.title}
          </Text>
          <div className={styles.info}>
            <TagLabel>
              <>
                <Icon code="download" />
                <span>{`${template.info.usedCount}회`}</span>
              </>
            </TagLabel>
            <div className={styles.iconText}>
              <Icon code="person" />
              <span>{template.creator.nickname}</span>
            </div>
            <div className={styles.iconText}>
              <Icon code="schedule" />
              <span>{getElapsedTimeText(template.info.updatedAt)}</span>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.templateButtons}>
            <Link to={`${PAGE_LIST.TEMPLATE_FORM}?templateId=${template.info.id}`}>
              <Button>
                <Icon code="rate_review" />
                템플릿으로 회고 생성
              </Button>
            </Link>
            <Button theme="outlined" onClick={handleStartReview}>
              <Icon code="add_task" />
              템플릿으로 회고 시작
            </Button>
          </div>
          {template.isCreator && (
            <div className={styles.iconButtons}>
              <div className={styles.iconButton} onClick={handleDeleteTemplate(template.info.id)}>
                <Icon type="outlined" code="delete" />
                템플릿 삭제
              </div>
              <Link
                to={`${PAGE_LIST.TEMPLATE_FORM}?templateId=${templateId}&templateEditMode=true`}
              >
                <div className={styles.iconButton}>
                  <Icon type="outlined" code="edit" />
                  템플릿 수정
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className={styles.contentsContainer}>
        <div className={styles.description}>
          <Text size={18} weight="bold">
            템플릿 소개
          </Text>
          <Text className={styles.text} size={16} weight="lighter">
            {template.info.description}
          </Text>
        </div>
        <Questions>
          {template.questions.map((question, index) => {
            const questionText = `${index + 1}. ${question.value}`;

            return (
              <Questions.Answer key={question.id} question={questionText}>
                {question.description}
              </Questions.Answer>
            );
          })}
        </Questions>
      </div>
      <div className={styles.profileContainer}>
        <SmallProfileCard
          size="large"
          profileUrl={template.creator.profileUrl}
          primaryText={template.creator.nickname}
          secondaryText={template.creator.bio || template.creator.socialNickname || ''}
        />
        <div className={styles.iconContainer}>
          <a
            href={`${GITHUB_PROFILE_URL}${template.creator.socialNickname}`}
            target="_blank"
            rel=" noopener noreferrer"
          >
            <GithubIcon className={styles.icon} />
          </a>
          <Icon className={styles.icon} code="house" type="outlined" />
        </div>
      </div>
      <div>TOP 10 목록</div>
      {/* TODO: 메인 페이지에서 컴포넌트 가져와서 구현할 예정 */}
    </LayoutContainer>
  );
}

export default TemplateDetailPage;
