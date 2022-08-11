import { Link } from 'react-router-dom';

import useSnackbar from 'common/hooks/useSnackbar';

import { Text, Icon } from 'common/components';

import NoResult from 'service/@shared/components/NoResult';
import QuestionContent from 'service/@shared/components/QuestionContent';
import Reaction from 'service/review/components/Reaction';

import styles from './styles.module.scss';

import useMyPageQueries from '../../useMyPageQueries';
import { PAGE_LIST, MYPAGE_TAB } from 'service/@shared/constants';

function ReviewList({ filter }: Record<'filter', string>) {
  const { myReviews, myReviewForms } = useMyPageQueries();
  const { showSnackbar } = useSnackbar();

  const { deleteReviewMutation, deleteReviewFormMutation } = useMyPageQueries();

  const onDeleteReview = (reviewId: number) => () => {
    if (confirm('정말 회고를 삭제하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) {
      deleteReviewMutation.mutate(reviewId, {
        onSuccess: () => {
          showSnackbar({
            icon: 'delete',
            title: '작성한 회고가 삭제되었습니다.',
            description: '이제 누구도 해당 회고를 볼 수 없습니다.',
          });
        },
        onError: ({ message }) => {
          alert(message);
        },
      });
    }
  };

  const onDeleteReviewForm = (reviewFormCode: string) => () => {
    if (confirm('정말 회고를 삭제하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) {
      deleteReviewFormMutation.mutate(reviewFormCode, {
        onSuccess: () => {
          showSnackbar({
            icon: 'delete',
            title: '생성한 회고가 삭제되었습니다.',
            description: '이제 누구도 해당 회고를 볼 수 없습니다.',
          });
        },
        onError: ({ message }) => {
          alert(message);
        },
      });
    }
  };

  const noResultInMyReview = filter === MYPAGE_TAB.MY_REVIEWS && myReviews.reviews.length === 0;
  const noResultInMyReviewForm =
    filter === MYPAGE_TAB.MY_REVIEW_FORMS && myReviewForms.reviewForms.length === 0;

  if (noResultInMyReview) {
    return <NoResult className={styles.noResult}>작성한 회고가 없습니다.</NoResult>;
  }

  if (noResultInMyReviewForm) {
    return <NoResult className={styles.noResult}>생성한 회고가 없습니다.</NoResult>;
  }

  return (
    <>
      {filter === MYPAGE_TAB.MY_REVIEWS
        ? myReviews?.reviews.map((review) => (
            <div className={styles.reviewContainer} key={review.reviewId}>
              <div className={styles.header}>
                <Link
                  to={`${PAGE_LIST.REVIEW_OVERVIEW}/${review.reviewForm.code}`}
                  state={{ redirect: `${PAGE_LIST.MY_PAGE}` }}
                >
                  <Text className={styles.title} size={24} weight="bold">
                    {review.reviewForm.title}
                  </Text>
                </Link>

                <div className={styles.buttonContainer}>
                  <Link
                    to={`${PAGE_LIST.REVIEW}/${review.reviewForm.code}/${review.reviewId}`}
                    state={{ redirect: `${PAGE_LIST.MY_PAGE}` }}
                  >
                    <Icon className={styles.icon} code="edit" />
                  </Link>
                  <Icon
                    className={styles.icon}
                    code="delete"
                    onClick={onDeleteReview(review.reviewId)}
                  />
                </div>
              </div>

              <hr />

              <QuestionContent questions={review.answers}></QuestionContent>

              <hr />

              <Reaction />
            </div>
          ))
        : myReviewForms?.reviewForms.map((reviewForm) => (
            <div className={styles.reviewContainer} key={reviewForm.code}>
              <div className={styles.header}>
                <Link to={`${PAGE_LIST.REVIEW_OVERVIEW}/${reviewForm.code}`}>
                  <Text className={styles.title} size={24} weight="bold">
                    {reviewForm.title}
                  </Text>
                </Link>
                <div className={styles.buttonContainer}>
                  <Link
                    to={`${PAGE_LIST.REVIEW_FORM}/${reviewForm.code}?redirect=${encodeURIComponent(
                      PAGE_LIST.MY_PAGE,
                    )}`}
                  >
                    <Icon className={styles.icon} code="edit"></Icon>
                  </Link>
                  <Icon
                    className={styles.icon}
                    code="delete"
                    onClick={onDeleteReviewForm(reviewForm.code)}
                  />
                </div>
              </div>
              <hr />

              <QuestionContent questions={reviewForm.questions}></QuestionContent>

              <hr />

              <Reaction />
            </div>
          ))}
    </>
  );
}

export default ReviewList;
