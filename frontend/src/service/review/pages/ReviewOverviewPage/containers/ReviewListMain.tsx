import cn from 'classnames';

import { Review } from 'service/review/types';

import QuestionContent from 'service/@shared/components/QuestionContent';
import Profile from 'service/review/components/Profile';
import Reaction from 'service/review/components/Reaction';

import styles from '../styles.module.scss';
import useOverviewQueries from '../useOverviewQueries';

function ReviewListMain({ reviewFormCode }: Record<'reviewFormCode', string>) {
  const { reviews: myReviews } = useOverviewQueries(reviewFormCode);

  const { reviews = [] } = myReviews || {};

  return (
    <div className={styles.participantContainer}>
      <section className={styles.articleContainer}>
        <div className={styles.title}>
          <h5>이 회고에 참여한 사람</h5>
        </div>

        <div className={styles.profileList}>
          {reviews.map((review: Review) => (
            <Profile
              image={review.participant.profileUrl}
              key={review.reviewId}
              title={review.participant.nickname}
              description="1일 전"
            />
          ))}
        </div>
      </section>

      {reviews.map((review: Review) => (
        <section
          className={cn(styles.articleContainer, styles.postContainer)}
          key={review.reviewId}
        >
          <Profile
            key={review.reviewId}
            type="round"
            image={review.participant.profileUrl}
            title={`${review.participant.nickname}의 회고`}
            description="오늘, 1회 조회됨"
          />

          <hr />

          <QuestionContent questions={review.answers} />

          <hr />

          <Reaction />
        </section>
      ))}
    </div>
  );
}

export default ReviewListMain;
