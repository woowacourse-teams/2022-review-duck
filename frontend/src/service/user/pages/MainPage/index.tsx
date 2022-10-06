import { useNavigate } from 'react-router-dom';

import { MODAL_LIST, FILTER, PAGE_LIST } from 'constant';

import useModal from 'common/hooks/useModal';
import { useGetTemplates } from 'service/@shared/hooks/queries/template';

import { getElapsedTimeText } from 'service/@shared/utils';

import { FlexContainer } from 'common/components';

import PageSuspense from 'common/components/PageSuspense';

import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import Intro from './view/Intro';
import TrendTemplate from './view/TrendTemplate';

function MainPage() {
  const { showModal } = useModal();
  const navigate = useNavigate();

  const { data, isError, isLoading } = useGetTemplates({
    filter: FILTER.TEMPLATE_TAB.TREND,
    pageNumber: 1,
  });

  if (isError || isLoading) return <>{/* Error Boundary, Suspense Used */}</>;

  const { templates } = data;

  const handleClickReviewStart = () => {
    showModal(MODAL_LIST.REVIEW_START);
  };

  const handleClickTemplateCard = (templateId: number) => () => {
    navigate(`${PAGE_LIST.TEMPLATE_DETAIL}/${templateId}`);
  };

  return PageSuspense(
    <FlexContainer className={styles.mainPageContainer}>
      <Intro>
        <div className={styles.leftContainer}>
          <Intro.Title>
            <span className={styles.bold}>회고덕</span>으로 함께 회고를 시작해보세요
          </Intro.Title>
          <Intro.SubTitle>함께 성장하는 회고 플랫폼</Intro.SubTitle>
          <Intro.ReviewButton onClick={handleClickReviewStart}>회고 시작하기</Intro.ReviewButton>
        </div>

        <Intro.HeroCards />
      </Intro>

      <TrendTemplate>
        <TrendTemplate.Title>인기 템플릿</TrendTemplate.Title>
        <TrendTemplate.Content>
          {templates.map(({ info, creator }) => (
            <TemplateCard
              key={info.id}
              className={styles.mainCard}
              onClick={handleClickTemplateCard(info.id)}
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
        </TrendTemplate.Content>
      </TrendTemplate>
    </FlexContainer>,
  );
}

export default MainPage;
