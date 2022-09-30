import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

import { PAGE_LIST, FILTER } from 'constant';

import useSnackbar from 'common/hooks/useSnackbar';

import { isInclude } from 'service/@shared/utils';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import Questions from 'service/@shared/components/Questions';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import useTemplateDetailQueries from './useTemplateDetailQueries';
import Content from './view/Content';
import Header from './view/Header';
import Trending from './view/Trending';

function TemplateDetailPage() {
  const [searchParam] = useSearchParams();
  const { templateId } = useParams();

  const filterQueryString = searchParam.get('filter');
  const currentTab = isInclude(Object.values(FILTER.TEMPLATE_TAB), filterQueryString)
    ? filterQueryString
    : FILTER.TEMPLATE_TAB.LATEST;

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const queries = useTemplateDetailQueries(Number(templateId));

  if (!queries) return <>{/* Suspense, Error Boundary Used */}</>;

  const { template, trendingTemplates, deleteMutation, createFormMutation } = queries;
  const creator = template.creator;

  const handleTemplateView = (id: number) => () => {
    navigate(`${PAGE_LIST.TEMPLATE_DETAIL}/${id}?filter=${currentTab}`);
  };

  const handleCreateReview = () => {
    navigate(`${PAGE_LIST.TEMPLATE_FORM}?templateId=${template.id}`);
  };

  const handleCreateTemplate = () => {
    navigate(PAGE_LIST.TEMPLATE_FORM);
  };

  const handleTemplateList = () => {
    navigate(`${PAGE_LIST.TEMPLATE_LIST}?filter=${currentTab}`);
  };

  const handleStartReview = () => {
    if (!confirm('이 템플릿으로 회고를 시작하시겠습니까\n계속 진행하면 회고 질문지가 생성됩니다.'))
      return;

    createFormMutation.mutate(Number(templateId), {
      onSuccess: ({ reviewFormCode }) => {
        showSnackbar({
          title: '템플릿을 이용해 회고를 생성했습니다.',
          description: '답변을 바로 작성하고 팀원과 공유할 수 있습니다.',
        });

        navigate(`${PAGE_LIST.REVIEW}/${reviewFormCode}`, {
          replace: true,
        });
      },
      onError: ({ message }) => {
        showSnackbar({ theme: 'danger', title: '오류가 발생하였습니다.', description: message });
      },
    });
  };

  const handleEditTemplate = () => {
    navigate(`${PAGE_LIST.TEMPLATE_FORM}?templateId=${template.id}`);
  };

  const handleDeleteTemplate = () => {
    if (!confirm('정말 템플릿을 삭제하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) return;

    deleteMutation.mutate(template.id, {
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
  };

  return (
    <>
      <LayoutContainer>
        <Header>
          <Header.Title
            usedCount={template.usedCount}
            nickname={creator.nickname}
            elapsedTime={template.elapsedTime}
          >
            {template.title}
          </Header.Title>

          <Header.Buttons
            editable={template.isEditable}
            onClickCreateReviewForm={handleCreateReview}
            onClickStartReview={handleStartReview}
            onClickEdit={handleEditTemplate}
            onClickDelete={handleDeleteTemplate}
          />
        </Header>

        <Content>
          <Content.Detail description={template.description}>
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
          </Content.Detail>

          <Content.MoreButtons
            onClickCreateTemplate={handleCreateTemplate}
            onClickList={handleTemplateList}
          />
        </Content>
      </LayoutContainer>

      <Trending>
        <Trending.ProfileCard
          snsKey={creator.snsKey}
          profileImage={creator.profileImage}
          nickname={creator.nickname}
          description={creator.snsName}
        />

        <Trending.ListTextCard icon={faArrowTrendUp} description="지금 주목 받고 있는 템플릿은?">
          인기 템플릿
        </Trending.ListTextCard>

        {trendingTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            className={styles.templateCard}
            onClick={handleTemplateView(template.id)}
          >
            <TemplateCard.Tag usedCount={template.usedCount} />
            <TemplateCard.Title>{template.title}</TemplateCard.Title>
            <TemplateCard.UpdatedAt>{template.elapsedTime}</TemplateCard.UpdatedAt>
            <TemplateCard.Description>{template.description}</TemplateCard.Description>

            <TemplateCard.Profile
              profileUrl={template.creator.profileImage}
              nickname={template.creator.nickname}
              socialNickname={template.creator.snsName}
            />
          </TemplateCard>
        ))}
      </Trending>
    </>
  );
}

export default TemplateDetailPage;
