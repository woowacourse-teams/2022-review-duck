import { MODAL_LIST, PAGE_OPTION, FILTER } from 'constant';
import { TemplateFilterType } from 'types';

import useModal from 'common/hooks/useModal';
import { useGetTemplates } from 'service/@shared/hooks/queries/template';

import { FlexContainer } from 'common/components';

import styles from './styles.module.scss';

import Intro from './view/Intro';
import TrendTemplate from './view/TrendTemplate';

function MainPage() {
  const { showModal } = useModal();
  const handleClickReviewStart = () => {
    showModal(MODAL_LIST.REVIEW_START);
  };
  const { data, isError, isLoading } = useGetTemplates(
    FILTER.TEMPLATE_TAB.TREND as TemplateFilterType,
    String(1),
    PAGE_OPTION.TEMPLATE_TREND_ITEM_SIZE,
  );

  if (isError || isLoading) return <>{/* Error Boundary, Suspense Used */}</>;

  const { templates } = data;

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
        <TrendTemplate.TrendCardPanel templates={templates} />
      </TrendTemplate>
    </FlexContainer>
  );
}

export default MainPage;
