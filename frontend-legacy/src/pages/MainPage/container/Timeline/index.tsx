import { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { faArrowTrendUp, faPenNib } from '@fortawesome/free-solid-svg-icons';

import { updateReviewLike } from 'api/review.api';
import { UserAgentContext } from 'common/contexts/UserAgent';
import LayoutContainer from 'components/LayoutContainer';
import Questions from 'components/Questions';

import useSnackbar from 'common/hooks/useSnackbar';

import useReviewTimeline from 'pages/ReviewTimelinePage/useReviewTimeline';
import Feed from 'pages/ReviewTimelinePage/view/Feed';
import SideMenu from 'pages/ReviewTimelinePage/view/SideMenu';

import { FILTER, PAGE_LIST, PAGE_OPTION } from 'constant';
import { isInclude } from 'utils';

import styles from './styles.module.scss';

const Timeline = () => {
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

  return (
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
                    {answer?.value}
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
    </LayoutContainer>
  );
};

export default Timeline;
