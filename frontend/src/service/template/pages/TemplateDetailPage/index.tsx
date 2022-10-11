import { useParams, useSearchParams } from 'react-router-dom';

import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

import { PAGE_LIST, FILTER } from 'constant';

import useSnackbar from 'common/hooks/useSnackbar';
import { useTemplateMutation } from 'service/@shared/hooks/queries/template';
import useNavigateHandler from 'service/@shared/hooks/useNavigateHandler';

import { getElapsedTimeText, isInclude } from 'service/@shared/utils';

import PageSuspense from 'common/components/PageSuspense';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import Questions from 'service/@shared/components/Questions';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import useTemplateDetailQueries from './useTemplateDetailQueries';
import Content from './view/Content';
import Header from './view/Header';
import Trending from './view/Trending';

function TemplateDetailPage() {
  const { navigate, handleLinkPage } = useNavigateHandler();
  const { templateId } = useParams();

  const [searchParam] = useSearchParams();
  const templateMutation = useTemplateMutation();

  const filterQueryString = searchParam.get('sort');
  const currentTab = isInclude(Object.values(FILTER.TEMPLATE_TAB), filterQueryString)
    ? filterQueryString
    : FILTER.TEMPLATE_TAB.LATEST;

  const snackbar = useSnackbar();

  const queries = useTemplateDetailQueries(Number(templateId));

  if (!queries) return <>{/* Suspense, Error Boundary Used */}</>;

  const { trendingTemplates } = queries;
  const { info: templateInfo, creator: templateCreator, ...template } = queries.template;

  const handleTemplateView = (id: number) => () => {
    navigate(`${PAGE_LIST.TEMPLATE_DETAIL}/${id}?sort=${currentTab}`);
  };

  const handleStartReview = () => {
    if (!confirm('이 템플릿으로 회고를 시작하시겠습니까\n계속 진행하면 회고 질문지가 생성됩니다.'))
      return;

    templateMutation.createForm(Number(templateId), {
      onSuccess: ({ reviewFormCode }) => {
        snackbar.show({
          title: '템플릿을 이용해 회고를 생성했습니다.',
          description: '답변을 바로 작성하고 팀원과 공유할 수 있습니다.',
        });

        navigate(`${PAGE_LIST.REVIEW}/${reviewFormCode}`, {
          replace: true,
        });
      },
      onError: ({ message }) => {
        snackbar.show({
          theme: 'danger',
          title: '회고 생성에 실패하였습니다.',
          description: message,
        });
      },
    });
  };

  const handleDeleteTemplate = () => {
    if (!confirm('정말 템플릿을 삭제하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) return;

    templateMutation.remove(templateInfo.id, {
      onSuccess: () => {
        snackbar.show({
          title: '템플릿이 삭제되었습니다.',
          description: '사람들과 공유할 새로운 템플릿을 만들어보세요.',
        });
        navigate(-1);
      },
      onError: ({ message }) => {
        snackbar.show({
          theme: 'danger',
          title: '템플릿 삭제에 실패하였습니다.',
          description: message,
        });
      },
    });
  };

  return PageSuspense(
    <>
      <LayoutContainer>
        <Header>
          <Header.Title
            usedCount={templateInfo.usedCount}
            nickname={templateCreator.nickname}
            elapsedTime={getElapsedTimeText(templateInfo.updatedAt)}
          >
            {templateInfo.title}
          </Header.Title>

          <Header.Buttons
            editable={template.isCreator}
            onClickCreateReviewForm={handleLinkPage(
              `${PAGE_LIST.TEMPLATE_FORM}?templateId=${templateInfo.id}`,
            )}
            onClickStartReview={handleStartReview}
            onClickEdit={handleLinkPage(`${PAGE_LIST.TEMPLATE_FORM}/${templateInfo.id}`)}
            onClickDelete={handleDeleteTemplate}
          />
        </Header>

        <Content>
          <Content.Detail description={templateInfo.description}>
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
            onClickCreateTemplate={handleLinkPage(PAGE_LIST.TEMPLATE_FORM)}
            onClickList={handleLinkPage(`${PAGE_LIST.TEMPLATE_LIST}?sort=${currentTab}`)}
          />
        </Content>
      </LayoutContainer>

      <Trending>
        <Trending.ProfileCard
          snsKey={templateCreator.id}
          profileImage={templateCreator.profileUrl}
          nickname={templateCreator.nickname}
          description={templateCreator.socialNickname}
        />

        <Trending.ListTextCard icon={faArrowTrendUp} description="지금 주목 받고 있는 템플릿은?">
          인기 템플릿
        </Trending.ListTextCard>

        {trendingTemplates.map(({ info, creator }) => (
          <TemplateCard
            key={info.id}
            className={styles.templateCard}
            onClick={handleTemplateView(info.id)}
          >
            <TemplateCard.Tag usedCount={info.usedCount} />
            <TemplateCard.Title>{info.title}</TemplateCard.Title>
            <TemplateCard.UpdatedAt>{getElapsedTimeText(info.updatedAt)}</TemplateCard.UpdatedAt>
            <TemplateCard.Description>{info.description}</TemplateCard.Description>

            <TemplateCard.Profile
              profileUrl={creator.profileUrl}
              nickname={creator.nickname}
              socialNickname={creator.socialNickname}
            />
          </TemplateCard>
        ))}
      </Trending>
    </>,
  );
}

export default TemplateDetailPage;
