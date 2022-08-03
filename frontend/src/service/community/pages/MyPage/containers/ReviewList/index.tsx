import { Link } from 'react-router-dom';

import useSnackbar from 'common/hooks/useSnackbar';

import { Text, Icon } from 'common/components';

import QuestionContent from 'service/@shared/components/QuestionContent';
import Reaction from 'service/review/components/Reaction';

import styles from './styles.module.scss';

import useMyPageQueries from '../../useMyPageQueries';
import { PAGE_LIST, MYPAGE_TAB } from 'service/@shared/constants';

function ReviewList({ filter }: Record<'filter', string>) {
  const { myReviews, myReviewForms } = useMyPageQueries();
  const { addSnackbar } = useSnackbar();

  const { deleteReviewMutation, deleteReviewFormMutation } = useMyPageQueries();

  const onDeleteReview = (reviewId: number) => () => {
    if (confirm('정말 회고를 삭제하시겠습니까?\n취소 후 복구를 할 수 없습니다.')) {
      deleteReviewMutation.mutate(reviewId, {
        onSuccess: () => {
          addSnackbar({
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
          addSnackbar({
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
                    <Icon className={styles.icon} code="edit"></Icon>
                  </Link>
                  <Icon
                    className={styles.icon}
                    code="delete"
                    onClick={onDeleteReview(review.reviewId)}
                  ></Icon>
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
                  <Text size={24}>{reviewForm.title}</Text>
                </Link>
                <div className={styles.buttonContainer}>
                  <Link
                    to={`${PAGE_LIST.REVIEW_FORM}/${reviewForm.code}`}
                    state={{ redirect: `${PAGE_LIST.MY_PAGE}` }}
                  >
                    <Icon className={styles.icon} code="edit"></Icon>
                  </Link>
                  <Icon
                    className={styles.icon}
                    code="delete"
                    onClick={onDeleteReviewForm(reviewForm.code)}
                  ></Icon>
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
