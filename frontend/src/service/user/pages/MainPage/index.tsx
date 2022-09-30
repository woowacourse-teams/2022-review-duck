import { useNavigate } from 'react-router-dom';

import { MODAL_LIST, PAGE_OPTION, FILTER, PAGE_LIST } from 'constant';
import { TemplateFilterType } from 'types';

import useModal from 'common/hooks/useModal';
import { useGetTemplates } from 'service/@shared/hooks/queries/template';

import { FlexContainer } from 'common/components';

import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import { Intro } from './view/Intro';
import TrendTemplate from './view/TrendTemplate';

function MainPage() {
  const { showModal } = useModal();
  const navigate = useNavigate();

  const { data, isError, isLoading } = useGetTemplates(
    FILTER.TEMPLATE_TAB.TREND as TemplateFilterType,
    String(1),
    PAGE_OPTION.TEMPLATE_TREND_ITEM_SIZE,
  );

  if (isError || isLoading) return <>{/* Error Boundary, Suspense Used */}</>;

  const { templates } = data;

  const handleClickReviewStart = () => {
    showModal(MODAL_LIST.REVIEW_START);
  };

  const handleClickTemplateCard = (templateId: number) => () => {
    navigate(`${PAGE_LIST.TEMPLATE_DETAIL}/${templateId}`);
  };

  return (
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
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              className={styles.mainCard}
              onClick={handleClickTemplateCard(template.id)}
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
        </TrendTemplate.Content>
      </TrendTemplate>
    </FlexContainer>
  );
}

export default MainPage;
