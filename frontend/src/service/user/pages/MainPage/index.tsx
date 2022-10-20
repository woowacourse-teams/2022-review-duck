import { MODAL_LIST, FILTER, PAGE_LIST, PAGE_OPTION } from 'constant';

import useSnackbar from 'common/hooks/useSnackbar';
import { useGetTemplates } from 'service/@shared/hooks/queries/template';
import useNavigateHandler from 'service/@shared/hooks/useNavigateHandler';

import { getElapsedTimeText } from 'service/@shared/utils';

import { FlexContainer } from 'common/components';

import PageSuspense from 'common/components/PageSuspense';

import useModal from 'service/@shared/components/ModalProvider/useModal';
import Questions from 'service/@shared/components/Questions';
import TemplateCard from 'service/template/components/TemplateCard';

import styles from './styles.module.scss';

import Intro from './view/Intro';
import TrendTemplate from './view/TrendTemplate';
import { updateReviewLike } from 'api/review.api';
import useReviewTimeline from 'service/review/pages/ReviewTimelinePage/useReviewTimeline';
import Feed from 'service/review/pages/ReviewTimelinePage/view/Feed';

function MainPage() {
  const modal = useModal();
  const { handleLinkPage } = useNavigateHandler();
  const snackbar = useSnackbar();

  const { data, isError, isLoading } = useGetTemplates({
    filter: FILTER.TEMPLATE_TAB.TREND,
    pageNumber: 1,
  });

  const reviewTimelineQueries = useReviewTimeline(FILTER.TIMELINE_TAB.TREND);

  if (isError || isLoading || !reviewTimelineQueries)
    return <>{/* Error Boundary, Suspense Used */}</>;

  const {
    reviews,
    reviewsLikeStack,
    reviewsOptimisticUpdater,
    infiniteScrollContainerRef,
    isAnswerFetching,
    addFetch,
  } = reviewTimelineQueries;

  const { templates } = data;

  const handleClickReviewStart = () => {
    modal.show({ key: MODAL_LIST.REVIEW_START });
  };

  const handleClickLikeButton = (reviewId: number, likes: number) => () => {
    if (!reviewsLikeStack.current[reviewId]) {
      reviewsLikeStack.current[reviewId] = 0;
    }

    const reviewLikeStack = (reviewsLikeStack.current[reviewId] += 1);

    addFetch(reviewId, () => updateReviewLike({ reviewId, likes: reviewLikeStack }), {
      onUpdate: () => reviewsOptimisticUpdater.basedOnKey('id', reviewId, { likes: likes + 1 }),
      onError: (error) => {
        reviewsOptimisticUpdater.rollback();
        snackbar.show({
          theme: 'danger',
          title: '회고 좋아요에 실패하였습니다.',
          description: error.message,
        });
      },
      onSuccess: ({ likes: latestLikes }) => {
        reviewsOptimisticUpdater.basedOnKey('id', reviewId, { likes: latestLikes });
        delete reviewsLikeStack.current[reviewId];
      },
    });
  };

  return PageSuspense(
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

      <FlexContainer className={styles.mainTimelineContainer}>
        <Feed>
          <Feed.Title>인기 회고</Feed.Title>

          <Feed.List ref={infiniteScrollContainerRef}>
            {reviews.map(({ id, info: { creator, ...info }, questions, likes }) => (
              <Feed.ReviewAnswer key={id}>
                <Feed.UserProfile
                  socialId={creator.id}
                  profileUrl={creator.profileUrl}
                  nickname={creator.nickname}
                  update={info.updateDate}
                />

                <Questions>
                  <Questions.Title subtitle={info.reviewTitle || ''} />
                  {questions.map(({ answer, ...question }) => (
                    <Questions.Answer
                      key={question.id}
                      question={question.value}
                      description={question.description}
                    >
                      {answer.value}
                    </Questions.Answer>
                  ))}

                  <Questions.Reaction
                    likeCount={likes}
                    onClickLike={handleClickLikeButton(id, likes)}
                    onClickBookmark={() => null}
                  />
                </Questions>
              </Feed.ReviewAnswer>
            ))}

            {isAnswerFetching && <Feed.Loading line={PAGE_OPTION.REVIEW_ITEM_SIZE} />}
          </Feed.List>
        </Feed>
      </FlexContainer>
    </FlexContainer>,
  );
}

export default MainPage;
