import { MODAL_LIST, FILTER, PAGE_LIST, PAGE_OPTION } from 'constant';
import { ReviewTimelinePage } from 'routes';

import { useGetTemplates } from 'service/hooks/queries/template';
import useNavigateHandler from 'service/hooks/useNavigateHandler';

import { getElapsedTimeText } from 'service/@shared/utils';

import { FlexContainer } from 'common/components';

import PageSuspense from 'common/components/PageSuspense';

import styles from './styles.module.scss';

import Intro from './view/Intro';
import TrendTemplate from './view/TrendTemplate';
import useModal from 'service/components/ModalProvider/useModal';
import TemplateCard from 'service/components/TemplateCard';

function MainPage() {
  const modal = useModal();
  const { handleLinkPage } = useNavigateHandler();

  const { data, isError, isLoading } = useGetTemplates({
    filter: FILTER.TEMPLATE_TAB.TREND,
    pageNumber: 1,
  });

  if (isError || isLoading) return <>{/* Error Boundary, Suspense Used */}</>;

  const { templates } = data;

  const handleClickReviewStart = () => {
    modal.show({ key: MODAL_LIST.REVIEW_START });
  };

  return PageSuspense(
    <>
      <FlexContainer className={styles.mainPageContainer}>
        <Intro>
          <Intro.Title>
            <span>
              <b>회고덕</b>으로
            </span>
            <span>함께 회고를</span>
            <span>시작해보세요</span>
          </Intro.Title>
          <Intro.SubTitle>함께 성장하는 회고 플랫폼</Intro.SubTitle>
          <Intro.ReviewButton onClick={handleClickReviewStart}>회고 시작하기</Intro.ReviewButton>
        </Intro>

        <TrendTemplate>
          <TrendTemplate.Title>인기 템플릿</TrendTemplate.Title>
          <TrendTemplate.Content>
            {templates.map(({ info, creator }) => (
              <TemplateCard
                key={info.id}
                className={styles.mainCard}
                onClick={handleLinkPage(`${PAGE_LIST.TEMPLATE_DETAIL}/${info.id}`)}
              >
                <TemplateCard.Tag usedCount={info.usedCount} />
                <TemplateCard.Title>{info.title}</TemplateCard.Title>
                <TemplateCard.UpdatedAt>
                  {getElapsedTimeText(info.updatedAt)}
                </TemplateCard.UpdatedAt>
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
      </FlexContainer>

      <ReviewTimelinePage />
    </>,
  );
}

export default MainPage;
