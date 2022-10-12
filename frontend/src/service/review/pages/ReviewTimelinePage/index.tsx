import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { faArrowTrendUp, faPenNib } from '@fortawesome/free-solid-svg-icons';
import { InfiniteData } from '@tanstack/react-query';

import { PAGE_LIST, QUERY_KEY, FILTER, PAGE_OPTION } from 'constant';
import { InfiniteItem, ReviewPublicAnswer, ReviewPublicAnswerList } from 'types';

import useSnackbar from 'common/hooks/useSnackbar';
import useStackFetch from 'common/hooks/useStackFetch';

import { isInclude } from 'service/@shared/utils';

import PageSuspense from 'common/components/PageSuspense';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import Questions from 'service/@shared/components/Questions';

import styles from './styles.module.scss';

import useReviewTimeline from './useReviewTimeline';
import Feed from './view/Feed';
import SideMenu from './view/SideMenu';
import queryClient from 'api/config/queryClient';
import { updateReviewLike } from 'api/review.api';

type ReviewId = ReviewPublicAnswer['id'];

function ReviewTimelinePage() {
  const reviewsLikeStack = useRef<Record<ReviewId, number>>({});
  const { addFetch } = useStackFetch(2000);
  const [searchParam] = useSearchParams();

  const filterQueryString = searchParam.get('sort');
  const currentTab = isInclude(Object.values(FILTER.TEMPLATE_TAB), filterQueryString)
    ? filterQueryString
    : FILTER.TEMPLATE_TAB.LATEST;

  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const reviewTimelineQueries = useReviewTimeline(currentTab);

  if (!reviewTimelineQueries) return <>{/* Error Boundary, Suspense Used */}</>;

  const { publicAnswerScrollQuery, reviewMutations, reviewsPageList, infiniteScrollContainerRef } =
    reviewTimelineQueries;

  const setUpdateLikeCount = (pageIndex: number, reviewId: number, count: number) => {
    queryClient.setQueryData<InfiniteData<InfiniteItem<ReviewPublicAnswerList>>>(
      [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEW_PUBLIC_ANSWER, { filter: currentTab }],
      (previousData) => {
        if (!previousData) return previousData;

        const updatedReviews = previousData.pages[pageIndex].data.reviews.map((review) => {
          if (review.id !== reviewId) return review;

          return { ...review, likes: count };
        });

        const newPages = [...previousData.pages];
        const newPage = { ...previousData.pages[pageIndex] };
        const newData = { ...newPage.data };

        newData.reviews = updatedReviews;
        newPage.data = newData;
        newPages[pageIndex] = newPage;

        return { pages: newPages, pageParams: previousData.pageParams };
      },
    );
  };

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

  const handleClickLikeButton = (pageIndex: number, reviewId: number, likes: number) => () => {
    if (!reviewsLikeStack.current[reviewId]) {
      reviewsLikeStack.current[reviewId] = 0;
    }

    const reviewLikeStack = (reviewsLikeStack.current[reviewId] += 1);

    addFetch(reviewId, () => updateReviewLike({ reviewId, likes: reviewLikeStack }), {
      onUpdate: () => setUpdateLikeCount(pageIndex, reviewId, likes + 1),
      onError: (error) => {
        const originCount = likes - (reviewLikeStack - 1);
        setUpdateLikeCount(pageIndex, reviewId, originCount);
        snackbar.show({
          theme: 'danger',
          title: '회고 좋아요에 실패하였습니다.',
          description: error.message,
        });

        delete reviewsLikeStack.current[reviewId];
      },
      onSuccess: ({ likes: latestLikes }) => {
        setUpdateLikeCount(pageIndex, reviewId, latestLikes);
        delete reviewsLikeStack.current[reviewId];
      },
    });
  };

  return PageSuspense(
    <LayoutContainer className={styles.container}>
      <SideMenu>
        <SideMenu.Title>탐색하기</SideMenu.Title>

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
        <Feed.Title>타임라인</Feed.Title>

        <Feed.List ref={infiniteScrollContainerRef}>
          {reviewsPageList.map(({ reviews }) =>
            reviews.map(({ id, info: { creator, ...info }, reviewFormCode, questions, likes }) => (
              <Feed.ReviewAnswer key={id}>
                <Feed.UserProfile
                  socialId={creator.id}
                  profileUrl={creator.profileUrl}
                  nickname={creator.nickname}
                  update={info.updateDate}
                />

                <Questions>
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
                    onClickLike={() => null}
                    onClickBookmark={() => null}
                  />
                </Questions>
              </Feed.ReviewAnswer>
            )),
          )}

          {publicAnswerScrollQuery.isFetching && (
            <Feed.Loading line={PAGE_OPTION.REVIEW_ITEM_SIZE} />
          )}
        </Feed.List>
      </Feed>
    </LayoutContainer>,
  );
}

export default ReviewTimelinePage;
