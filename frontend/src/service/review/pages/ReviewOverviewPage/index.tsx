import { useParams } from 'react-router-dom';

import { useGetReviewForm, useGetReviewFormAnswer } from 'service/@shared/hooks/queries/review';

import { FlexContainer, Skeleton } from 'common/components';

import Questions from 'service/@shared/components/Questions';
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

          {reviewAnswers?.map((answerContent) => {
            const { id, info, questions } = answerContent;
            const { creator } = info;

            return (
              <ListView.Review key={id}>
                <Questions>
                  <Questions.CoverProfile
                    image={creator.profileUrl}
                    title={creator.nickname}
                    description={info.updateDate}
                  />

                  <Questions.EditButtons
                    isVisible={info.isSelf}
                    onClickEdit={() => null}
                    onClickDelete={() => null}
                  ></Questions.EditButtons>

                  {questions.map((question, index) => {
                    const questionText = `${index + 1}. ${question.value}`;
                    const { answer } = question;

                    return (
                      <Questions.Answer
                        key={question.id}
                        question={questionText}
                        description={question.description}
                      >
                        {answer.value}
                      </Questions.Answer>
                    );
                  })}

                  <Questions.Reaction onClickLike={() => null} onClickBookmark={() => null} />
                </Questions>
              </ListView.Review>
            );
          })}
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
