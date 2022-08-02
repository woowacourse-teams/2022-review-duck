import { Link, useNavigate } from 'react-router-dom';

import useDeleteReview from 'service/review/hooks/queries/useDeleteReview';
import useDeleteReviewForm from 'service/review/hooks/queries/useDeleteReviewForm';

import { Text, Icon } from 'common/components';

import QuestionContent from 'service/@shared/components/QuestionContent';
import Reaction from 'service/review/components/Reaction';

import styles from './styles.module.scss';

import useMyPageQueries from '../../useMyPageQueries';
import { PAGE_LIST, MYPAGE_TAB } from 'service/@shared/constants';

function ReviewList({ filter }: Record<'filter', string>) {
  const { myReviews, myReviewForms } = useMyPageQueries(filter);

  const deleteReviewMutation = useDeleteReview({
    onSuccess: () => {
      alert('회고를 삭제했습니다.');
    },
    onError: ({ message }) => {
      alert(message);
    },
  });

  const deleteReviewFormMutation = useDeleteReviewForm({
    onSuccess: () => {
      alert('회고폼을 삭제했습니다.');
    },
    onError: ({ message }) => {
      alert(message);
    },
  });

  const navigate = useNavigate();

  const onMoveToOverView = (reviewFormCode: string) => {
    navigate(`${PAGE_LIST.REVIEW_OVERVIEW}/${reviewFormCode}`);
    // TODO: 디자인 완성 후 선언적으로 해당 엘리먼트에 추가할 예정
  };

  const onEditReview = (reviewFormCode: string) => {
    navigate(`${PAGE_LIST.REVIEW}/${reviewFormCode}`);
    // TODO: 디자인 완성 후 선언적으로 해당 엘리먼트에 추가할 예정
  };

  const onEditReviewForm = (reviewFormCode: string) => {
    navigate(`${PAGE_LIST.REVIEW_FORM}/${reviewFormCode}`);
    // TODO: 디자인 완성 후 선언적으로 해당 엘리먼트에 추가할 예정
  };

  const onDeleteReview = (reviewId: number) => {
    deleteReviewMutation.mutate(reviewId);
    // TODO: 디자인 완성 후 해당 엘리먼트에 이벤트 등록 예정
  };

  const onDeleteReviewForm = (reviewFormCode: string) => {
    deleteReviewFormMutation.mutate(reviewFormCode);
    // TODO: 디자인 완성 후 해당 엘리먼트에 이벤트 등록 예정
  };

  return (
    <>
      <div className={styles.title}>
        <Text size={20}>
          {filter === MYPAGE_TAB.MY_REVIEWS ? '내가 작성한 회고' : '내가 생성한 회고'}
        </Text>
      </div>

      {filter === MYPAGE_TAB.MY_REVIEWS
        ? myReviews?.reviews.map((review) => (
            <div className={styles.reviewContainer} key={review.reviewId}>
              <div className={styles.header}>
                <Text size={24}>{review.reviewForm.title}</Text>
                <div className={styles.buttonContainer}>
                  <Icon code="arrow_right_alt"></Icon>
                  <Icon code="edit"></Icon>
                  <Icon code="delete"></Icon>
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
                <Text size={24}>{reviewForm.title}</Text>
                <div className={styles.buttonContainer}>
                  <Icon code="arrow_right_alt"></Icon>
                  <Link
                    to={`${PAGE_LIST.REVIEW_FORM}/${reviewForm.code}`}
                    state={{ redirect: `${PAGE_LIST.MY_PAGE}` }}
                  >
                    <Icon code="edit"></Icon>
                  </Link>
                  <Icon code="delete"></Icon>
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
