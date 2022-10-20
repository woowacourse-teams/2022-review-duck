import { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { faArrowTrendUp, faPenNib } from '@fortawesome/free-solid-svg-icons';

import { PAGE_LIST, FILTER, PAGE_OPTION } from 'constant';

import useSnackbar from 'common/hooks/useSnackbar';

import { isInclude } from 'service/@shared/utils';

import PageSuspense from 'common/components/PageSuspense';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import Questions from 'service/@shared/components/Questions';

import styles from './styles.module.scss';

import useReviewTimeline from './useReviewTimeline';
import Feed from './view/Feed';
import SideMenu from './view/SideMenu';
import { updateReviewLike } from 'api/review.api';
import { UserAgentContext } from 'common/contexts/UserAgent';

function ReviewTimelinePage() {
  const [searchParam] = useSearchParams();
  const { isMobile } = useContext(UserAgentContext);

  const filterQueryString = searchParam.get(FILTER.SORT);
  const currentTab = isInclude(Object.values(FILTER.TEMPLATE_TAB), filterQueryString)
    ? filterQueryString
    : FILTER.TEMPLATE_TAB.LATEST;

  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const reviewTimelineQueries = useReviewTimeline(currentTab);

  if (!reviewTimelineQueries) return <>{/* Error Boundary, Suspense Used */}</>;

  const {
    reviewMutations,
    reviews,
    reviewsLikeStack,
    reviewsOptimisticUpdater,
    infiniteScrollContainerRef,
    isAnswerFetching,
    addFetch,
  } = reviewTimelineQueries;

  const handleClickEditButton = (reviewFormCode: string, reviewId: number) => () => {
    navigate(
      `${PAGE_LIST.REVIEW}/${reviewFormCode}/${reviewId}?redirect=${encodeURIComponent(
        PAGE_LIST.TIMELINE,
      )}`,
    );
  };

  const handleClickDeleteButton = (reviewId: number) => () => {
    if (!confirm('정말 해당 회고를 삭제하시겠습니까?\n삭제된 회고는 복구할 수 없습니다.')) {
      return;
    }

    reviewMutations.removeAnswer.mutate(reviewId, {
      onSuccess: () =>
        snackbar.show({
          title: '회고가 삭제되었습니다.',
          description: '삭제된 회고는 복구할 수 없습니다.',
          theme: 'warning',
        }),

      onError: (error) =>
        snackbar.show({
          title: '회고 삭제에 실패하였습니다.',
          description: error.message,
          theme: 'danger',
        }),
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

  return PageSuspense(
    <LayoutContainer className={styles.container}>
      <SideMenu>
        {!isMobile && <SideMenu.Title>탐색하기</SideMenu.Title>}

        <SideMenu.List>
          <SideMenu.Menu
            isCurrentTab={currentTab === FILTER.TIMELINE_TAB.LATEST}
            filter={FILTER.TIMELINE_TAB.LATEST}
            icon={faPenNib}
          >
            최신글
          </SideMenu.Menu>
          <SideMenu.Menu
            isCurrentTab={currentTab === FILTER.TIMELINE_TAB.TREND}
            filter={FILTER.TIMELINE_TAB.TREND}
            icon={faArrowTrendUp}
          >
            트랜딩
          </SideMenu.Menu>
        </SideMenu.List>
      </SideMenu>

      <Feed>
        <Feed.Title>{isMobile ? '피드' : '타임라인'}</Feed.Title>

        <Feed.List ref={infiniteScrollContainerRef}>
          {reviews.map(({ id, info: { creator, ...info }, reviewFormCode, questions, likes }) => (
            <Feed.ReviewAnswer key={id}>
              <Feed.UserProfile
                socialId={creator.id}
                profileUrl={creator.profileUrl}
                nickname={creator.nickname}
                update={info.updateDate}
              />

              <Questions>
                <Questions.Title subtitle={info.reviewTitle || ''} />
                <Questions.EditButtons
                  className={styles.questionEdit}
                  isVisible={info.isSelf}
                  onClickEdit={handleClickEditButton(reviewFormCode, id)}
                  onClickDelete={handleClickDeleteButton(id)}
                />

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
    </LayoutContainer>,
  );
}

export default ReviewTimelinePage;
