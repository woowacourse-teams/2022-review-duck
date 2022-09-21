import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { faArrowTrendUp, faHeart, faPenNib } from '@fortawesome/free-solid-svg-icons';

import { PAGE_LIST, PAGE_OPTION, QUERY_KEY } from 'constant';
import { ReviewPublicAnswer, ReviewPublicAnswerList } from 'types';

import useSnackbar from 'common/hooks/useSnackbar';
import useStackFetch from 'common/hooks/useStackFetch';
import {
  useDeleteReviewAnswer,
  useGetInfiniteReviewPublicAnswer,
} from 'service/@shared/hooks/queries/review';

import LayoutContainer from 'service/@shared/components/LayoutContainer';
import Questions from 'service/@shared/components/Questions';

import styles from './styles.module.scss';

import useIntersectionObserver from './useIntersectionObserver';
import Feed from './views/Feed';
import SideMenu from './views/SideMenu';
import queryClient from 'api/config/queryClient';
import { updateReviewLike } from 'api/review.api';

type ReviewId = ReviewPublicAnswer['id'];

function ReviewTimelinePage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { mutate: reviewAnswerDelete } = useDeleteReviewAnswer();
  const { addFetch } = useStackFetch(2000);

  const {
    data: reviews,
    isLoading,
    isError,
    fetchNextPage,
    isFetching,
  } = useGetInfiniteReviewPublicAnswer();

  const reviewsLikeStack = useRef<Record<ReviewId, number>>({});

  const { targetRef } = useIntersectionObserver<ReviewPublicAnswerList, HTMLDivElement>(
    fetchNextPage,
    { threshold: 0.75 },
    reviews,
  );

  if (isError || isLoading) return <>{/* Error Boundary, Suspense Used */}</>;

  const { pages } = reviews;

  const setUpdateLikeCount = (reviewId: number, count: number) => {
    queryClient.setQueryData<ReviewPublicAnswerList>(
      [QUERY_KEY.DATA.REVIEW, QUERY_KEY.API.GET_REVIEW_PUBLIC_ANSWER],
      (previousData) => {
        if (!previousData) return previousData;

        const updatedReviews = previousData.reviews.map((review) => {
          if (review.id !== reviewId) return review;

          return { ...review, likes: count };
        });

        return { ...previousData, reviews: updatedReviews };
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

    reviewAnswerDelete(reviewId, {
      onSuccess: () =>
        showSnackbar({
          title: '회고가 삭제되었습니다.',
          description: '삭제된 회고는 복구할 수 없습니다.',
          theme: 'warning',
        }),

      onError: (error) =>
        showSnackbar({
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
      onUpdate: () => setUpdateLikeCount(reviewId, likes + 1),
      onError: () => setUpdateLikeCount(reviewId, likes - reviewLikeStack),
      onSuccess: ({ likes: latestLikes }) => {
        setUpdateLikeCount(reviewId, latestLikes);
        delete reviewsLikeStack.current[reviewId];
      },
    });
  };

  return (
    <LayoutContainer className={styles.container}>
      <SideMenu>
        <SideMenu.Title>탐색하기</SideMenu.Title>

        <SideMenu.List>
          <SideMenu.Menu icon={faArrowTrendUp}>트랜딩</SideMenu.Menu>
          <SideMenu.Menu icon={faPenNib}>최신글</SideMenu.Menu>
          <SideMenu.Menu icon={faHeart}>구독</SideMenu.Menu>
        </SideMenu.List>

        <SideMenu.Title>나의 구독</SideMenu.Title>
      </SideMenu>

      <Feed>
        <Feed.Title>타임라인</Feed.Title>

        <Feed.List>
          {pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.reviews.map(
                ({ id, reviewFormCode, questions, info: { creator, ...info }, likes }, index) => (
                  <Feed.ReviewAnswer
                    isLoading={isFetching}
                    key={id}
                    ref={index === PAGE_OPTION.REVIEW_ITEM_SIZE - 1 ? targetRef : null}
                  >
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
                        onClickLike={handleClickLikeButton(id, likes)}
                        onClickBookmark={() => null}
                      />
                    </Questions>
                  </Feed.ReviewAnswer>
                ),
              )}
            </React.Fragment>
          ))}
        </Feed.List>
      </Feed>
    </LayoutContainer>
  );
}

export default ReviewTimelinePage;
