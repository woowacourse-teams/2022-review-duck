import { useNavigate, useParams } from 'react-router-dom';

import { FILTER, PAGE_LIST, PAGE_OPTION } from 'constant';

import useSnackbar from 'common/hooks/useSnackbar';

import { isInclude } from 'service/@shared/utils';

import { FlexContainer, Skeleton } from 'common/components';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import Profile from 'service/@shared/components/Profile';
import Questions from 'service/@shared/components/Questions';

import styles from './styles.module.scss';

import useReviewOverviewPage from './useReviewOverviewPage';
import { Header } from './view/Header';
import { ListView } from './view/ListView';
import { SheetView } from './view/SheetView';
import { updateReviewLike } from 'api/review.api';

/*
  TODO:
  - 페이지 비즈니스 로직 & API 통신 처리 커스텀훅 분리
  - ListView => ReviewList, SideMenu로 나누기
  - 시트뷰 / 리스트뷰 출력 방식 조금 더 보기 좋게 구조 개선
*/

function ReviewOverViewPage() {
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const { reviewFormCode = '', displayMode: displayModeParams = '' } = useParams();
  const displayMode = isInclude(
    [FILTER.DISPLAY_MODE.LIST, FILTER.DISPLAY_MODE.SHEET],
    displayModeParams,
  )
    ? displayModeParams
    : FILTER.DISPLAY_MODE.LIST;

  const pageQueries = useReviewOverviewPage(reviewFormCode, displayMode);

  if (!pageQueries) return <>{/* Error Boundary, Suspense Used */}</>;

  const {
    infiniteScrollContainerRef,
    reviewsLikeStack,
    reviewMutations,
    reviews,
    reviewForm,
    reviewsOptimisticUpdater,
    isReviewsFetching,
    isFormLoading,
    addFetch,
  } = pageQueries;

  const handleEditAnswer = (reviewId: number) => () => {
    navigate(`${PAGE_LIST.REVIEW}/${reviewFormCode}/${reviewId}`);
  };

  const handleDeleteAnswer = (reviewId: number) => () => {
    if (!confirm('정말 해당 회고를 삭제하시겠습니까?')) return;

    reviewMutations.removeAnswer.mutate(reviewId, {
      onSuccess: () => {
        snackbar.show({
          title: '작성한 회고가 삭제되었습니다.',
          description: '더 이상 조회할 수 없으며, 삭제된 정보는 복구할 수 없습니다.',
          theme: 'danger',
        });
      },
    });
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

  return (
    <div className={styles.layout}>
      <Header>
        <Header.FormInformation isLoading={isFormLoading} fallback={<Skeleton />}>
          <Header.Title>{reviewForm?.title}</Header.Title>
          <Header.Description>크리에이터 : {reviewForm?.info.creator.nickname}</Header.Description>
        </Header.FormInformation>

        <Header.ViewChangeButtons displayMode={displayMode} reviewFormCode={reviewFormCode} />
      </Header>

      <LayoutContainer>
        {displayMode === FILTER.DISPLAY_MODE.LIST ? (
          <ListView>
            <ListView.Content
              ref={infiniteScrollContainerRef}
              isLoading={isFormLoading}
              fallback={<Skeleton line={4} />}
            >
              <ListView.ParticipantList>
                {reviewForm?.participants?.map((user) => (
                  <Profile
                    key={user.id}
                    className={styles.profile}
                    socialId={user.id}
                    textAlign="center"
                    align="center"
                  >
                    <Profile.Image size="large" edge="pointed" src={user.profileUrl} />
                    <Profile.Nickname size={14}>{user.nickname}</Profile.Nickname>
                    <Profile.Description size={12}></Profile.Description>
                  </Profile>
                ))}
              </ListView.ParticipantList>

              {reviews.map(({ id, info, questions, likes }) => (
                <ListView.Review key={id}>
                  <Questions>
                    <Questions.CoverProfile
                      socialId={info.creator.id}
                      image={info.creator.profileUrl}
                      title={info.reviewTitle as string}
                      description={info.updateDate}
                    />

                    <Questions.EditButtons
                      isVisible={info.isSelf}
                      onClickEdit={handleEditAnswer(id)}
                      onClickDelete={handleDeleteAnswer(id)}
                    ></Questions.EditButtons>

                    {questions.map(({ description, answer, ...question }, index) => (
                      <Questions.Answer
                        key={question.id}
                        question={`${index + 1}. ${question.value}`}
                        description={description}
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
                </ListView.Review>
              ))}
              {isReviewsFetching && <ListView.Loading line={PAGE_OPTION.REVIEW_ITEM_SIZE} />}
            </ListView.Content>
            <ListView.SideMenu isLoading={isFormLoading} fallback={<Skeleton line={3} />}>
              <ListView.FormDetail
                reviewFormCode={reviewFormCode}
                editable={reviewForm?.info.isSelf}
              >
                <FlexContainer className={styles.formInfo} gap="small">
                  <ListView.InfoText name="크리에이터">
                    {reviewForm?.info.creator.nickname}
                  </ListView.InfoText>
                  <ListView.InfoText name="회고 참여자">
                    총 {reviewForm?.participants?.length}명이 참여함
                  </ListView.InfoText>
                  <ListView.InfoText name="업데이트">
                    {reviewForm?.info.updateDate}
                  </ListView.InfoText>
                </FlexContainer>

                <ListView.JoinButton reviewFormCode={reviewFormCode} />

                <ListView.FormCopyLink reviewFormCode={reviewFormCode} />
              </ListView.FormDetail>
            </ListView.SideMenu>
          </ListView>
        ) : (
          <SheetView>
            <SheetView.Questions>
              {reviewForm?.questions.map((question) => (
                <SheetView.Item key={question.id} isTitle>
                  {question.value}
                </SheetView.Item>
              ))}
            </SheetView.Questions>

            <SheetView.ReviewList ref={infiniteScrollContainerRef}>
              {reviews.map(({ id, info: { creator, reviewTitle }, questions }) => (
                <SheetView.Answers key={id}>
                  <SheetView.Creator
                    socialId={creator.id}
                    title={reviewTitle as string}
                    profileImage={creator.profileUrl}
                  />

                  {questions.map(({ answer, ...review }) => (
                    <SheetView.Item key={review.id}>{answer && answer.value}</SheetView.Item>
                  ))}
                </SheetView.Answers>
              ))}
              {isReviewsFetching && <SheetView.Loading line={PAGE_OPTION.REVIEW_ITEM_SIZE} />}
            </SheetView.ReviewList>
          </SheetView>
        )}
      </LayoutContainer>
    </div>
  );
}

export default ReviewOverViewPage;
