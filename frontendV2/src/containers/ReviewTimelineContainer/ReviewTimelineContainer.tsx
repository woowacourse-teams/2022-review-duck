import { styled } from '@linaria/react';
import useReviewMutations from 'apis/mutations/review';
import { useGetInfiniteReviewPublicAnswer } from 'apis/queries';
import { RequestGetPublicReviewList, fetchPostUpdateReviewLike } from 'apis/review';
import { isAxiosError } from 'axios';
import { FlexContainer, Intersection } from 'common/components';
import useOptimisticUpdate from 'common/hooks/useOptimisticUpdate';
import useSimplifiedPageData from 'common/hooks/useSimplifiedPageData';
import useSnackbar from 'common/hooks/useSnackbar';
import useStackFetch from 'common/hooks/useStackFetch';
import { useRef } from 'react';
import { ReviewTemplate } from 'templates';
import { getElapsedTimeText } from 'utils';

interface ReviewTimelineContainerProps {
  sort?: RequestGetPublicReviewList['filter'];
}

function ReviewTimelineContainer({ sort = 'latest' }: ReviewTimelineContainerProps) {
  const reviewsLikeStack = useRef<Record<number, number>>({});

  const { addFetch } = useStackFetch(1000);
  const snackbar = useSnackbar();

  const timelineQuery = useGetInfiniteReviewPublicAnswer({
    page: 1,
    filter: sort,
  });
  const reviewMutations = useReviewMutations();

  const reviewsOrigin = useSimplifiedPageData(timelineQuery.data?.pages, 'reviews');

  const [reviews, reviewsOptimisticUpdater] = useOptimisticUpdate(reviewsOrigin);

  const handleGetNextPage = () => {
    timelineQuery.fetchNextPage();
  };

  const handleClickLikeButton = (reviewId: number, likes: number) => () => {
    if (!reviewsLikeStack.current[reviewId]) {
      reviewsLikeStack.current[reviewId] = 0;
    }

    const reviewLikeStack = (reviewsLikeStack.current[reviewId] += 1);

    addFetch(reviewId, () => fetchPostUpdateReviewLike({ reviewId, likes: reviewLikeStack }), {
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

  const handleDeleteReview = (reviewId: number) => async () => {
    if (!confirm('정말 해당 회고를 삭제하시겠습니까?\n삭제된 회고는 복구할 수 없습니다.')) {
      return;
    }

    const { deleteReview } = reviewMutations;

    try {
      await deleteReview.mutateAsync({ reviewId });

      snackbar.show({
        title: '회고가 삭제되었습니다.',
        description: '삭제된 회고는 복구할 수 없습니다.',
        theme: 'warning',
      });
    } catch (error) {
      const errorMessage = isAxiosError(error) ? error.message : '알 수 없는 오류가 발생하였습니다.';

      snackbar.show({
        title: '회고 삭제에 실패하였습니다.',
        description: errorMessage,
        theme: 'danger',
      });
    }
  };

  // useInfiniteQuery Params 버그 수정용
  const infiniteQueryBugFix = (reviews.length > 0 && reviews[0].id) || null;

  return (
    <FlexContainer key={infiniteQueryBugFix} gap="xlarge">
      {reviews.map(({ reviewTitle, reviewFormCode, ...review }) => (
        <ReviewTemplate
          key={review.id}
          id={review.id}
          title={reviewTitle}
          reviewFormCode={reviewFormCode}
          contents={review.contents}
          likes={review.likes}
          isPrivate={false}
          isEditable={review.isCreator}
          creator={review.creator}
          updatedAt={getElapsedTimeText(review.updatedAt)}
          onClickLikes={handleClickLikeButton}
          onClickDelete={handleDeleteReview}
        />
      ))}

      <Intersection disabled={reviews.length === 0 || timelineQuery.isLoading} onEnter={handleGetNextPage}>
        <ScrollObserverBox />
      </Intersection>
    </FlexContainer>
  );
}

const ScrollObserverBox = styled(FlexContainer)`
  width: 100%;
  height: 1px;
`;

export default ReviewTimelineContainer;
