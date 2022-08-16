import { useParams } from 'react-router-dom';

import { useGetReviewForm, useGetReviewFormAnswer } from 'service/@shared/hooks/queries/review';

import { FlexContainer, Skeleton } from 'common/components';

import Profile from 'service/review/components/Profile';

import styles from './styles.module.scss';

import { Header } from './views/Header';
import { ListView } from './views/ListView';

const REVIEW_OVERVIEW_MODE = {
  LIST_VIEW: true,
  SHEET_VIEW: false,
};

function ReviewOverViewPage() {
  const { reviewFormCode = '' } = useParams();

  const reviewFormAnswerQuery = useGetReviewFormAnswer(
    { reviewFormCode },
    {
      suspense: false,
    },
  );

  const reviewFormQuery = useGetReviewForm(reviewFormCode, {
    suspense: false,
  });

  const reviewForm = reviewFormQuery.data;
  const reviewAnswers = reviewFormAnswerQuery.data;

  const isContentLoaded = reviewFormQuery.isLoading && reviewFormAnswerQuery.isLoading;

  const isViewMode = REVIEW_OVERVIEW_MODE.LIST_VIEW;

  return (
    <div className={styles.layout}>
      <Header>
        <Header.FormInformation isLoading={isContentLoaded} fallback={<Skeleton />}>
          <Header.Title>{reviewForm?.title}</Header.Title>
          <Header.Description>{reviewForm?.info.creator.nickname}</Header.Description>
        </Header.FormInformation>

        <Header.ViewChangeButtons viewMode={isViewMode} />
      </Header>

      <ListView>
        <ListView.Content isLoading={isContentLoaded} fallback={<Skeleton line={4} />}>
          <ListView.ParticipantList>
            {reviewAnswers?.map(({ id, info: { creator } }) => (
              <Profile key={id} image={creator.profileUrl} title={creator.nickname} />
            ))}
          </ListView.ParticipantList>

          {[1, 2, 3].map((value) => (
            <ListView.Review key={value} />
          ))}
        </ListView.Content>

        <ListView.SideMenu isLoading={isContentLoaded} fallback={<Skeleton line={3} />}>
          <ListView.FormDetail>
            <FlexContainer gap="small">
              <ListView.InfoText name="크리에이터">닉네임</ListView.InfoText>
              <ListView.InfoText name="회고 참여자">총 명이 참여함</ListView.InfoText>
              <ListView.InfoText name="업데이트">0일 전</ListView.InfoText>
            </FlexContainer>

            <ListView.JoinButton reviewFormCode={reviewFormCode} />

            <ListView.FormCopyLink reviewFormCode={reviewFormCode} />

            <ListView.FormManageButtons reviewFormCode={reviewFormCode} />
          </ListView.FormDetail>
        </ListView.SideMenu>
      </ListView>
    </div>
  );
}

export default ReviewOverViewPage;
