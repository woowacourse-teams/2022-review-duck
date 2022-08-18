import { Link, useNavigate } from 'react-router-dom';

import useSnackbar from 'common/hooks/useSnackbar';

import { Text, Icon } from 'common/components';

import NoResult from 'service/@shared/components/NoResult';
import Questions from 'service/@shared/components/Questions';
import Reaction from 'service/review/components/Reaction';

import styles from './styles.module.scss';

import useProfilePageQueries from '../../useProfilePageQueries';
import { PAGE_LIST, USER_PROFILE_TAB } from 'service/@shared/constants';

interface ReviewList {
  socialId: string;
  filter: string;
}

function ReviewList({ filter, socialId }: ReviewList) {
  const navigate = useNavigate();

  const { myReviews, myReviewForms } = useProfilePageQueries(socialId);
  const { showSnackbar } = useSnackbar();

  const { deleteReviewMutation, deleteReviewFormMutation } = useProfilePageQueries(socialId);

  const handleClickEdit = (editLink: string) => () => {
    navigate(editLink);
  };

  const handleDeleteReview = (reviewId: number) => () => {
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

  const handleDeleteReviewForm = (reviewFormCode: string) => () => {
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

  const noResultInMyReview = filter === USER_PROFILE_TAB.REVIEWS && myReviews.reviews.length === 0;
  const noResultInMyReviewForm =
    filter === USER_PROFILE_TAB.REVIEW_FORMS && myReviewForms.reviewForms.length === 0;

  if (noResultInMyReview) {
    return <NoResult className={styles.noResult}>작성한 회고가 없습니다.</NoResult>;
  }

  if (noResultInMyReviewForm) {
    return <NoResult className={styles.noResult}>생성한 회고가 없습니다.</NoResult>;
  }

  return (
    <>
      {filter === USER_PROFILE_TAB.REVIEWS
        ? myReviews?.reviews.map((review) => (
            <div className={styles.reviewContainer} key={review.id}>
              <div className={styles.header}>
                <Link
                  to={`${PAGE_LIST.REVIEW_OVERVIEW}/${review.reviewForm.code}`}
                  state={{ redirect: `${PAGE_LIST.MY_PAGE}` }}
                >
                  <Text className={styles.title} size={24} weight="bold">
                    {review.reviewForm.title}
                  </Text>
                </Link>
              </div>

              <hr />

              <Questions>
                <Questions.EditButtons
                  isVisible={myReviews.isMine}
                  onClickEdit={handleClickEdit(
                    `${PAGE_LIST.REVIEW}/${review.reviewForm.code}/${review.id}`,
                  )}
                  onClickDelete={handleDeleteReview(review.id)}
                />
                {review.contents.map(({ answer, question }) => (
                  <Questions.Answer
                    key={question.id}
                    question={question.value}
                    description={question.description}
                  >
                    {answer.value}
                  </Questions.Answer>
                ))}
                <Questions.Reaction onClickLike={() => null} onClickBookmark={() => null} />
              </Questions>
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
              </div>
              <hr />

              <Questions>
                <Questions.EditButtons
                  isVisible={myReviews.isMine}
                  onClickEdit={handleClickEdit(
                    `${PAGE_LIST.REVIEW_FORM}/${reviewForm.code}?redirect=${encodeURIComponent(
                      PAGE_LIST.MY_PAGE,
                    )}`,
                  )}
                  onClickDelete={handleDeleteReviewForm(reviewForm.code)}
                />
                {reviewForm.questions.map((question) => (
                  <Questions.Answer
                    key={question.id}
                    question={question.value}
                    description={question.description}
                  />
                ))}
                <Questions.Reaction onClickLike={() => null} onClickBookmark={() => null} />
              </Questions>
            </div>
          ))}
    </>
  );
}

export default ReviewList;
